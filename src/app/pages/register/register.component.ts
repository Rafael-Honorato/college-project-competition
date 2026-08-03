import { Component, inject, NgModule, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  registerForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    collegeName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onRegister() {
    if (!this.registerForm.valid) {
      console.log('durty');

      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.log(err),
    });
  }

  errorCheck(campo: string) {
    const control = this.registerForm.get(campo);
    return !!(control?.errors && control.touched);
  }
}
