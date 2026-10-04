import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { LibroService } from '../../services/libro.service';
import { PrestamoService } from '../../services/prestamo.service';

interface Indicador {
  titulo: string;
  valor: number;
  icono: string;
  color: string;
  moneda?: boolean;
}

@Component({
  selector: 'app-inicio',
  imports: [NgFor, NgIf, RouterLink, CurrencyPipe, DecimalPipe, ResaltarDirective],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private libroService = inject(LibroService);
  private prestamoService = inject(PrestamoService);

  indicadores: Indicador[] = [];
  error = false;

  ngOnInit(): void {
    forkJoin([this.libroService.listar(), this.prestamoService.listar()]).subscribe({
      next: ([libros, prestamos]) => {
        const activos = prestamos.filter((p) => !p.devuelto).length;
        this.indicadores = [
          { titulo: 'Títulos', valor: libros.length, icono: 'bi-book', color: 'primary' },
          { titulo: 'Ejemplares', valor: libros.reduce((t, l) => t + l.stock, 0), icono: 'bi-stack', color: 'success' },
          { titulo: 'Préstamos activos', valor: activos, icono: 'bi-journal-arrow-up', color: 'warning' },
          {
            titulo: 'Valor del inventario',
            valor: libros.reduce((t, l) => t + l.precio * l.stock, 0),
            icono: 'bi-cash-coin',
            color: 'info',
            moneda: true,
          },
        ];
      },
      error: () => (this.error = true),
    });
  }
}
