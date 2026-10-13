import { Router } from 'express';
import { modificar, obtenerColeccion, siguienteId } from '../db/json-db.js';
import { HttpError, noEncontrado } from '../errors/http-error.js';
import { validar } from '../validators/validar.js';

function parsearId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

/** Filtro por igualdad sobre los campos del esquema, ej. `GET /libros?categoria=Novela`. */
function filtrar(items, query, campos) {
  const filtros = Object.entries(query).filter(([campo]) => campos.includes(campo));
  return items.filter((item) => filtros.every(([campo, valor]) => String(item[campo]) === String(valor)));
}

/**
 * Genera las rutas REST estándar de una colección:
 * GET /, GET /:id, POST /, PUT /:id, PATCH /:id y DELETE /:id.
 *
 * - `validarReglas(entidad, { db, id })`: reglas que dependen de otros datos (unicidad, relaciones).
 * - `validarEliminacion(entidad, { db })`: impide borrar registros en uso.
 */
export function crearRouterCrud({ coleccion, recurso, esquema, validarReglas = () => {}, validarEliminacion = () => {} }) {
  const router = Router();
  const campos = ['id', ...Object.keys(esquema)];

  router.get('/', async (req, res) => {
    const items = await obtenerColeccion(coleccion);
    res.json(filtrar(items, req.query, campos));
  });

  router.get('/:id', async (req, res) => {
    const id = parsearId(req.params.id);
    const item = (await obtenerColeccion(coleccion)).find((i) => i.id === id);
    if (!item) throw noEncontrado(recurso, id);
    res.json(item);
  });

  router.post('/', async (req, res) => {
    const datos = validar(esquema, req.body);
    const creado = await modificar(coleccion, (items, db) => {
      validarReglas(datos, { db, id: null });
      const nuevo = { id: siguienteId(items), ...datos };
      items.push(nuevo);
      return nuevo;
    });
    res.status(201).location(`${req.baseUrl}/${creado.id}`).json(creado);
  });

  const actualizar = (parcial) => async (req, res) => {
    const id = parsearId(req.params.id);
    const cambios = validar(esquema, req.body, { parcial });
    const actualizado = await modificar(coleccion, (items, db) => {
      const indice = items.findIndex((i) => i.id === id);
      if (indice === -1) throw noEncontrado(recurso, id);
      const entidad = parcial ? { ...items[indice], ...cambios } : { id, ...cambios };
      validarReglas(entidad, { db, id });
      items[indice] = entidad;
      return entidad;
    });
    res.json(actualizado);
  };

  router.put('/:id', actualizar(false));
  router.patch('/:id', actualizar(true));

  router.delete('/:id', async (req, res) => {
    const id = parsearId(req.params.id);
    await modificar(coleccion, (items, db) => {
      const indice = items.findIndex((i) => i.id === id);
      if (indice === -1) throw noEncontrado(recurso, id);
      validarEliminacion(items[indice], { db });
      items.splice(indice, 1);
    });
    res.status(204).end();
  });

  return router;
}
