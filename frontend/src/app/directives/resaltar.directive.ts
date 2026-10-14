import { Directive, ElementRef, HostListener, inject, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[appResaltar]' })
export class ResaltarDirective {
  /** Sombra al pasar el mouse; si el atributo se usa sin valor, se aplica la sombra del tema. */
  @Input('appResaltar') sombra = '';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform .3s, box-shadow .3s, border-color .3s');
  }

  @HostListener('mouseenter') alEntrar() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-6px)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', this.sombra || 'var(--shadow-md)');
  }

  @HostListener('mouseleave') alSalir() {
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }
}
