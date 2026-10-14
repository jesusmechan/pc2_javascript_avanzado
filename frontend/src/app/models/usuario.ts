export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin';
  /** Ausente en sesiones guardadas antes de que la API lo enviara. */
  creadoEn?: string;
}

export interface Sesion {
  token: string;
  usuario: Usuario;
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}
