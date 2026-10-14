import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, timer } from 'rxjs';
import { ProductoCardComponent } from '../../components/producto-card/producto-card.component';
import { RepetirDirective } from '../../directives/repetir.directive';
import { Categoria, Orden, Producto } from '../../models/producto';
import { FiltrarProductosPipe } from '../../pipes/filtrar-productos.pipe';
import { ProductoService } from '../../services/producto.service';
import { mensajeDeError } from '../../utils/api-error';

@Component({
  selector: 'app-productos',
  imports: [NgFor, NgIf, FormsModule, RouterLink, ProductoCardComponent, FiltrarProductosPipe, RepetirDirective],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  /** Query param `?categoria=perros`; así el filtro se puede compartir o guardar como enlace. */
  @Input() set categoria(valor: string | undefined) {
    this.categoriaActiva = valor || 'todos';
  }

  private productoService = inject(ProductoService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaActiva = 'todos';
  busqueda = '';
  orden: Orden = 'default';
  cargando = true;
  error = '';

  ordenes: { valor: Orden; texto: string }[] = [
    { valor: 'default', texto: 'Ordenar por' },
    { valor: 'price-asc', texto: 'Precio: menor a mayor' },
    { valor: 'price-desc', texto: 'Precio: mayor a menor' },
    { valor: 'name-asc', texto: 'Nombre: A-Z' },
  ];

  ngOnInit(): void {
    // Tiempo mínimo de esqueleto para evitar un parpadeo cuando la API responde al instante.
    forkJoin([this.productoService.listar(), this.productoService.categorias(), timer(500)]).subscribe({
      next: ([productos, categorias]) => {
        this.productos = productos;
        this.categorias = categorias;
        this.cargando = false;
      },
      error: (err) => {
        this.error = mensajeDeError(err);
        this.cargando = false;
      },
    });
  }

  nombreCategoria(clave: string): string {
    return this.categorias.find((c) => c.clave === clave)?.nombre ?? clave;
  }

  porId(_: number, producto: Producto): number {
    return producto.id;
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.orden = 'default';
  }
}
