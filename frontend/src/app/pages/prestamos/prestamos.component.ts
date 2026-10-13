import { DatePipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';
import { Libro } from '../../models/libro';
import { Prestamo } from '../../models/prestamo';
import { DiasRestantesPipe } from '../../pipes/dias-restantes.pipe';
import { LibroService } from '../../services/libro.service';
import { PrestamoService } from '../../services/prestamo.service';

type Filtro = 'todos' | 'activos' | 'vencidos' | 'devueltos';

@Component({
  selector: 'app-prestamos',
  imports: [
    NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault,
    FormsModule, DatePipe, TitleCasePipe, DiasRestantesPipe,
  ],
  templateUrl: './prestamos.component.html',
})
export class PrestamosComponent implements OnInit {
  /** Query param `?libro=ID` para preseleccionar un libro desde la vista de detalle. */
  @Input() libro?: string;

  private libroService = inject(LibroService);
  private prestamoService = inject(PrestamoService);

  libros: Libro[] = [];
  prestamos: Prestamo[] = [];
  filtro: Filtro = 'todos';
  filtros: Filtro[] = ['todos', 'activos', 'vencidos', 'devueltos'];
  resumen: { titulo: string; filtro: Filtro; icono: string; color: string }[] = [
    { titulo: 'Total', filtro: 'todos', icono: 'bi-journals', color: 'primary' },
    { titulo: 'Activos', filtro: 'activos', icono: 'bi-hourglass-split', color: 'success' },
    { titulo: 'Vencidos', filtro: 'vencidos', icono: 'bi-exclamation-octagon', color: 'danger' },
    { titulo: 'Devueltos', filtro: 'devueltos', icono: 'bi-check2-all', color: 'info' },
  ];
  mensaje = '';
  hoy = this.formatoISO(new Date());

  nuevo = this.prestamoVacio();

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    forkJoin([this.libroService.listar(), this.prestamoService.listar()]).subscribe(([libros, prestamos]) => {
      this.libros = libros;
      this.prestamos = prestamos.sort((a, b) => b.fechaPrestamo.localeCompare(a.fechaPrestamo));
      if (this.libro && libros.some((l) => l.id === +this.libro! && l.stock > 0)) {
        this.nuevo.libroId = +this.libro;
      }
    });
  }

  get librosDisponibles(): Libro[] {
    return this.libros.filter((l) => l.stock > 0);
  }

  get prestamosFiltrados(): Prestamo[] {
    return this.prestamos.filter((p) => this.filtro === 'todos' || this.estado(p) === this.filtro);
  }

  estado(p: Prestamo): Exclude<Filtro, 'todos'> {
    if (p.devuelto) return 'devueltos';
    return p.fechaDevolucion < this.hoy ? 'vencidos' : 'activos';
  }

  contar(f: Filtro): number {
    return f === 'todos' ? this.prestamos.length : this.prestamos.filter((p) => this.estado(p) === f).length;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('');
  }

  registrar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    const libro = this.libros.find((l) => l.id === +this.nuevo.libroId)!;
    const prestamo: Prestamo = {
      ...this.nuevo,
      libroId: libro.id!,
      tituloLibro: libro.titulo,
      lector: this.nuevo.lector.trim().toLowerCase(),
    };

    this.prestamoService
      .crear(prestamo)
      .pipe(switchMap(() => this.libroService.actualizarStock(libro.id!, libro.stock - 1)))
      .subscribe(() => {
        this.notificar(`Préstamo de "${libro.titulo}" registrado.`);
        form.resetForm(this.prestamoVacio());
        this.nuevo = this.prestamoVacio();
        this.cargar();
      });
  }

  devolver(p: Prestamo): void {
    const libro = this.libros.find((l) => l.id === p.libroId);
    this.prestamoService
      .marcarDevuelto(p.id!)
      .pipe(switchMap(() => this.libroService.actualizarStock(p.libroId, (libro?.stock ?? 0) + 1)))
      .subscribe(() => {
        this.notificar(`"${p.tituloLibro}" fue devuelto.`);
        this.cargar();
      });
  }

  eliminar(p: Prestamo): void {
    if (!confirm('¿Eliminar este registro de préstamo?')) return;
    this.prestamoService.eliminar(p.id!).subscribe(() => {
      this.prestamos = this.prestamos.filter((x) => x.id !== p.id);
    });
  }

  private notificar(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => (this.mensaje = ''), 3000);
  }

  private prestamoVacio(): Prestamo {
    const devolucion = new Date();
    devolucion.setDate(devolucion.getDate() + 14);
    return {
      libroId: 0,
      tituloLibro: '',
      lector: '',
      email: '',
      fechaPrestamo: this.formatoISO(new Date()),
      fechaDevolucion: this.formatoISO(devolucion),
      devuelto: false,
    };
  }

  private formatoISO(fecha: Date): string {
    const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    return local.toISOString().substring(0, 10);
  }
}
