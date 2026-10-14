import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, Input, untracked } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RepetirDirective } from '../../directives/repetir.directive';
import { MetodoPago, Pedido } from '../../models/pedido';
import { SolesPipe } from '../../pipes/soles.pipe';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { ToastService } from '../../services/toast.service';
import { mensajeDeError } from '../../utils/api-error';

type Vista = 'login' | 'registro';
type FiltroPedidos = 'todos' | Pedido['tipo'];

interface FuerzaPassword {
  nivel: 0 | 1 | 2 | 3;
  etiqueta: string;
}

const NOMBRES_METODO: Record<MetodoPago, string> = {
  tarjeta: 'Tarjeta',
  yape: 'Yape / Plin',
  efectivo: 'Contra entrega',
};

const ETIQUETAS_FUERZA = ['Muy corta', 'Débil', 'Aceptable', 'Segura'] as const;

const loginVacio = () => ({ email: '', password: '', recordar: true });
const registroVacio = () => ({ nombre: '', email: '', password: '', confirmar: '', terminos: false });

@Component({
  selector: 'app-cuenta',
  imports: [NgIf, NgFor, DatePipe, FormsModule, RouterLink, SolesPipe, RepetirDirective],
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
  bloqMayus = false;

  login = loginVacio();
  registro = registroVacio();

  pedidos: Pedido[] = [];
  cargandoPedidos = false;
  errorPedidos = '';
  filtro: FiltroPedidos = 'todos';
  readonly filtros: { valor: FiltroPedidos; etiqueta: string }[] = [
    { valor: 'todos', etiqueta: 'Todos' },
    { valor: 'compra', etiqueta: 'Compras' },
    { valor: 'suscripcion', etiqueta: 'Suscripciones' },
  ];

  constructor() {
    // Carga el historial cada vez que hay una sesión activa (al entrar o justo después de iniciarla).
    // `untracked` evita que el token que lee el interceptor se vuelva dependencia del efecto.
    effect(() => {
      if (this.auth.autenticado()) untracked(() => this.cargarPedidos());
    });
  }

  get inicial(): string {
    return this.auth.usuario()?.nombre.charAt(0).toUpperCase() ?? '';
  }

  get pedidosFiltrados(): Pedido[] {
    return this.filtro === 'todos' ? this.pedidos : this.pedidos.filter((p) => p.tipo === this.filtro);
  }

  get totalGastado(): number {
    return this.pedidos.reduce((acum, p) => acum + p.total, 0);
  }

  get suscripciones(): number {
    return this.pedidos.filter((p) => p.tipo === 'suscripcion').length;
  }

  get passwordsNoCoinciden(): boolean {
    return !!this.registro.confirmar && this.registro.password !== this.registro.confirmar;
  }

  /** Puntaje orientativo: largo, mezcla de letras y números, y mayúsculas o símbolos. */
  get fuerzaPassword(): FuerzaPassword {
    const valor = this.registro.password;
    if (valor.length < 6) return { nivel: 0, etiqueta: ETIQUETAS_FUERZA[0] };
    const criterios = [
      valor.length >= 10,
      /[a-z]/i.test(valor) && /\d/.test(valor),
      (/[A-Z]/.test(valor) && /[a-z]/.test(valor)) || /[^a-z\d]/i.test(valor),
    ].filter(Boolean).length;
    const nivel = Math.min(3, Math.max(1, criterios)) as FuerzaPassword['nivel'];
    return { nivel, etiqueta: ETIQUETAS_FUERZA[nivel] };
  }

  cambiarVista(vista: Vista): void {
    if (vista === this.vista) return;
    // Conserva el correo ya escrito al pasar de un formulario al otro.
    if (vista === 'registro' && !this.registro.email) this.registro.email = this.login.email;
    if (vista === 'login' && !this.login.email) this.login.email = this.registro.email;
    this.vista = vista;
    this.error = '';
    this.bloqMayus = false;
  }

  /** Navegación con flechas entre pestañas (patrón WAI-ARIA de tabs). */
  moverEntrePestanas(evento: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
    evento.preventDefault();
    const destino: Vista = evento.key === 'Home' ? 'login' : evento.key === 'End' ? 'registro' : this.vista === 'login' ? 'registro' : 'login';
    this.cambiarVista(destino);
    document.getElementById(`tab-${destino}`)?.focus();
  }

  detectarBloqMayus(evento: KeyboardEvent): void {
    this.bloqMayus = evento.getModifierState?.('CapsLock') ?? false;
  }

  iniciarSesion(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.enviar(this.auth.login(this.login.email.trim(), this.login.password, this.login.recordar), form);
  }

  registrar(form: NgForm): void {
    if (form.invalid || this.passwordsNoCoinciden) {
      form.control.markAllAsTouched();
      return;
    }
    const { nombre, email, password } = this.registro;
    this.enviar(this.auth.registrar({ nombre: nombre.trim(), email: email.trim(), password }), form);
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.pedidos = [];
    this.filtro = 'todos';
    this.vista = 'login';
    this.toast.mostrar('Sesión cerrada');
  }

  cargarPedidos(): void {
    this.cargandoPedidos = true;
    this.errorPedidos = '';
    this.pedidoService.listar().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargandoPedidos = false;
      },
      error: (err) => {
        this.cargandoPedidos = false;
        this.errorPedidos = mensajeDeError(err);
      },
    });
  }

  descripcion(pedido: Pedido): string {
    if (pedido.tipo === 'suscripcion') return `Suscripción mensual de ${pedido.mascotaNombre}`;
    const unidades = pedido.items?.reduce((acum, item) => acum + item.cantidad, 0) ?? 0;
    return `${unidades} ${unidades === 1 ? 'producto' : 'productos'}`;
  }

  metodoPago(pedido: Pedido): string {
    const nombre = NOMBRES_METODO[pedido.pago.metodo] ?? pedido.pago.metodo;
    return pedido.pago.ultimos4 ? `${nombre} •••• ${pedido.pago.ultimos4}` : nombre;
  }

  porId(_indice: number, pedido: Pedido): number {
    return pedido.id;
  }

  private enviar(peticion: ReturnType<AuthService['login']>, form: NgForm): void {
    this.enviando = true;
    this.error = '';
    peticion.subscribe({
      next: ({ usuario }) => {
        this.enviando = false;
        this.bloqMayus = false;
        // `resetForm()` dejaría los campos en null; se reinician los modelos con valores limpios.
        form.resetForm();
        this.login = loginVacio();
        this.registro = registroVacio();
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
}
