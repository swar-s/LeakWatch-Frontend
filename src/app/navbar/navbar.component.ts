import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  userName: string | null = null;
  dropdownOpen = false;

  constructor(private router: Router) {
    this.setUserFromToken();
    // Update userName on every navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setUserFromToken();
      }
    });
    // Listen for storage changes (multi-tab)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => this.setUserFromToken());
    }
  }


  setUserFromToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      let name = null;
      if (token) {
        const payload = parseJwt(token);
        name = payload?.name;
      }
      if (!name) {
        name = localStorage.getItem('name');
      }
      this.userName = name || null;
    } else {
      this.userName = null;
    }
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
    }
    this.userName = null;
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
