import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error) => {
      // Solo interceptamos errores 401 (token expirado)
      // y evitamos interceptar el propio endpoint de refresh
      if (error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !req.url.includes('token/refresh')) {

        // Buscamos el refresh token en el storage
        const refreshToken =
          localStorage.getItem('refresh_token') ||
          sessionStorage.getItem('refresh_token');

        if (refreshToken) {
          // Pedimos un nuevo access token al backend
          return http.post<any>('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken
          }).pipe(
            switchMap((response) => {
              // Guardamos el nuevo access token en el mismo storage
              if (localStorage.getItem('refresh_token')) {
                localStorage.setItem('access_token', response.access);
              } else {
                sessionStorage.setItem('access_token', response.access);
              }

              // Reintentamos la request original con el nuevo token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.access}`
                }
              });
              return next(newReq);
            }),
            catchError(() => {
              // Si el refresh también falla, limpiamos el storage
              // y redirigimos al login
              localStorage.clear();
              sessionStorage.clear();
              router.navigate(['/']);
              return throwError(() => error);
            })
          );
        }

        // Si no hay refresh token, redirigimos al login
        localStorage.clear();
        sessionStorage.clear();
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};
