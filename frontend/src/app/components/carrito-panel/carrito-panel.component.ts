import { Component, effect, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SolesPipe } from '../../pipes/soles.pipe';
import { CarritoService } from '../../services/carrito.service';
import { ToastService } from '../../services/toast.service';
import { usarImagenRespaldo } from '../../utils/imagen';

@Component({
  selector: 'app-carrito-panel',
  imports: [SolesPipe],
  templateUrl: './carrito-panel.component.html',
})
export class CarritoPanelComponent {
  carrito = inject(CarritoService);
  private router = inject(Router);
  private toast = inject(ToastService);
  usarImagenRespaldo = usarImagenRespaldo;

  constructor() {
    // Bloquea el scroll de la página mientras el panel está abierto.
    effect(() => {
      document.body.style.overflow = this.carrito.abierto() ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  cerrar(): void {
    this.carrito.abierto.set(false);
  }

  finalizarCompra(): void {
    this.cerrar();
    this.router.navigate(['/pago']);
  }

  vaciar(): void {
    if (!confirm('¿Estás seguro de vaciar el carrito?')) return;
    this.carrito.vaciar();
    this.toast.mostrar('Carrito vaciado');
  }
}
