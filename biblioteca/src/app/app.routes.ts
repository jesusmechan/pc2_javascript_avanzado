import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LibroDetalleComponent } from './pages/libro-detalle/libro-detalle.component';
import { LibroFormComponent } from './pages/libro-form/libro-form.component';
import { LibrosComponent } from './pages/libros/libros.component';
import { NoEncontradoComponent } from './pages/no-encontrado/no-encontrado.component';
import { PrestamosComponent } from './pages/prestamos/prestamos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent, title: 'Inicio | BiblioUTP' },
  { path: 'libros', component: LibrosComponent, title: 'Catálogo | BiblioUTP' },
  { path: 'libros/nuevo', component: LibroFormComponent, title: 'Nuevo libro | BiblioUTP' },
  { path: 'libros/:id', component: LibroDetalleComponent, title: 'Detalle | BiblioUTP' },
  { path: 'libros/:id/editar', component: LibroFormComponent, title: 'Editar libro | BiblioUTP' },
  { path: 'prestamos', component: PrestamosComponent, title: 'Préstamos | BiblioUTP' },
  { path: '**', component: NoEncontradoComponent, title: '404 | BiblioUTP' },
];
