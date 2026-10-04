import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgFor, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  enlaces = [
    { ruta: '/', texto: 'Inicio', icono: 'bi-house-door', exacto: true },
    { ruta: '/libros', texto: 'Catálogo', icono: 'bi-book', exacto: true },
    { ruta: '/libros/nuevo', texto: 'Nuevo libro', icono: 'bi-plus-circle', exacto: true },
    { ruta: '/prestamos', texto: 'Préstamos', icono: 'bi-journal-arrow-up', exacto: true },
  ];
}
