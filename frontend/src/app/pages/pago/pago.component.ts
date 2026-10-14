import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, map, Observable, timer } from 'rxjs';
import { MetodoPago, Pago, PagoEfectivo, PagoTarjeta, PagoYape, Pedido } from '../../models/pedido';
import { SolesPipe } from '../../pipes/soles.pipe';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { MascotaService, SuscripcionPendiente } from '../../services/mascota.service';
import { PedidoService } from '../../services/pedido.service';
import { mensajeDeError } from '../../utils/api-error';
import { esTarjetaValida, formatearNumeroTarjeta, formatearVencimiento, soloDigitos } from '../../utils/tarjeta';

const EMAIL = /^[\w.+-]+@[\w-]+(\.[\w-]+)*\.\w{2,}$/;
const TELEFONO = /^9\d{8}$/;
const TIEMPO_PROCESO_MS = 1200;

@Component({
  selector: 'app-pago',
  imports: [NgIf, NgFor, UpperCasePipe, FormsModule, RouterLink, SolesPipe],
  templateUrl: './pago.component.html',
})
export class PagoComponent implements OnInit {
  /** Query param `?suscripcion=ID`: paga la suscripción de una mascota en lugar del carrito. */
  @Input() suscripcion?: string;

  carrito = inject(CarritoService);
  private auth = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  pendiente: SuscripcionPendiente | null = null;
  metodo: MetodoPago = 'tarjeta';
  metodos: { valor: MetodoPago; icono: string; texto: string }[] = [
    { valor: 'tarjeta', icono: '💳', texto: 'Tarjeta' },
    { valor: 'yape', icono: '📱', texto: 'Yape / Plin' },
    { valor: 'efectivo', icono: '💵', texto: 'Contra entrega' },
  ];

  tarjeta: PagoTarjeta = { metodo: 'tarjeta', numero: '', titular: '', vencimiento: '', cvv: '', email: '' };
  yape: PagoYape = { metodo: 'yape', telefono: '', codigoOperacion: '', email: '' };
  efectivo: PagoEfectivo = { metodo: 'efectivo', nombre: '', telefono: '', direccion: '' };

  procesando = false;
  error = '';
  confirmado: Pedido | null = null;

  get esSuscripcion(): boolean {
    return this.pendiente !== null;
  }

  get total(): number {
    return this.pendiente?.mascota.suscripcion.precioMensualFinal ?? this.carrito.total();
  }

  ngOnInit(): void {
    const usuario = this.auth.usuario();
    if (usuario) {
      this.tarjeta.email = this.yape.email = usuario.email;
      this.tarjeta.titular = this.efectivo.nombre = usuario.nombre;
    }
    if (this.suscripcion) {
      const pendiente = this.mascotaService.pendiente();
      // Sin datos en memoria (ej. al recargar la página) se vuelve a elegir la mascota.
      if (!pendiente || pendiente.mascota.id !== +this.suscripcion) {
        this.router.navigate(['/cuenta/mascotas']);
        return;
      }
      this.pendiente = pendiente;
    }
  }

  alEscribirNumero(evento: Event): void {
    this.tarjeta.numero = this.reformatear(evento, formatearNumeroTarjeta);
  }

  alEscribirVencimiento(evento: Event): void {
    this.tarjeta.vencimiento = this.reformatear(evento, formatearVencimiento);
  }

  alEscribirTelefono(evento: Event, destino: PagoYape | PagoEfectivo): void {
    destino.telefono = this.reformatear(evento, (v) => soloDigitos(v, 9));
  }

  alEscribirCvv(evento: Event): void {
    this.tarjeta.cvv = this.reformatear(evento, (v) => soloDigitos(v, 4));
  }

  pagar(): void {
    const pago = this.pagoActual();
    this.error = this.validar(pago);
    if (this.error || this.procesando) return;

    this.procesando = true;
    const peticion: Observable<Pedido> = this.pendiente
      ? this.pedidoService.suscribir(this.pendiente.mascota.id, this.pendiente.entrega, this.tarjeta)
      : this.pedidoService.comprar(this.carrito.items(), pago);

    // Pausa mínima para simular la comunicación con la pasarela de pago.
    forkJoin([peticion, timer(TIEMPO_PROCESO_MS)])
      .pipe(map(([pedido]) => pedido))
      .subscribe({
        next: (pedido) => {
          this.confirmado = pedido;
          this.procesando = false;
          if (this.pendiente) this.mascotaService.pendiente.set(null);
          else this.carrito.vaciar();
        },
        error: (err) => {
          this.error = mensajeDeError(err, 'No se pudo procesar el pago.');
          this.procesando = false;
        },
      });
  }

  continuar(): void {
    this.router.navigate([this.confirmado?.tipo === 'suscripcion' ? '/cuenta/mascotas' : '/productos']);
  }

  nombreMetodo(metodo: MetodoPago): string {
    return this.metodos.find((m) => m.valor === metodo)?.texto ?? metodo;
  }

  private pagoActual(): Pago {
    if (this.esSuscripcion) return this.tarjeta;
    return { tarjeta: this.tarjeta, yape: this.yape, efectivo: this.efectivo }[this.metodo];
  }

  /** Mismas reglas que la API, para avisar antes de enviar. */
  private validar(pago: Pago): string {
    switch (pago.metodo) {
      case 'tarjeta':
        if (!esTarjetaValida(pago.numero)) return 'Número de tarjeta inválido. Verifica los 16 dígitos.';
        if (pago.titular.trim().length < 3) return 'Ingresa el nombre del titular de la tarjeta.';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(pago.vencimiento)) return 'Fecha de vencimiento inválida. Usa formato MM/AA.';
        if (!/^\d{3,4}$/.test(pago.cvv)) return 'CVV inválido. Debe tener 3 o 4 dígitos.';
        if (!EMAIL.test(pago.email.trim())) return 'Correo electrónico inválido.';
        return '';
      case 'yape':
        if (!TELEFONO.test(pago.telefono)) return 'Ingresa un número de celular válido (9 dígitos, empieza con 9).';
        if (pago.codigoOperacion.trim().length < 6) return 'Ingresa el código de operación de Yape o Plin.';
        if (!EMAIL.test(pago.email.trim())) return 'Correo electrónico inválido.';
        return '';
      case 'efectivo':
        if (pago.nombre.trim().length < 3) return 'Ingresa tu nombre completo.';
        if (!TELEFONO.test(pago.telefono)) return 'Ingresa un teléfono válido (9 dígitos, empieza con 9).';
        if (pago.direccion.trim().length < 10) return 'Ingresa una dirección de entrega válida.';
        return '';
    }
  }

  /** Aplica el formato al valor escrito y lo refleja en el input, aunque el modelo no cambie. */
  private reformatear(evento: Event, formato: (valor: string) => string): string {
    const input = evento.target as HTMLInputElement;
    input.value = formato(input.value);
    return input.value;
  }
}
