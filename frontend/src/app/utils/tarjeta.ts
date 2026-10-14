/** Algoritmo de Luhn: detecta errores de tipeo en números de tarjeta (la API aplica la misma regla). */
export function esTarjetaValida(numero: string): boolean {
  const limpio = numero.replace(/\s/g, '');
  if (!/^\d{16}$/.test(limpio)) return false;

  let suma = 0;
  let alternar = false;
  for (let i = limpio.length - 1; i >= 0; i--) {
    let digito = Number(limpio[i]);
    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    alternar = !alternar;
  }
  return suma % 10 === 0;
}

/** "4111111111111111" → "4111 1111 1111 1111" */
export function formatearNumeroTarjeta(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 16);
  return digitos.match(/.{1,4}/g)?.join(' ') ?? '';
}

/** "1230" → "12/30" */
export function formatearVencimiento(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

export function soloDigitos(valor: string, maximo: number): string {
  return valor.replace(/\D/g, '').slice(0, maximo);
}
