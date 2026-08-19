import { describe, it, expect, vi, beforeEach } from "vitest";

const insertMock = vi.fn();
const getSessionMock = vi.fn();
const maybeSingleMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getSession: (...a: unknown[]) => getSessionMock(...a) },
    from: (table: string) => {
      if (table === "analytics_events") {
        return { insert: (payload: unknown) => insertMock(payload) };
      }
      return {
        select: () => ({
          eq: () => ({ maybeSingle: () => maybeSingleMock() }),
        }),
      };
    },
  },
}));

import {
  logEvent,
  sanitizeMetadata,
  isValidEventName,
  getSessionId,
  __resetAnalyticsCache,
} from "@/lib/logEvent";

beforeEach(() => {
  insertMock.mockReset().mockResolvedValue({ error: null });
  getSessionMock.mockReset().mockResolvedValue({ data: { session: null } });
  maybeSingleMock.mockReset().mockResolvedValue({ data: null });
  __resetAnalyticsCache();
  window.sessionStorage.clear();
});

describe("logEvent", () => {
  it("registra un evento anónimo con actor_profile_id null y session_id", async () => {
    const ok = await logEvent("banner_impression", { targetType: "banner" });
    expect(ok).toBe(true);
    const payload = insertMock.mock.calls[0][0];
    expect(payload.event_name).toBe("banner_impression");
    expect(payload.actor_profile_id).toBeNull();
    expect(payload.actor_user_type).toBeNull();
    expect(payload.session_id).toBeTruthy();
    expect(payload.target_type).toBe("banner");
  });

  it("registra un evento autenticado con el usuario y tipo correctos", async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: "user-123" } } },
    });
    maybeSingleMock.mockResolvedValue({ data: { user_type: "scout" } });

    const ok = await logEvent("player_profile_view", { targetId: "p-1" });
    expect(ok).toBe(true);
    const payload = insertMock.mock.calls[0][0];
    expect(payload.actor_profile_id).toBe("user-123");
    expect(payload.actor_user_type).toBe("scout");
    expect(payload.target_id).toBe("p-1");
  });

  it("no envía eventos con nombre inválido", async () => {
    // @ts-expect-error prueba de nombre inválido en runtime
    const ok = await logEvent("evento_inventado");
    expect(ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("un error de analytics no interrumpe la app", async () => {
    insertMock.mockRejectedValue(new Error("network down"));
    await expect(logEvent("user_login")).resolves.toBe(false);

    insertMock.mockReset().mockResolvedValue({ error: { message: "RLS" } });
    await expect(logEvent("user_login")).resolves.toBe(false);

    getSessionMock.mockRejectedValue(new Error("auth down"));
    insertMock.mockReset().mockResolvedValue({ error: null });
    await expect(logEvent("user_login")).resolves.toBe(true);
  });

  it("reutiliza el mismo session_id dentro de la sesión", () => {
    const a = getSessionId();
    const b = getSessionId();
    expect(a).toBe(b);
  });

  it("descarta información sensible de metadata", () => {
    const clean = sanitizeMetadata({
      password: "1234",
      access_token: "abc",
      email: "a@b.com",
      cookie: "x",
      parent_phone: "099",
      position: "delantero",
      count: 3,
      flag: true,
      nested: { a: 1 },
    });
    expect(clean).toEqual({ position: "delantero", count: 3, flag: true });
  });

  it("valida nombres de eventos del enum", () => {
    expect(isValidEventName("video_view")).toBe(true);
    expect(isValidEventName("nope")).toBe(false);
  });
});
