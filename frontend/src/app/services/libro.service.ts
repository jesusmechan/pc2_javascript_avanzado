import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria, Libro } from '../models/libro';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/libros`;

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.url);
  }

  obtener(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.url}/${id}`);
  }

  crear(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.url, libro);
  }

  actualizar(id: number, libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.url}/${id}`, libro);
  }

  actualizarStock(id: number, stock: number): Observable<Libro> {
    return this.http.patch<Libro>(`${this.url}/${id}`, { stock });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  categorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${environment.apiUrl}/categorias`);
  }
}
