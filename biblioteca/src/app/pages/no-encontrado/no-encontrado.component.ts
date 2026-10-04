import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-1 fw-bold text-primary">404</h1>
      <p class="lead">La página que buscas no existe.</p>
      <a routerLink="/" class="btn btn-primary"><i class="bi bi-house-door me-1"></i>Ir al inicio</a>
    </div>
  `,
})
export class NoEncontradoComponent {}
