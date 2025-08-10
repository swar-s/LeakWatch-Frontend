import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading = false;

  debugClick() {
    console.log('Create new account link clicked');
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;
    const { identifier, password } = this.loginForm.value;
  this.http.post<any>(`${API_BASE_URL}/api/auth/login`, {
      email: identifier,
      password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        // Try to decode name from JWT, fallback to res.name if available
        let name = null;
        try {
          const payload = JSON.parse(atob(res.token.split('.')[1]));
          name = payload?.name;
        } catch {}
        if (!name && res.name) {
          name = res.name;
        }
        if (name) {
          localStorage.setItem('name', name);
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Login failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
