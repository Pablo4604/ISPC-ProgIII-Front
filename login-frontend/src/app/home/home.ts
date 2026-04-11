import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  // Objeto usuario recuperado del storage
  user: any = null;

  ngOnInit() {
    // Obtenemos el token del storage
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');

    if (token) {
      // Construimos el header Authorization con el token JWT
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Consumimos el endpoint de perfil con el token
      this.http.get<any>('http://localhost:8000/api/profile/', { headers })
        .subscribe({
          next: (response) => {
            this.user = response;
            this.cdr.detectChanges();
          },
          error: () => {
            // Si el token expiró o es inválido, redirigimos al login
            this.logout();
          }
        });
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    // Eliminamos el token y los datos del usuario del storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');

    // Redirigimos al login
    this.router.navigate(['/']);
  }
}