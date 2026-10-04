export interface Prestamo {
  id?: number;
  libroId: number;
  tituloLibro: string;
  lector: string;
  email: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  devuelto: boolean;
}
