import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoStockDirective } from '../../directives/estado-stock.directive';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { Libro } from '../../models/libro';
import { TruncarPipe } from '../../pipes/truncar.pipe';
import { usarPortadaPorDefecto } from '../../utils/portada';

@Component({
  selector: 'app-libro-card',
  imports: [RouterLink, CurrencyPipe, TitleCasePipe, TruncarPipe, ResaltarDirective, EstadoStockDirective],
  templateUrl: './libro-card.component.html',
  host: { class: 'd-block h-100' },
})
export class LibroCardComponent {
  @Input({ required: true }) libro!: Libro;
  @Output() eliminar = new EventEmitter<Libro>();

  portadaCargada = false;
  usarPortadaPorDefecto = usarPortadaPorDefecto;
}
