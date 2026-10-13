import { CurrencyPipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categoria, Libro } from '../../models/libro';
import { LibroService } from '../../services/libro.service';

function anioValido(control: AbstractControl): ValidationErrors | null {
  const anio = Number(control.value);
  return anio > new Date().getFullYear() ? { anioFuturo: true } : null;
}

@Component({
  selector: 'app-libro-form',
  imports: [
    NgIf, NgFor, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault,
    ReactiveFormsModule, RouterLink, CurrencyPipe, TitleCasePipe,
  ],
  templateUrl: './libro-form.component.html',
})
export class LibroFormComponent implements OnInit {
  /** Presente solo en la ruta `libros/:id/editar`. */
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private libroService = inject(LibroService);
  private router = inject(Router);

  categorias: Categoria[] = [];
  guardando = false;
  error = '';

  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(2)]],
    autor: ['', [Validators.required, Validators.minLength(3)]],
    isbn: ['', [Validators.required, Validators.pattern(/^97[89]-\d{10}$/)]],
    categoria: ['', Validators.required],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(1450), anioValido]],
    precio: [0, [Validators.required, Validators.min(0.1)]],
    stock: [1, [Validators.required, Validators.min(0), Validators.max(100)]],
    portada: ['', Validators.pattern(/^https?:\/\/.+/)],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
  });

  get esEdicion(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.libroService.categorias().subscribe((c) => (this.categorias = c));
    if (this.esEdicion) {
      this.libroService.obtener(+this.id!).subscribe({
        next: ({ id, ...libro }) => this.form.setValue(libro),
        error: () => (this.error = 'No se encontró el libro a editar.'),
      });
    }
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo)!;
    return control.invalid && (control.dirty || control.touched);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    const libro: Libro = this.form.getRawValue();
    const peticion = this.esEdicion
      ? this.libroService.actualizar(+this.id!, libro)
      : this.libroService.crear(libro);

    peticion.subscribe({
      next: (guardado) => this.router.navigate(['/libros', guardado.id]),
      error: () => {
        this.error = 'Ocurrió un error al guardar. Verifica que la API esté activa.';
        this.guardando = false;
      },
    });
  }
}
