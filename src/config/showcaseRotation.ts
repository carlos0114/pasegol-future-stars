// Configuración de la rotación de perfiles del showcase en la landing.
// Podés editar estos valores directamente o sobreescribirlos vía variables
// de entorno en el archivo .env (prefijo VITE_ para que Vite las exponga).
//
// Variables soportadas:
//   VITE_SHOWCASE_ROTATION_START  -> fecha ISO, ej: "2026-05-18T00:00:00Z"
//   VITE_SHOWCASE_ROTATION_DAYS   -> número de días entre rotaciones, ej: "7"

const DEFAULT_START = "2026-05-18T00:00:00Z";
const DEFAULT_DAYS = 7;

const envStart = import.meta.env.VITE_SHOWCASE_ROTATION_START as string | undefined;
const envDays = import.meta.env.VITE_SHOWCASE_ROTATION_DAYS as string | undefined;

const parsedStart = envStart ? Date.parse(envStart) : NaN;
const parsedDays = envDays ? Number(envDays) : NaN;

export const showcaseRotationConfig = {
  /** Fecha desde la cual empieza la rotación (timestamp ms). */
  startTimestamp: Number.isFinite(parsedStart) ? parsedStart : Date.parse(DEFAULT_START),
  /** Cantidad de días entre cada rotación. */
  intervalDays: Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : DEFAULT_DAYS,
};
