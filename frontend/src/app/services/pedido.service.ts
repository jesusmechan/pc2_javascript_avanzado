import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ItemCarrito } from '../models/carrito';
import { Entrega } from '../models/mascota';
import { Pago, PagoTarjeta, Pedido } from '../models/pedido';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/pedidos`;

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url);
  }

  /** Solo se envían ids y cantidades: la API toma los precios del catálogo. */
  comprar(items: ItemCarrito[], pago: Pago): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, {
      tipo: 'compra',
      items: items.map(({ producto, cantidad }) => ({ productoId: producto.id, cantidad })),
      pago,
    });
  }

  suscribir(mascotaId: number, entrega: Entrega, pago: PagoTarjeta): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, { tipo: 'suscripcion', mascotaId, entrega, pago });
  }
}
