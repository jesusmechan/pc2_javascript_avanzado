import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <a routerLink="/" class="logo">
            <img src="/imagenes/logo.png" alt="" class="logo__icon" />
            <span class="logo__text">Dancy<em>Pet</em></span>
          </a>
          <p>Tu tienda de confianza para el cuidado y felicidad de tus mascotas.</p>
        </div>
        <div class="footer__col">
          <h4>Tienda</h4>
          <ul>
            <li><a routerLink="/productos">Productos</a></li>
            <li><a routerLink="/" fragment="categorias">Categorías</a></li>
            <li><a routerLink="/cuenta/mascotas">Suscripción de alimento</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Ayuda</h4>
          <ul>
            <li><a routerLink="/cuenta">Mi cuenta</a></li>
            <li>Envíos en 24-48 h</li>
            <li>Devoluciones en 30 días</li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Contacto</h4>
          <ul>
            <li>📍 Av. Ayacucho Mz. 9 lote 1A, Tablada Nueva</li>
            <li>📞 +51 930 401 998</li>
            <li>✉️ hola&#64;pawville.pe</li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom container">
        <p>&copy; {{ anio }} DancyPet. Todos los derechos reservados.</p>
        <div class="footer__social">
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="TikTok">TK</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  anio = new Date().getFullYear();
}
