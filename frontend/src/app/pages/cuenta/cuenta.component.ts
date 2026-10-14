import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Pedido } from '../../models/pedido';
import { SolesPipe } from '../../pipes/soles.pipe';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { ToastService } from '../../services/toast.service';
import { mensajeDeError } from '../../utils/api-error';

type Vista = 'login' | 'registro';

@Component({
  selector: 'app-cuenta',
  imports: [NgIf, NgFor, DatePipe, FormsModule, RouterLink, SolesPipe],
  templateUrl: './cuenta.component.html',
})
export class CuentaComponent {
  /** Query param `?volver=/ruta`: a dónde ir después de iniciar sesión (lo agrega el guard). */
  @Input() volver?: string;

  auth = inject(AuthService);
  private pedidoService = inject(PedidoService);
  private toast = inject(ToastService);
  private router = inject(Router);

  vista: Vista = 'login';
  enviando = false;
  error = '';
  verPassword = false;

  login = { email: '', password: '', recordar: true };
  registro = { nombre: '', email: '', password: '', confirmar: '', terminos: false };

  pedidos: Pedido[] = [];
  cargandoPedidos = false;

  constructor() {
    // Carga el historial cada vez que hay una sesión activa (al entrar o justo después de iniciarla).
    effect(() => {
      if (this.auth.autenticado()) this.cargarPedidos();
    });
  }

  get inicial(): string {
    return this.auth.usuario()?.nombre.charAt(0).toUpperCase() ?? '';
  }

  cambiarVista(vista: Vista): void {
    this.vista = vista;
    this.error = '';
  }

  iniciarSesion(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.enviar(this.auth.login(this.login.email.trim(), this.login.password, this.login.recordar), form);
  }

  registrar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.registro.password !== this.registro.confirmar) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    const { nombre, email, password } = this.registro;
    this.enviar(this.auth.registrar({ nombre: nombre.trim(), email: email.trim(), password }), form);
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.pedidos = [];
    this.toast.mostrar('Sesión cerrada');
  }

  descripcion(pedido: Pedido): string {
    if (pedido.tipo === 'suscripcion') return `Suscripción mensual de ${pedido.mascotaNombre}`;
    const unidades = pedido.items?.reduce((acum, item) => acum + item.cantidad, 0) ?? 0;
    return `${unidades} producto(s)`;
  }

  private enviar(peticion: ReturnType<AuthService['login']>, form: NgForm): void {
    this.enviando = true;
    this.error = '';
    peticion.subscribe({
      next: ({ usuario }) => {
        this.enviando = false;
        form.resetForm();
        this.toast.mostrar(`¡Bienvenido, ${usuario.nombre.split(' ')[0]}!`);
        // Solo rutas internas, para no redirigir a sitios externos.
        if (this.volver?.startsWith('/') && !this.volver.startsWith('//')) this.router.navigateByUrl(this.volver);
      },
      error: (err) => {
        this.enviando = false;
        this.error = mensajeDeError(err);
      },
    });
  }

  private cargarPedidos(): void {
    this.cargandoPedidos = true;
    this.pedidoService.listar().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargandoPedidos = false;
      },
      error: () => (this.cargandoPedidos = false),
    });
  }
}
