import { datosInvalidos } from '../errors/http-error.js';
import { esquemaPagoEfectivo, esquemaPagoTarjeta, esquemaPagoYape } from '../validators/esquemas.js';
import { validar } from '../validators/validar.js';

export const METODOS_PAGO = ['tarjeta', 'yape', 'efectivo'];

/** Algoritmo de Luhn: detecta errores de tipeo en números de tarjeta. */
export function esTarjetaValida(numero) {
  const limpio = numero.replace(/\s/g, '');
  if (!/^\d{16}$/.test(limpio)) return false;

  let suma = 0;
  let alternar = false;
  for (let i = limpio.length - 1; i >= 0; i--) {
    let digito = Number(limpio[i]);
    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    alternar = !alternar;
  }
  return suma % 10 === 0;
}

function vencimientoVigente(vencimiento) {
  const [mes, anio] = vencimiento.split('/').map(Number);
  // El día 0 del mes siguiente es el último día del mes de vencimiento.
  const finDeMes = new Date(2000 + anio, mes, 0, 23, 59, 59);
  return finDeMes >= new Date();
}

/**
 * Valida los datos del método de pago y devuelve solo lo que se puede guardar:
 * de la tarjeta se conservan los últimos 4 dígitos, nunca el número completo ni el CVV.
 */
export function validarPago(pago, { soloTarjeta = false } = {}) {
  const metodo = pago?.metodo;
  const permitidos = soloTarjeta ? ['tarjeta'] : METODOS_PAGO;
  if (!permitidos.includes(metodo)) {
    throw datosInvalidos({ metodo: `Debe ser uno de: ${permitidos.join(', ')}` });
  }

  if (metodo === 'tarjeta') {
    const datos = validar(esquemaPagoTarjeta, pago);
    const errores = {};
    if (!esTarjetaValida(datos.numero)) errores.numero = 'Número de tarjeta inválido';
    if (!vencimientoVigente(datos.vencimiento)) errores.vencimiento = 'La tarjeta está vencida';
    if (Object.keys(errores).length) throw datosInvalidos(errores);
    return { metodo, titular: datos.titular, ultimos4: datos.numero.replace(/\s/g, '').slice(-4), email: datos.email.toLowerCase() };
  }

  if (metodo === 'yape') {
    const datos = validar(esquemaPagoYape, pago);
    return { metodo, telefono: datos.telefono, codigoOperacion: datos.codigoOperacion, email: datos.email.toLowerCase() };
  }

  const datos = validar(esquemaPagoEfectivo, pago);
  return { metodo, nombre: datos.nombre, telefono: datos.telefono, direccion: datos.direccion };
}
