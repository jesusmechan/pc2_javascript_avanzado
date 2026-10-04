import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/** Directiva estructural: `*appRepetir="5; let i = index"` renderiza la plantilla N veces. */
@Directive({ selector: '[appRepetir]' })
export class RepetirDirective {
  private plantilla = inject<TemplateRef<{ $implicit: number; index: number }>>(TemplateRef);
  private contenedor = inject(ViewContainerRef);

  @Input() set appRepetir(veces: number) {
    this.contenedor.clear();
    for (let i = 0; i < veces; i++) {
      this.contenedor.createEmbeddedView(this.plantilla, { $implicit: i, index: i });
    }
  }
}
