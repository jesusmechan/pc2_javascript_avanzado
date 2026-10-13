import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[appEstadoStock]' })
export class EstadoStockDirective {
  @Input({ required: true, alias: 'appEstadoStock' }) stock = 0;

  @HostBinding('class') get clases(): string {
    if (this.stock === 0) return 'chip chip-dot chip-danger';
    if (this.stock <= 2) return 'chip chip-dot chip-warning';
    return 'chip chip-dot chip-success';
  }

  @HostBinding('title') get titulo(): string {
    return this.stock === 0 ? 'Sin ejemplares disponibles' : `${this.stock} ejemplar(es) disponible(s)`;
  }
}
