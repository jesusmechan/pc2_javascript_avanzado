import { HttpError } from '../errors/http-error.js';
import { esquemaPrestamo } from '../validators/esquemas.js';
import { crearRouterCrud } from './crear-router-crud.js';

export const prestamosRouter = crearRouterCrud({
  coleccion: 'prestamos',
  recurso: 'Préstamo',
  esquema: esquemaPrestamo,
  validarReglas: (prestamo, { db }) => {
    if (!db.libros.some((l) => l.id === prestamo.libroId)) {
      throw new HttpError(400, 'Datos inválidos', { libroId: `El libro con id ${prestamo.libroId} no existe` });
    }
    // Comparación de texto válida porque ambas fechas tienen formato AAAA-MM-DD.
    if (prestamo.fechaDevolucion < prestamo.fechaPrestamo) {
      throw new HttpError(400, 'Datos inválidos', {
        fechaDevolucion: 'No puede ser anterior a la fecha de préstamo',
      });
    }
  },
});
