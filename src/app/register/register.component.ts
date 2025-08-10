import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.error = null;
    const { name, email, password } = this.registerForm.value;
  this.http.post<any>(`${API_BASE_URL}/api/auth/register`, {
      name,
      email,
      password
    }).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Registration failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
