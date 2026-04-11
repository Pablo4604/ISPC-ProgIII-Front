import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Propiedad para mostrar errores en el template
  errorMessage: string = '';
  // Propiedad para mostrar "Ingresando..." mientras se procesa el login
  isLoading: boolean = false;
  // Propiedad para el checkbox "Recordarme"
  rememberMe: boolean = false;

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    // Validators.minLength(8) agrega validación de longitud mínima
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;// Mostramos cargando
      this.errorMessage = '';// Limpiamos cualquier mensaje de error previo
      const { username, password } = this.loginForm.value;
      this.http.post<any>('http://localhost:8000/api/login/', { username, password }).subscribe({
        next: (response) => {
          // Si "Recordarme" esta activado, guardamos el token en localStorage, de lo contrario en sessionStorage
          this.isLoading = false;
          if (this.rememberMe) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            sessionStorage.setItem('access_token', response.access);
            sessionStorage.setItem('refresh_token', response.refresh);
            sessionStorage.setItem('user', JSON.stringify(response.user));
          }
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          // Mostramos el error en pantalla en vez de solo en consola
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          this.cdr.detectChanges();// Forzamos la detección de cambios para actualizar el mensaje de error en el template
        }
      });
    }
  }
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
