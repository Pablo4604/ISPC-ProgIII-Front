import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { ForgotPassword } from './forgot-password/forgot-password';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPassword },
  { path: '**', redirectTo: '' }
];
