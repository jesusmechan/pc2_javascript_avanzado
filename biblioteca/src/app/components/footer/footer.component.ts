import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [DatePipe, TitleCasePipe],
  template: `
    <footer class="bg-dark text-white-50 py-3 mt-auto">
      <div class="container d-flex flex-column flex-md-row justify-content-between small">
        <span>&copy; {{ hoy | date: 'yyyy' }} BiblioUTP · JavaScript Avanzado</span>
        <span>{{ hoy | date: 'fullDate' | titlecase }}</span>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  hoy = new Date();
}
