import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncar' })
export class TruncarPipe implements PipeTransform {
  transform(valor: string | null | undefined, limite = 80, sufijo = '...'): string {
    if (!valor) return '';
    return valor.length > limite ? valor.substring(0, limite).trimEnd() + sufijo : valor;
  }
}
