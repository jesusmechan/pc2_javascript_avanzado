import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoStockDirective } from '../../directives/estado-stock.directive';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { Libro } from '../../models/libro';
import { TruncarPipe } from '../../pipes/truncar.pipe';

@Component({
  selector: 'app-libro-card',
  imports: [RouterLink, CurrencyPipe, TitleCasePipe, TruncarPipe, ResaltarDirective, EstadoStockDirective],
  templateUrl: './libro-card.component.html',
  styles: `
    .portada { height: 260px; object-fit: cover; background: #e9ecef; }
  `,
})
export class LibroCardComponent {
  @Input({ required: true }) libro!: Libro;
  @Output() eliminar = new EventEmitter<Libro>();

  imagenPorDefecto(evento: Event) {
    (evento.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=Sin+portada';
  }
}
