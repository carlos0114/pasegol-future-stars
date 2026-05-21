// Configuración de la rotación de perfiles del showcase en la landing.
// Podés editar estos valores directamente o sobreescribirlos vía variables
// de entorno en el archivo .env (prefijo VITE_ para que Vite las exponga).
//
// Variables soportadas:
//   VITE_SHOWCASE_ROTATION_START  -> fecha ISO, ej: "2026-05-18T00:00:00Z"
//   VITE_SHOWCASE_ROTATION_DAYS   -> número de días entre rotaciones, ej: "7"

const DEFAULT_START = "2026-05-18T00:00:00Z";
const DEFAULT_DAYS = 7;

// Regex laxa para validar formato ISO 8601 (fecha o fecha+hora opcional con zona).
const ISO_DATE_REGEX =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

const isValidIsoDate = (value: string): boolean => {
  if (!ISO_DATE_REGEX.test(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
};

const resolveStart = (): number => {
  const raw = import.meta.env.VITE_SHOWCASE_ROTATION_START as string | undefined;
  if (raw === undefined || raw === "") return Date.parse(DEFAULT_START);

  if (!isValidIsoDate(raw)) {
    console.warn(
      `[showcaseRotation] VITE_SHOWCASE_ROTATION_START="${raw}" no es una fecha ISO válida. ` +
        `Usando valor por defecto "${DEFAULT_START}".`,
    );
    return Date.parse(DEFAULT_START);
  }

  return Date.parse(raw);
};

const resolveDays = (): number => {
  const raw = import.meta.env.VITE_SHOWCASE_ROTATION_DAYS as string | undefined;
  if (raw === undefined || raw === "") return DEFAULT_DAYS;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
    console.warn(
      `[showcaseRotation] VITE_SHOWCASE_ROTATION_DAYS="${raw}" no es un número entero positivo. ` +
        `Usando valor por defecto ${DEFAULT_DAYS}.`,
    );
    return DEFAULT_DAYS;
  }

  return parsed;
};

export const showcaseRotationConfig = {
  /** Fecha desde la cual empieza la rotación (timestamp ms). */
  startTimestamp: resolveStart(),
  /** Cantidad de días entre cada rotación. */
  intervalDays: resolveDays(),
};
