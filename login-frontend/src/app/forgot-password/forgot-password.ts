import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})

export class ForgotPassword {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Controla qué paso se muestra en pantalla (1, 2 o 3)
  currentStep: number = 1;

  // Guardamos el email para usarlo en los pasos siguientes
  emailValue: string = '';

  // Mensaje de error y éxito para mostrar en pantalla
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  // Paso 1 — formulario de email
  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // Paso 2 — formulario de código OTP
  otpForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  // Paso 3 — formulario de nueva contraseña
  passwordForm: FormGroup = this.fb.group({
    new_password: ['', [Validators.required, Validators.minLength(8)]]
  });

  // PASO 1 — solicitar OTP
  onRequestOTP() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.emailValue = this.emailForm.value.email;

      this.http.post<any>('http://localhost:8000/api/password-reset/request/', {
        email: this.emailValue
      }).subscribe({
        next: () => {
          // Si el email existe, avanzamos al paso 2
          this.isLoading = false;
          this.currentStep = 2;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.email?.[0] || 'Ocurrió un error. Intentá de nuevo.';
        }
      });
    }
  }

  // PASO 2 — verificar OTP
  onVerifyOTP() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.http.post<any>('http://localhost:8000/api/password-reset/verify/', {
        email: this.emailValue,
        code: this.otpForm.value.code
      }).subscribe({
        next: () => {
          // Si el código es válido, avanzamos al paso 3
          this.isLoading = false;
          this.currentStep = 3;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.non_field_errors?.[0] || 'Código inválido o expirado.';
        }
      });
    }
  }

  // PASO 3 — confirmar nueva contraseña
  onConfirmPassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.http.post<any>('http://localhost:8000/api/password-reset/confirm/', {
        email: this.emailValue,
        code: this.otpForm.value.code,
        new_password: this.passwordForm.value.new_password
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Contraseña actualizada. Redirigiendo al login...';
          setTimeout(() => this.router.navigate(['/']), 2500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.non_field_errors?.[0] || 'Ocurrió un error. Intentá de nuevo.';
        }
      });
    }
  }

  // Volver al login
  goToLogin() {
    this.router.navigate(['/']);
  }
}
