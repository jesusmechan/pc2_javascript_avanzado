import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeProductoDirective } from '../../directives/badge-producto.directive';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { Producto } from '../../models/producto';
import { SolesPipe } from '../../pipes/soles.pipe';
import { TruncarPipe } from '../../pipes/truncar.pipe';
import { CarritoService } from '../../services/carrito.service';
import { ToastService } from '../../services/toast.service';
import { usarImagenRespaldo } from '../../utils/imagen';

@Component({
  selector: 'app-producto-card',
  imports: [RouterLink, SolesPipe, TruncarPipe, BadgeProductoDirective, ResaltarDirective],
  templateUrl: './producto-card.component.html',
  host: { style: 'display: block; height: 100%' },
})
export class ProductoCardComponent {
  @Input({ required: true }) producto!: Producto;
  /** Nombre visible de la categoría; si no se envía se muestra la clave. */
  @Input() categoria = '';

  private carrito = inject(CarritoService);
  private toast = inject(ToastService);
  usarImagenRespaldo = usarImagenRespaldo;

  agregar(): void {
    this.carrito.agregar(this.producto);
    this.toast.mostrar(`✓ ${this.producto.nombre} agregado al carrito`);
  }
}
