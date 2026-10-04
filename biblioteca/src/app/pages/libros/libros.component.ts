import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LibroCardComponent } from '../../components/libro-card/libro-card.component';
import { RepetirDirective } from '../../directives/repetir.directive';
import { Categoria, Libro } from '../../models/libro';
import { FiltrarLibrosPipe } from '../../pipes/filtrar-libros.pipe';
import { LibroService } from '../../services/libro.service';

@Component({
  selector: 'app-libros',
  imports: [NgFor, NgIf, FormsModule, RouterLink, LibroCardComponent, FiltrarLibrosPipe, RepetirDirective],
  templateUrl: './libros.component.html',
})
export class LibrosComponent implements OnInit {
  private libroService = inject(LibroService);

  libros: Libro[] = [];
  categorias: Categoria[] = [];
  busqueda = '';
  categoria = '';
  cargando = true;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    this.libroService.categorias().subscribe((c) => (this.categorias = c));
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.libroService.listar().subscribe({
      next: (libros) => {
        this.libros = libros;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo conectar con la API. Ejecuta "npm run api".';
        this.cargando = false;
      },
    });
  }

  eliminar(libro: Libro): void {
    if (!confirm(`¿Eliminar "${libro.titulo}" del catálogo?`)) return;
    this.libroService.eliminar(libro.id!).subscribe(() => {
      this.libros = this.libros.filter((l) => l.id !== libro.id);
      this.mensaje = `"${libro.titulo}" fue eliminado.`;
      setTimeout(() => (this.mensaje = ''), 3000);
    });
  }

  porId(_: number, libro: Libro): number | undefined {
    return libro.id;
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoria = '';
  }
}
