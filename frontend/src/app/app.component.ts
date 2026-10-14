import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarritoPanelComponent } from './components/carrito-panel/carrito-panel.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CarritoPanelComponent, ToastComponent],
  template: `
    <app-navbar />
    <main class="app-main">
      <router-outlet />
    </main>
    <app-footer />
    <app-carrito-panel />
    <app-toast />
  `,
})
export class AppComponent {}
