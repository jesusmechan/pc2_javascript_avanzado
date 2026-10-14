import { Injectable, signal } from '@angular/core';

const DURACION_MS = 2800;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly mensaje = signal('');
  readonly visible = signal(false);
  private temporizador?: ReturnType<typeof setTimeout>;

  mostrar(mensaje: string): void {
    clearTimeout(this.temporizador);
    this.mensaje.set(mensaje);
    this.visible.set(true);
    this.temporizador = setTimeout(() => this.visible.set(false), DURACION_MS);
  }
}
