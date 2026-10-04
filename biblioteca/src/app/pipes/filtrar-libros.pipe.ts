import { Pipe, PipeTransform } from '@angular/core';
import { Libro } from '../models/libro';

@Pipe({ name: 'filtrarLibros' })
export class FiltrarLibrosPipe implements PipeTransform {
  transform(libros: Libro[], texto: string, categoria: string): Libro[] {
    const busqueda = texto.trim().toLowerCase();
    return libros.filter(
      (l) =>
        (!categoria || l.categoria === categoria) &&
        (!busqueda ||
          l.titulo.toLowerCase().includes(busqueda) ||
          l.autor.toLowerCase().includes(busqueda))
    );
  }
}
