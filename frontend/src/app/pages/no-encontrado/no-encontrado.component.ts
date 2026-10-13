import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <div class="container py-5">
      <div class="card empty-state aparecer mx-auto" style="max-width: 560px">
        <div class="font-display display-1 fw-bold text-primary mb-2">404</div>
        <h1 class="section-title mb-2">Página no encontrada</h1>
        <p class="mb-4">Parece que este libro no está en nuestros estantes.</p>
        <div><a routerLink="/" class="btn btn-primary"><i class="bi bi-house-door"></i>Ir al inicio</a></div>
      </div>
    </div>
  `,
})
export class NoEncontradoComponent {}
