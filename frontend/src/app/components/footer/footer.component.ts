import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [DatePipe, RouterLink],
  template: `
    <footer class="app-footer py-4 mt-5">
      <div class="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 small">
        <div class="d-flex align-items-center gap-3">
          <a class="brand" routerLink="/">
            <span class="brand-logo"><i class="bi bi-book-half"></i></span>
            <span>Biblio<span class="brand-accent">UTP</span></span>
          </a>
          <span class="d-none d-md-inline">&copy; {{ hoy | date: 'yyyy' }} · JavaScript Avanzado</span>
        </div>
        <span><i class="bi bi-calendar3 me-2"></i><span class="d-inline-block first-upper">{{ hoy | date: 'fullDate' }}</span></span>
      </div>
    </footer>
  `,
  styles: `.first-upper::first-letter { text-transform: uppercase; }`,
})
export class FooterComponent {
  hoy = new Date();
}
