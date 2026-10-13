const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

// Las reglas replican las validaciones del formulario de Angular para que la API no dependa del cliente.
export const esquemaLibro = {
  titulo: { tipo: 'string', requerido: true, minLength: 2 },
  autor: { tipo: 'string', requerido: true, minLength: 3 },
  isbn: { tipo: 'string', requerido: true, patron: /^97[89]-\d{10}$/, mensaje: 'Formato esperado: 978-XXXXXXXXXX' },
  categoria: { tipo: 'string', requerido: true },
  anio: { tipo: 'integer', requerido: true, min: 1450, max: new Date().getFullYear() },
  precio: { tipo: 'number', requerido: true, min: 0.1 },
  stock: { tipo: 'integer', requerido: true, min: 0, max: 100 },
  portada: { tipo: 'string', defecto: '', patron: /^https?:\/\/.+/, mensaje: 'Debe ser una URL http(s)' },
  descripcion: { tipo: 'string', requerido: true, maxLength: 500 },
};

export const esquemaCategoria = {
  nombre: { tipo: 'string', requerido: true, minLength: 2 },
};

export const esquemaPrestamo = {
  libroId: { tipo: 'integer', requerido: true, min: 1 },
  tituloLibro: { tipo: 'string', requerido: true },
  lector: { tipo: 'string', requerido: true, minLength: 3 },
  email: { tipo: 'string', requerido: true, patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensaje: 'Email inválido' },
  fechaPrestamo: { tipo: 'string', requerido: true, patron: FECHA_ISO, mensaje: 'Formato esperado: AAAA-MM-DD' },
  fechaDevolucion: { tipo: 'string', requerido: true, patron: FECHA_ISO, mensaje: 'Formato esperado: AAAA-MM-DD' },
  devuelto: { tipo: 'boolean', defecto: false },
};
