import { CurrencyPipe, DecimalPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { Libro } from '../../models/libro';
import { LibroService } from '../../services/libro.service';
import { PrestamoService } from '../../services/prestamo.service';
import { portadaExiste, usarPortadaPorDefecto } from '../../utils/portada';

interface Indicador {
  titulo: string;
  valor: number;
  icono: string;
  color: string;
  moneda?: boolean;
}

@Component({
  selector: 'app-inicio',
  imports: [NgFor, NgIf, RouterLink, CurrencyPipe, DecimalPipe, TitleCasePipe, ResaltarDirective],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private libroService = inject(LibroService);
  private prestamoService = inject(PrestamoService);

  indicadores: Indicador[] = [];
  portadas: Libro[] = [];
  recientes: Libro[] = [];
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
        this.cargarPortadasValidas(libros);
        this.recientes = [...libros].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 4);
      },
      error: () => (this.error = true),
    });
  }

  usarPortadaPorDefecto = usarPortadaPorDefecto;

  /** Precarga las portadas y conserva solo las que existen, para que el abanico del hero no quede con huecos. */
  private async cargarPortadasValidas(libros: Libro[]): Promise<void> {
    const resultados = await Promise.all(
      libros.filter((l) => l.portada).map((l) => portadaExiste(l.portada).then((ok) => (ok ? l : null))),
    );
    this.portadas = resultados.filter((l): l is Libro => l !== null).slice(0, 3);
  }
}
