import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DatePipe, JsonPipe, NgIf, isPlatformBrowser } from '@angular/common';
import { BreachSummaryComponent } from '../breach-summary/breach-summary.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';

@Component({
  selector: 'app-scan-detail',
  templateUrl: './scan-detail.component.html',
  styleUrls: ['./scan-detail.component.css'],
  standalone: true,
  imports: [DatePipe, JsonPipe, NgIf, BreachSummaryComponent]
})
export class ScanDetailComponent implements OnInit {
  scan: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const scanId = this.route.snapshot.paramMap.get('id');
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  this.http.get<any>(`${API_BASE_URL}/api/scan/${scanId}`, { headers, responseType: 'json' }).subscribe({
      next: (res) => {
        this.scan = res.scan;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load scan';
        this.loading = false;
      }
    });
  }
}
