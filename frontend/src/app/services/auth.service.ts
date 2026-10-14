import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { DatosRegistro, Sesion, Usuario } from '../models/usuario';

const SESION_KEY = 'dancypet-session';

/**
 * Maneja la sesión del usuario. Con "Recordarme" el token se guarda en localStorage;
 * sin esa opción va a sessionStorage y se pierde al cerrar el navegador.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/auth`;
  private readonly sesion = signal<Sesion | null>(this.cargar());

  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly autenticado = computed(() => this.sesion() !== null);
  readonly primerNombre = computed(() => this.usuario()?.nombre.split(' ')[0] ?? '');

  get token(): string | null {
    return this.sesion()?.token ?? null;
  }

  login(email: string, password: string, recordar: boolean): Observable<Sesion> {
    return this.http
      .post<Sesion>(`${this.url}/login`, { email, password })
      .pipe(tap((sesion) => this.guardar(sesion, recordar)));
  }

  registrar(datos: DatosRegistro): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.url}/registro`, datos).pipe(tap((sesion) => this.guardar(sesion, true)));
  }

  perfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/perfil`);
  }

  cerrarSesion(): void {
    localStorage.removeItem(SESION_KEY);
    sessionStorage.removeItem(SESION_KEY);
    this.sesion.set(null);
  }

  private guardar(sesion: Sesion, recordar: boolean): void {
    this.cerrarSesion();
    (recordar ? localStorage : sessionStorage).setItem(SESION_KEY, JSON.stringify(sesion));
    this.sesion.set(sesion);
  }

  private cargar(): Sesion | null {
    try {
      const guardada = localStorage.getItem(SESION_KEY) ?? sessionStorage.getItem(SESION_KEY);
      const sesion = guardada ? (JSON.parse(guardada) as Sesion) : null;
      return sesion?.token && sesion.usuario ? sesion : null;
    } catch {
      return null;
    }
  }
}
