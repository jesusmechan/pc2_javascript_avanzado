import { Entrega } from './mascota';

export type MetodoPago = 'tarjeta' | 'yape' | 'efectivo';

export interface PagoTarjeta {
  metodo: 'tarjeta';
  numero: string;
  titular: string;
  vencimiento: string;
  cvv: string;
  email: string;
}

export interface PagoYape {
  metodo: 'yape';
  telefono: string;
  codigoOperacion: string;
  email: string;
}

export interface PagoEfectivo {
  metodo: 'efectivo';
  nombre: string;
  telefono: string;
  direccion: string;
}

export type Pago = PagoTarjeta | PagoYape | PagoEfectivo;

export interface LineaPedido {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  numero: string;
  tipo: 'compra' | 'suscripcion';
  items?: LineaPedido[];
  mascotaNombre?: string;
  entrega?: Entrega;
  subtotal: number;
  igv: number;
  total: number;
  pago: { metodo: MetodoPago; ultimos4?: string };
  estado: string;
  fecha: string;
}
