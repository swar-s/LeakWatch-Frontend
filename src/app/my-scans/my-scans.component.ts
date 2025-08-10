import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DatePipe, NgIf, NgFor, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-scans',
  templateUrl: './my-scans.component.html',
  styleUrls: ['./my-scans.component.css'],
  standalone: true,
  imports: [DatePipe, NgIf, NgFor, HttpClientModule, CommonModule]
})
export class MyScansComponent implements OnInit {
  scans: any[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  this.http.get<any>(`${API_BASE_URL}/api/scan/history`, { headers, responseType: 'json' }).subscribe({
      next: (res) => {
        this.scans = res && res.scans ? res.scans : [];
        this.loading = false;
      },
      error: (err) => {
        const backendMsg = err.error?.error || '';
        if (
          backendMsg.toLowerCase().includes('token') ||
          backendMsg.toLowerCase().includes('auth') ||
          err.status === 401
        ) {
          this.error = 'Please log in to view your scans.';
        } else {
          this.error = backendMsg || 'Failed to load scans';
        }
        this.loading = false;
      }
    });
  }

  openScan(scan: any) {
    this.router.navigate(['/my-scans', scan._id]);
  }
}
