import { Component, inject } from '@angular/core';
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

  // Propiedad para mostrar errores en el template
  errorMessage: string = '';
  // Propiedad para el checkbox "Recordarme"
  rememberMe: boolean = false;

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    // Validators.minLength(8) agrega validación de longitud mínima
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.http.post<any>('http://localhost:8000/api/login/', { username, password }).subscribe({
        next: (response) => {
          // Si "Recordarme" esta activado, guardamos el token en localStorage, de lo contrario en sessionStorage
          if (this.rememberMe) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            sessionStorage.setItem('access_token', response.access);
            sessionStorage.setItem('user', JSON.stringify(response.user));
          }
          this.router.navigate(['/home']);
        },
        error: (error) => {
          // Mostramos el error en pantalla en vez de solo en consola
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        }
      });
    }
  }
}
