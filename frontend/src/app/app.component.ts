import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-navbar />
      <main class="flex-grow-1 py-4">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent {}
