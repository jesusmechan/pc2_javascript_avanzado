import { CurrencyPipe, NgIf, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EstadoStockDirective } from '../../directives/estado-stock.directive';
import { Libro } from '../../models/libro';
import { LibroService } from '../../services/libro.service';

@Component({
  selector: 'app-libro-detalle',
  imports: [NgIf, RouterLink, CurrencyPipe, TitleCasePipe, UpperCasePipe, EstadoStockDirective],
  templateUrl: './libro-detalle.component.html',
})
export class LibroDetalleComponent implements OnInit {
  /** Parámetro de ruta `:id` recibido gracias a withComponentInputBinding(). */
  @Input() id!: string;

  private libroService = inject(LibroService);
  private router = inject(Router);

  libro?: Libro;
  noEncontrado = false;

  ngOnInit(): void {
    this.libroService.obtener(+this.id).subscribe({
      next: (libro) => (this.libro = libro),
      error: () => (this.noEncontrado = true),
    });
  }

  eliminar(): void {
    if (!this.libro || !confirm(`¿Eliminar "${this.libro.titulo}"?`)) return;
    this.libroService.eliminar(this.libro.id!).subscribe(() => this.router.navigate(['/libros']));
  }
}
