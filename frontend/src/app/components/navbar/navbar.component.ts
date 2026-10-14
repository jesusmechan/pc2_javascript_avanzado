import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

// Las secciones de la página de inicio solo se marcan activas si coincide el fragmento (#categorias).
const SECCION: IsActiveMatchOptions = { paths: 'exact', fragment: 'exact', queryParams: 'ignored', matrixParams: 'ignored' };
const PAGINA: IsActiveMatchOptions = { paths: 'subset', fragment: 'ignored', queryParams: 'ignored', matrixParams: 'ignored' };

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  auth = inject(AuthService);
  carrito = inject(CarritoService);

  enlaces: { ruta: string; fragmento?: string; texto: string; activo: IsActiveMatchOptions }[] = [
    { ruta: '/', fragmento: 'inicio', texto: 'Inicio', activo: SECCION },
    { ruta: '/productos', texto: 'Productos', activo: PAGINA },
    { ruta: '/', fragmento: 'categorias', texto: 'Categorías', activo: SECCION },
    { ruta: '/', fragmento: 'nosotros', texto: 'Nosotros', activo: SECCION },
  ];

  menuAbierto = signal(false);
  conScroll = signal(false);
  badgeAnimado = signal(false);

  constructor() {
    // Anima el contador cada vez que cambia la cantidad de productos en el carrito.
    let primeraVez = true;
    effect(() => {
      this.carrito.cantidadTotal();
      if (primeraVez) {
        primeraVez = false;
        return;
      }
      this.badgeAnimado.set(true);
      setTimeout(() => this.badgeAnimado.set(false), 400);
    });
  }

  @HostListener('window:scroll')
  alHacerScroll(): void {
    this.conScroll.set(window.scrollY > 20);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
