import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private router = inject(Router);

  // Objeto usuario recuperado del storage
  user: any = null;

  ngOnInit() {
    // Buscamos el usuario en localStorage primero (Recordarme)
    // y si no está, en sessionStorage
    const stored =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user');

    if (stored) {
      this.user = JSON.parse(stored);
    }
  }

  logout() {
    // Eliminamos el token y los datos del usuario del storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');

    // Redirigimos al login
    this.router.navigate(['/']);
  }
}