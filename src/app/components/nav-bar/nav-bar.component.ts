import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Clears token
    this.router.navigate(['/login']); // Redirect to login page
  }

  isLoginPage(): boolean {
    return this.router.url === '/login'; // Hide logout button on login page
  }
}
