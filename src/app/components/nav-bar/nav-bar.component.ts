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
  username: string | null = '';

  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.username = user ? user.username : null;
    });
  }

  setUsername() {
    this.authService.user$.subscribe((user) => {
      this.username = user ? user.username : null;
    });
    this.ngOnInit();
  }

  logout() {
    this.authService.logout(); // Clears token
    this.username = null;
    this.router.navigate(['/login']);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login'; // Hide logout button on login page
  }
}
