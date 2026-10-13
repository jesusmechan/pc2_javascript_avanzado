import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'diasRestantes' })
export class DiasRestantesPipe implements PipeTransform {
  transform(fecha: string): string {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(fecha + 'T00:00:00');
    const dias = Math.round((limite.getTime() - hoy.getTime()) / 86_400_000);

    if (dias > 1) return `Faltan ${dias} días`;
    if (dias === 1) return 'Vence mañana';
    if (dias === 0) return 'Vence hoy';
    return `Vencido hace ${Math.abs(dias)} día${dias === -1 ? '' : 's'}`;
  }
}
