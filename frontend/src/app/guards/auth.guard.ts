import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Si no hay sesión, envía a "Mi cuenta" y recuerda a dónde quería ir el usuario. */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).autenticado()) return true;
  return inject(Router).createUrlTree(['/cuenta'], { queryParams: { volver: state.url } });
};
