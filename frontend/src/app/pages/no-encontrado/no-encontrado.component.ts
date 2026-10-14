import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <section class="page">
      <div class="container checkout-empty">
        <span class="cart-empty-icon">🐾</span>
        <h2>404 · Página no encontrada</h2>
        <p>Parece que esta página salió a pasear y no volvió.</p>
        <a routerLink="/" class="btn btn--primary">Ir al inicio</a>
      </div>
    </section>
  `,
})
export class NoEncontradoComponent {}
