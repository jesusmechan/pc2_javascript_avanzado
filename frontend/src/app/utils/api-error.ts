import { HttpErrorResponse } from '@angular/common/http';

/** Convierte la respuesta de error de la API (`{ error, detalles }`) en un mensaje legible. */
export function mensajeDeError(err: unknown, porDefecto = 'Ocurrió un error inesperado.'): string {
  if (!(err instanceof HttpErrorResponse)) return porDefecto;
  if (err.status === 0) return 'No se pudo conectar con la API. Ejecuta "npm run api".';

  const cuerpo = err.error as { error?: string; detalles?: Record<string, string> } | null;
  const detalles = cuerpo?.detalles ? Object.values(cuerpo.detalles).join(' · ') : '';
  return [cuerpo?.error, detalles].filter(Boolean).join(': ') || porDefecto;
}
