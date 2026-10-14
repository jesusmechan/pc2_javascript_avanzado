import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatosMascota, HORARIOS_ENTREGA, Mascota, TipoComida, TipoMascota } from '../../models/mascota';
import { SolesPipe } from '../../pipes/soles.pipe';
import { MascotaService } from '../../services/mascota.service';
import { ToastService } from '../../services/toast.service';
import { mensajeDeError } from '../../utils/api-error';

const TAMANO_MAXIMO_FOTO = 1024 * 1024;

@Component({
  selector: 'app-mascotas',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, SolesPipe],
  templateUrl: './mascotas.component.html',
})
export class MascotasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private mascotaService = inject(MascotaService);
  private toast = inject(ToastService);
  private router = inject(Router);

  mascotas: Mascota[] = [];
  cargando = true;
  error = '';

  readonly horarios = HORARIOS_ENTREGA;
  readonly iconos = ['🐶', '🐱', '🐾', '🦴'];
  readonly comidas: { valor: TipoComida; texto: string }[] = [
    { valor: 'basico', texto: 'Básica' },
    { valor: 'medio', texto: 'Media' },
    { valor: 'premium', texto: 'Premium' },
  ];

  // Formulario reactivo: las reglas replican las del esquema de la API.
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    tipo: ['perro' as TipoMascota, Validators.required],
    edad: [1, [Validators.required, Validators.min(0), Validators.max(30)]],
    peso: [5, [Validators.required, Validators.min(0.1), Validators.max(100)]],
    tipoComida: ['medio' as TipoComida, Validators.required],
    icono: ['🐶'],
    foto: [''],
  });
  editandoId: number | null = null;
  guardando = false;
  errorForm = '';

  // Datos de la suscripción (formulario basado en plantilla).
  suscripcion = { mascotaId: 0, direccion: '', horario: '' };
  errorSuscripcion = '';

  get disponiblesParaSuscribir(): Mascota[] {
    return this.mascotas.filter((m) => !m.suscripcionActiva);
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.mascotaService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
        this.cargando = false;
        if (!this.disponiblesParaSuscribir.some((m) => m.id === this.suscripcion.mascotaId)) {
          this.elegirParaSuscripcion(this.disponiblesParaSuscribir[0]?.id ?? 0);
        }
      },
      error: (err) => {
        this.error = mensajeDeError(err);
        this.cargando = false;
      },
    });
  }

  invalido(campo: keyof DatosMascota): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  nombreComida(tipo: TipoComida): string {
    return this.comidas.find((c) => c.valor === tipo)?.texto ?? tipo;
  }

  alElegirFoto(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    if (archivo.size > TAMANO_MAXIMO_FOTO) {
      this.errorForm = 'La foto debe pesar como máximo 1 MB.';
      return;
    }
    const lector = new FileReader();
    lector.onload = () => this.form.controls.foto.setValue(lector.result as string);
    lector.readAsDataURL(archivo);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    this.errorForm = '';
    const datos: DatosMascota = this.form.getRawValue();
    const peticion = this.editandoId
      ? this.mascotaService.actualizar(this.editandoId, datos)
      : this.mascotaService.crear(datos);

    peticion.subscribe({
      next: (mascota) => {
        this.toast.mostrar(this.editandoId ? `${mascota.nombre} fue actualizado` : `¡${mascota.nombre} fue registrado!`);
        this.cancelarEdicion();
        this.guardando = false;
        this.cargar();
      },
      error: (err) => {
        this.errorForm = mensajeDeError(err);
        this.guardando = false;
      },
    });
  }

  editar(mascota: Mascota): void {
    this.editandoId = mascota.id;
    const { nombre, tipo, edad, peso, tipoComida, icono, foto } = mascota;
    this.form.setValue({ nombre, tipo, edad, peso, tipoComida, icono, foto });
    document.getElementById('formMascota')?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.errorForm = '';
    this.form.reset();
  }

  eliminar(mascota: Mascota): void {
    if (!confirm(`¿Eliminar a ${mascota.nombre}?`)) return;
    this.mascotaService.eliminar(mascota.id).subscribe({
      next: () => {
        this.toast.mostrar(`${mascota.nombre} fue eliminado`);
        this.cargar();
      },
      error: (err) => alert(mensajeDeError(err, 'No se pudo eliminar la mascota.')),
    });
  }

  /** Precarga la dirección y el horario si la mascota ya tuvo una entrega registrada. */
  elegirParaSuscripcion(id: number): void {
    const mascota = this.mascotas.find((m) => m.id === +id);
    this.suscripcion = {
      mascotaId: mascota?.id ?? 0,
      direccion: mascota?.entrega?.direccion ?? '',
      horario: mascota?.entrega?.horario ?? '',
    };
  }

  iniciarSuscripcion(): void {
    const mascota = this.mascotas.find((m) => m.id === +this.suscripcion.mascotaId);
    const direccion = this.suscripcion.direccion.trim();
    if (!mascota) {
      this.errorSuscripcion = 'Registra una mascota primero.';
      return;
    }
    if (direccion.length < 10 || !this.suscripcion.horario) {
      this.errorSuscripcion = 'Completa la dirección (mínimo 10 caracteres) y el rango de horario.';
      return;
    }
    this.errorSuscripcion = '';
    this.mascotaService.pendiente.set({ mascota, entrega: { direccion, horario: this.suscripcion.horario } });
    this.router.navigate(['/pago'], { queryParams: { suscripcion: mascota.id } });
  }
}
