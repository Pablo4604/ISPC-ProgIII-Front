import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verificamos si existe el token en localStorage o sessionStorage
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token');

  if (token) {
    // Si hay token, permite el acceso
    return true;
  }

  // Si no hay token, redirige al login
  router.navigate(['/']);
  return false;
};
