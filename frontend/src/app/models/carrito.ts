import { Producto } from './producto';

/** Copia mínima del producto: el carrito vive en localStorage y no depende de la API para mostrarse. */
export type ProductoEnCarrito = Pick<Producto, 'id' | 'nombre' | 'precio' | 'imagen'>;

export interface ItemCarrito {
  producto: ProductoEnCarrito;
  cantidad: number;
}
