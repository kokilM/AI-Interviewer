import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { username, password } = this.loginForm.value;
        const response = await this.userService.login(username, password).toPromise();
        
        localStorage.setItem('user', JSON.stringify(response));
        
        this.router.navigate(['/options']);
      } catch (error: any) {
        this.errorMessage = error.error?.error || 'Login failed. Please try again.';
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
} 