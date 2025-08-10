

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent {
  scanForm: FormGroup;
  loading = false;
  error: string | null = null;
  result: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.scanForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.scanForm.invalid) {
      this.scanForm.markAllAsTouched();
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    this.loading = true;
    this.error = null;
    this.result = null;
    const { email } = this.scanForm.value;
  this.http.post<any>(`${API_BASE_URL}/api/scan/`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (scanRes) => {
        this.loading = false;
        this.result = scanRes;
        // Navigate to breach-summary with summary in state
        this.router.navigate(['/breach-summary'], { state: { summary: scanRes.genai_summary } });
      },
      error: (err) => {
        this.error = err.error?.error || 'Scan failed';
        this.loading = false;
      }
    });
  }
}
