import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breach-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breach-summary.component.html',
  styleUrls: ['./breach-summary.component.css']
})
export class BreachSummaryComponent implements OnInit {
  @Input() summary: any;
  sortedBreaches: any[][] = [];

  ngOnInit() {
    // If summary is not provided as input, try to get it from navigation state
    if (!this.summary && typeof window !== 'undefined' && window.history && window.history.state && window.history.state.summary) {
      this.summary = window.history.state.summary;
    }
    if (this.summary && this.summary.breaches) {
      // Sort by criticality: Critical > Moderate > Low
      const critOrder = { 'Critical': 0, 'Moderate': 1, 'Low': 2 };
      const sorted = [...this.summary.breaches].sort((a: any, b: any) => {
        return (critOrder[a.criticality as keyof typeof critOrder] ?? 3) - (critOrder[b.criticality as keyof typeof critOrder] ?? 3);
      });
      // Group into 2x2 grid (array of arrays, 2 per row)
      this.sortedBreaches = [];
      for (let i = 0; i < sorted.length; i += 2) {
        this.sortedBreaches.push(sorted.slice(i, i + 2));
      }
    }
  }
}
