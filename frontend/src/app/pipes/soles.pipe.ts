import { Pipe, PipeTransform } from '@angular/core';

/** 89.9 → "S/ 89.90" */
@Pipe({ name: 'soles' })
export class SolesPipe implements PipeTransform {
  transform(monto: number | null | undefined): string {
    return `S/ ${(monto ?? 0).toFixed(2)}`;
  }
}
