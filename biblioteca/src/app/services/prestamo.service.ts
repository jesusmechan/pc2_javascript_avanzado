import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prestamo } from '../models/prestamo';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/prestamos`;

  listar(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.url);
  }

  crear(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.url, prestamo);
  }

  marcarDevuelto(id: number): Observable<Prestamo> {
    return this.http.patch<Prestamo>(`${this.url}/${id}`, { devuelto: true });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
