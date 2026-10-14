import { Router } from 'express';
import { obtenerColeccion, siguienteId, transaccion } from '../db/json-db.js';
import { datosInvalidos, HttpError } from '../errors/http-error.js';
import { requerirSesion } from '../middlewares/autenticar.js';
import { validarPago } from '../services/pagos.js';
import { construirCompra, construirSuscripcion, numeroPedido } from '../services/pedidos.js';

export const pedidosRouter = Router();

pedidosRouter.get('/', requerirSesion, async (req, res) => {
  const pedidos = await obtenerColeccion('pedidos');
  res.json(
    pedidos.filter((p) => p.usuarioId === req.usuario.id).sort((a, b) => b.fecha.localeCompare(a.fecha))
  );
});

/**
 * Crea un pedido con pago simulado.
 * - `tipo: 'compra'`: `{ items: [{ productoId, cantidad }], pago }`. Se permite comprar como invitado.
 * - `tipo: 'suscripcion'`: `{ mascotaId, entrega: { direccion, horario }, pago }`. Requiere sesión y tarjeta.
 */
pedidosRouter.post('/', async (req, res) => {
  const { tipo } = req.body ?? {};
  if (tipo !== 'compra' && tipo !== 'suscripcion') {
    throw datosInvalidos({ tipo: 'Debe ser "compra" o "suscripcion"' });
  }
  if (tipo === 'suscripcion' && !req.usuario) {
    throw new HttpError(401, req.sesionVencida ? 'La sesión expiró, vuelve a iniciar sesión' : 'Debes iniciar sesión para suscribirte');
  }
  const pago = validarPago(req.body.pago, { soloTarjeta: tipo === 'suscripcion' });

  const pedido = await transaccion((db) => {
    db.pedidos ??= [];
    let detalle;
    if (tipo === 'compra') {
      detalle = construirCompra(req.body.items, db.productos);
    } else {
      const suscripcion = construirSuscripcion(req.body, db.mascotas, req.usuario.id);
      // Solo se marca activa dentro de la misma transacción en que se registra el pago.
      Object.assign(suscripcion.mascota, { entrega: suscripcion.entrega, suscripcionActiva: true });
      detalle = suscripcion.detalle;
    }

    const id = siguienteId(db.pedidos);
    const nuevo = {
      id,
      numero: numeroPedido(id),
      usuarioId: req.usuario?.id ?? null,
      tipo,
      ...detalle,
      pago,
      estado: 'pagado',
      fecha: new Date().toISOString(),
    };
    db.pedidos.push(nuevo);
    return nuevo;
  });

  res.status(201).location(`${req.baseUrl}/${pedido.id}`).json(pedido);
});
