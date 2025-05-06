import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { username, email, password } = this.registerForm.value;
        await this.userService.register({ username, email, password }).toPromise();
        this.router.navigate(['/login'], { state: { message: 'Registration successful! Please login.' } });
      } catch (error: any) {
        if (error.error?.error === 'Username already exists' || error.error?.error === 'Email already exists') {
          this.errorMessage = error.error.error + '. Please login instead.';
        } else {
          this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        }
        console.error('Registration error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 