import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductoCardComponent } from '../../components/producto-card/producto-card.component';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { Categoria, Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { ToastService } from '../../services/toast.service';
import { usarImagenRespaldo } from '../../utils/imagen';

@Component({
  selector: 'app-inicio',
  imports: [NgFor, NgIf, FormsModule, RouterLink, ProductoCardComponent, ResaltarDirective],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private productoService = inject(ProductoService);
  private toast = inject(ToastService);
  usarImagenRespaldo = usarImagenRespaldo;

  categorias: Categoria[] = [];
  destacados: Producto[] = [];
  error = false;
  correoNewsletter = '';

  beneficios = [
    { icono: '🚚', titulo: 'Envío rápido', texto: 'Entrega en 24-48 horas en Lima Metropolitana' },
    { icono: '🔒', titulo: 'Pago seguro', texto: 'Transacciones protegidas con encriptación SSL' },
    { icono: '↩️', titulo: 'Devoluciones', texto: '30 días para devolver si no estás satisfecho' },
    { icono: '💬', titulo: 'Soporte 24/7', texto: 'Asesoría veterinaria y atención al cliente' },
  ];

  ngOnInit(): void {
    forkJoin([this.productoService.categorias(), this.productoService.listar()]).subscribe({
      next: ([categorias, productos]) => {
        this.categorias = categorias;
        this.destacados = productos.filter((p) => p.badge && p.disponible).slice(0, 4);
      },
      error: () => (this.error = true),
    });
  }

  nombreCategoria(clave: string): string {
    return this.categorias.find((c) => c.clave === clave)?.nombre ?? clave;
  }

  suscribirNewsletter(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.toast.mostrar('🎉 ¡Gracias por suscribirte! Revisa tu correo.');
    form.resetForm();
  }
}
