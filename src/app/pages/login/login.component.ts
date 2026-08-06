import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LoginUserDto } from '../../core/interfaces/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private router = inject(Router);
  readonly loggedError = signal(false);
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value as LoginUserDto;
    this.authService.login(credentials).subscribe({
      next: (user) => this.router.navigate(['/home']),
      error: (err) => {
        const apiMessage = err.error?.message || 'Credenciais inválidas';
        console.log(`Mensagem de erro: ${apiMessage}`);
        this.loggedError.set(true);
      },
    });
  }

  errorCheck(campo: string) {
    const control = this.loginForm.get(campo);
    return !!(control?.errors && control.touched);
  }
}
