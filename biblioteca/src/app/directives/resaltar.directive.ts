import { Directive, ElementRef, HostListener, inject, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[appResaltar]' })
export class ResaltarDirective {
  @Input('appResaltar') sombra = '0 .5rem 1.5rem rgba(13, 110, 253, .35)';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform .2s, box-shadow .2s');
  }

  @HostListener('mouseenter') alEntrar() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-6px)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', this.sombra);
  }

  @HostListener('mouseleave') alSalir() {
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }
}
