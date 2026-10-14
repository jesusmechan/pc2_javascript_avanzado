import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BadgeProductoDirective } from '../../directives/badge-producto.directive';
import { Producto } from '../../models/producto';
import { SolesPipe } from '../../pipes/soles.pipe';
import { CarritoService, MAX_CANTIDAD } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { ToastService } from '../../services/toast.service';
import { mensajeDeError } from '../../utils/api-error';
import { usarImagenRespaldo } from '../../utils/imagen';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, TitleCasePipe, SolesPipe, BadgeProductoDirective],
  templateUrl: './producto-detalle.component.html',
})
export class ProductoDetalleComponent implements OnInit {
  @Input({ required: true }) id!: string;

  private productoService = inject(ProductoService);
  private carrito = inject(CarritoService);
  private toast = inject(ToastService);
  private router = inject(Router);
  usarImagenRespaldo = usarImagenRespaldo;

  producto?: Producto;
  categoria = '';
  cantidad = 1;
  error = '';
  readonly maximo = MAX_CANTIDAD;

  ngOnInit(): void {
    forkJoin([this.productoService.obtener(+this.id), this.productoService.categorias()]).subscribe({
      next: ([producto, categorias]) => {
        this.producto = producto;
        this.categoria = categorias.find((c) => c.clave === producto.categoria)?.nombre ?? producto.categoria;
      },
      error: (err) => (this.error = mensajeDeError(err, 'No se encontró el producto.')),
    });
  }

  get ahorro(): number {
    const p = this.producto;
    return p?.precioAnterior ? p.precioAnterior - p.precio : 0;
  }

  cambiarCantidad(delta: number): void {
    this.cantidad = Math.min(Math.max(this.cantidad + delta, 1), this.maximo);
  }

  agregar(): void {
    if (!this.producto) return;
    this.carrito.agregar(this.producto, this.cantidad);
    this.toast.mostrar(`✓ ${this.cantidad} × ${this.producto.nombre} agregado al carrito`);
  }

  comprarAhora(): void {
    this.agregar();
    this.router.navigate(['/pago']);
  }
}
