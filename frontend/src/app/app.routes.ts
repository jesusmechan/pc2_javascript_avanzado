import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MascotasComponent } from './pages/mascotas/mascotas.component';
import { NoEncontradoComponent } from './pages/no-encontrado/no-encontrado.component';
import { PagoComponent } from './pages/pago/pago.component';
import { ProductoDetalleComponent } from './pages/producto-detalle/producto-detalle.component';
import { ProductosComponent } from './pages/productos/productos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent, title: 'DancyPet — Tu tienda de mascotas' },
  { path: 'productos', component: ProductosComponent, title: 'Productos | DancyPet' },
  { path: 'productos/:id', component: ProductoDetalleComponent, title: 'Producto | DancyPet' },
  { path: 'pago', component: PagoComponent, title: 'Pago | DancyPet' },
  { path: 'cuenta', component: CuentaComponent, title: 'Mi cuenta | DancyPet' },
  { path: 'cuenta/mascotas', component: MascotasComponent, canActivate: [authGuard], title: 'Mis mascotas | DancyPet' },
  { path: '**', component: NoEncontradoComponent, title: '404 | DancyPet' },
];
