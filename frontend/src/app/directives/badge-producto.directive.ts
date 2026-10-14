import { Directive, HostBinding, Input } from '@angular/core';
import { Badge } from '../models/producto';

const ETIQUETAS: Record<Badge, string> = { sale: 'Oferta', new: 'Nuevo', popular: 'Popular' };

/** `<span [appBadgeProducto]="producto.badge">` muestra la etiqueta con el color de su tipo. */
@Directive({ selector: '[appBadgeProducto]' })
export class BadgeProductoDirective {
  @Input({ required: true, alias: 'appBadgeProducto' }) badge!: Badge;

  @HostBinding('class') get clases(): string {
    return `product-card__badge product-card__badge--${this.badge}`;
  }

  @HostBinding('textContent') get texto(): string {
    return ETIQUETAS[this.badge] ?? this.badge;
  }
}
