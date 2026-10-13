import { HttpError } from '../errors/http-error.js';
import { esquemaLibro } from '../validators/esquemas.js';
import { crearRouterCrud } from './crear-router-crud.js';

export const librosRouter = crearRouterCrud({
  coleccion: 'libros',
  recurso: 'Libro',
  esquema: esquemaLibro,
  validarReglas: (libro, { db, id }) => {
    if (!db.categorias.some((c) => c.nombre === libro.categoria)) {
      throw new HttpError(400, 'Datos inválidos', { categoria: `La categoría "${libro.categoria}" no existe` });
    }
    if (db.libros.some((l) => l.isbn === libro.isbn && l.id !== id)) {
      throw new HttpError(409, `Ya existe un libro con ISBN ${libro.isbn}`);
    }
  },
  validarEliminacion: (libro, { db }) => {
    if (db.prestamos.some((p) => p.libroId === libro.id && !p.devuelto)) {
      throw new HttpError(409, `"${libro.titulo}" tiene préstamos activos y no puede eliminarse`);
    }
  },
});
