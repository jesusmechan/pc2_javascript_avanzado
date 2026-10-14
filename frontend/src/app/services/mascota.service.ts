import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DatosMascota, Entrega, Mascota } from '../models/mascota';

export interface SuscripcionPendiente {
  mascota: Mascota;
  entrega: Entrega;
}

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/mascotas`;

  /** Suscripción elegida en "Mis mascotas" que espera el pago en la pantalla de checkout. */
  readonly pendiente = signal<SuscripcionPendiente | null>(null);

  listar(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.url);
  }

  crear(mascota: DatosMascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.url, mascota);
  }

  actualizar(id: number, mascota: DatosMascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.url}/${id}`, mascota);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
