// Sistema central de Analytics propio de PaseGol.
// Registra eventos en la tabla `analytics_events` (Lovable Cloud).
//
// Reglas:
// - Nunca rompe la app: todos los errores se manejan en silencio.
// - Nunca guarda contraseñas, tokens, cookies ni emails.
// - actor_profile_id / actor_user_type se resuelven desde la sesión real
//   (no se aceptan por parámetro), evitando suplantación.

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AnalyticsEventName = Database["public"]["Enums"]["analytics_event"];

/** Lista de eventos válidos (espejo del enum en la base de datos). */
export const ANALYTICS_EVENTS: readonly AnalyticsEventName[] = [
  "user_signup",
  "user_login",
  "profile_created",
  "profile_completed",
  "photo_uploaded",
  "video_uploaded",
  "video_view",
  "player_profile_view",
  "scout_profile_view",
  "club_profile_view",
  "scout_registered",
  "club_registered",
  "contact_made",
  "seeking_opportunities",
  "movement_joined",
  "search_performed",
  "banner_impression",
  "banner_click",
] as const;

export const isValidEventName = (name: unknown): name is AnalyticsEventName =>
  typeof name === "string" &&
  (ANALYTICS_EVENTS as readonly string[]).includes(name);

export interface LogEventOptions {
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  /** Sobrescribe el path detectado automáticamente (opcional). */
  path?: string | null;
}

const SESSION_KEY = "pasegol_analytics_session_id";

/** Claves que jamás se envían dentro de metadata. */
const SENSITIVE_KEYS = [
  "password",
  "pass",
  "token",
  "access_token",
  "refresh_token",
  "jwt",
  "cookie",
  "cookies",
  "email",
  "mail",
  "phone",
  "telefono",
  "secret",
  "apikey",
  "api_key",
  "authorization",
];

const isSensitiveKey = (key: string) => {
  const k = key.toLowerCase();
  return SENSITIVE_KEYS.some((s) => k.includes(s));
};

/** Quita claves sensibles y valores no serializables de metadata. */
export const sanitizeMetadata = (
  metadata?: Record<string, unknown>
): Record<string, unknown> => {
  if (!metadata || typeof metadata !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (isSensitiveKey(key)) continue;
    if (value === null || value === undefined) continue;
    const t = typeof value;
    if (t === "string" || t === "number" || t === "boolean") {
      out[key] = t === "string" ? (value as string).slice(0, 500) : value;
    }
  }
  return out;
};

/** Devuelve (creando si hace falta) el session_id para agrupar eventos. */
export const getSessionId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
};

interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

const getUtmParams = (): UtmParams => {
  const empty: UtmParams = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
  };
  if (typeof window === "undefined") return empty;
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get("utm_source"),
      utm_medium: p.get("utm_medium"),
      utm_campaign: p.get("utm_campaign"),
    };
  } catch {
    return empty;
  }
};

const getPath = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.location.pathname;
  } catch {
    return null;
  }
};

const getReferrer = (): string | null => {
  if (typeof document === "undefined") return null;
  try {
    return document.referrer ? document.referrer.slice(0, 500) : null;
  } catch {
    return null;
  }
};

/** Cache del tipo de usuario para evitar consultas repetidas por sesión. */
const userTypeCache = new Map<string, string | null>();

const resolveActor = async (): Promise<{
  actor_profile_id: string | null;
  actor_user_type: string | null;
}> => {
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id ?? null;
    if (!userId) return { actor_profile_id: null, actor_user_type: null };

    if (userTypeCache.has(userId)) {
      return {
        actor_profile_id: userId,
        actor_user_type: userTypeCache.get(userId) ?? null,
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", userId)
      .maybeSingle();

    const userType = profile?.user_type ?? null;
    userTypeCache.set(userId, userType);
    return { actor_profile_id: userId, actor_user_type: userType };
  } catch {
    return { actor_profile_id: null, actor_user_type: null };
  }
};

/**
 * Registra un evento de analytics. Nunca lanza excepciones.
 * @returns true si el evento se insertó correctamente.
 *
 * Ejemplo:
 *   await logEvent("video_view", { targetType: "player", targetId: playerId });
 */
export const logEvent = async (
  eventName: AnalyticsEventName,
  options: LogEventOptions = {}
): Promise<boolean> => {
  try {
    if (!isValidEventName(eventName)) {
      if (import.meta.env?.DEV) {
        console.warn("[analytics] evento inválido ignorado:", eventName);
      }
      return false;
    }

    const actor = await resolveActor();
    const utm = getUtmParams();

    const { error } = await supabase.from("analytics_events").insert({
      event_name: eventName,
      actor_profile_id: actor.actor_profile_id,
      actor_user_type: actor.actor_user_type,
      session_id: getSessionId(),
      path: options.path !== undefined ? options.path : getPath(),
      referrer: getReferrer(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      target_type: options.targetType ?? null,
      target_id: options.targetId ?? null,
      metadata: sanitizeMetadata(options.metadata) as Json,
    });

    if (error) {
      if (import.meta.env?.DEV) {
        console.warn("[analytics] insert falló:", error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn("[analytics] logEvent falló:", err);
    }
    return false;
  }
};

/** Limpia el cache interno (solo para tests). */
export const __resetAnalyticsCache = () => userTypeCache.clear();
