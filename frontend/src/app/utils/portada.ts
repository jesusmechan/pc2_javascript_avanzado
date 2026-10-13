export const PORTADA_POR_DEFECTO = 'https://placehold.co/300x450/ebe7de/6b6f80?text=Sin+portada';

/** Open Library responde con una imagen de 1x1 px (sin error HTTP) cuando no tiene la portada. */
export function esPortadaVacia(img: HTMLImageElement): boolean {
  return img.naturalWidth <= 1;
}

export function portadaExiste(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(!esPortadaVacia(img));
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/** Manejador para `(load)` y `(error)`: reemplaza la imagen por la portada genérica si no existe. */
export function usarPortadaPorDefecto(evento: Event): boolean {
  const img = evento.target as HTMLImageElement;
  if (evento.type === 'load' && !esPortadaVacia(img)) return true;
  if (img.src !== PORTADA_POR_DEFECTO) img.src = PORTADA_POR_DEFECTO;
  return false;
}
