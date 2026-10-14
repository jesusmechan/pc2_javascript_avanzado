export const IMAGEN_RESPALDO = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop';

/** Reemplaza una imagen rota por la de respaldo; se desactiva tras el primer intento para no entrar en bucle. */
export function usarImagenRespaldo(evento: Event): void {
  const img = evento.target as HTMLImageElement;
  if (img.dataset['respaldo']) return;
  img.dataset['respaldo'] = '1';
  img.src = IMAGEN_RESPALDO;
}
