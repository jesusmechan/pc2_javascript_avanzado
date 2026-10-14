import { computed, Injectable, signal } from '@angular/core';
import { ItemCarrito, ProductoEnCarrito } from '../models/carrito';

const STORAGE_KEY = 'dancypet-cart';
export const IGV_PORCENTAJE = 0.18;
export const MAX_CANTIDAD = 99;

const redondear = (valor: number) => Math.round(valor * 100) / 100;

/** Carrito de compras persistido en localStorage. Los totales son orientativos: la API recalcula los precios. */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>(this.cargar());

  readonly items = this._items.asReadonly();
  readonly abierto = signal(false);
  readonly cantidadTotal = computed(() => this._items().reduce((acum, item) => acum + item.cantidad, 0));
  readonly subtotal = computed(() =>
    redondear(this._items().reduce((acum, item) => acum + item.producto.precio * item.cantidad, 0))
  );
  readonly igv = computed(() => redondear(this.subtotal() * IGV_PORCENTAJE));
  readonly total = computed(() => redondear(this.subtotal() + this.igv()));
  readonly estaVacio = computed(() => this._items().length === 0);

  agregar({ id, nombre, precio, imagen }: ProductoEnCarrito, cantidad = 1): void {
    const existente = this._items().find((item) => item.producto.id === id);
    if (existente) {
      this.cambiarCantidad(id, cantidad);
      return;
    }
    this.actualizar([...this._items(), { producto: { id, nombre, precio, imagen }, cantidad: Math.min(cantidad, MAX_CANTIDAD) }]);
  }

  /** Suma `delta` a la cantidad; si llega a 0 el producto se quita del carrito. */
  cambiarCantidad(id: number, delta: number): void {
    const items = this._items()
      .map((item) =>
        item.producto.id === id ? { ...item, cantidad: Math.min(item.cantidad + delta, MAX_CANTIDAD) } : item
      )
      .filter((item) => item.cantidad > 0);
    this.actualizar(items);
  }

  eliminar(id: number): void {
    this.actualizar(this._items().filter((item) => item.producto.id !== id));
  }

  vaciar(): void {
    this.actualizar([]);
  }

  private actualizar(items: ItemCarrito[]): void {
    this._items.set(items);
    try {
      const datos = items.map(({ producto, cantidad }) => ({ ...producto, cantidad }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error);
    }
  }

  private cargar(): ItemCarrito[] {
    try {
      const datos: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(datos)) return [];
      return datos
        .filter((d) => Number.isInteger(d?.id) && typeof d.precio === 'number' && Number.isInteger(d.cantidad) && d.cantidad > 0)
        .map(({ id, nombre, precio, imagen, cantidad }) => ({
          producto: { id, nombre: String(nombre), precio, imagen: String(imagen) },
          cantidad: Math.min(cantidad, MAX_CANTIDAD),
        }));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }
}
