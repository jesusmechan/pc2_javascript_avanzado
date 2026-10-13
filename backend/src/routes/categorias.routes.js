import { HttpError } from '../errors/http-error.js';
import { esquemaCategoria } from '../validators/esquemas.js';
import { crearRouterCrud } from './crear-router-crud.js';

export const categoriasRouter = crearRouterCrud({
  coleccion: 'categorias',
  recurso: 'Categoría',
  esquema: esquemaCategoria,
  validarReglas: (categoria, { db, id }) => {
    const nombre = categoria.nombre.toLowerCase();
    if (db.categorias.some((c) => c.nombre.toLowerCase() === nombre && c.id !== id)) {
      throw new HttpError(409, `La categoría "${categoria.nombre}" ya existe`);
    }
    // Los libros guardan el nombre de la categoría, así que renombrarla dejaría libros huérfanos.
    const actual = db.categorias.find((c) => c.id === id);
    if (actual && actual.nombre !== categoria.nombre && db.libros.some((l) => l.categoria === actual.nombre)) {
      throw new HttpError(409, `La categoría "${actual.nombre}" tiene libros asociados y no puede renombrarse`);
    }
  },
  validarEliminacion: (categoria, { db }) => {
    if (db.libros.some((l) => l.categoria === categoria.nombre)) {
      throw new HttpError(409, `La categoría "${categoria.nombre}" tiene libros asociados`);
    }
  },
});
