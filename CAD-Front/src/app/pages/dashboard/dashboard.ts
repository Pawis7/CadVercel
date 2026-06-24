import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;
  readonly todayYear = new Date().getFullYear();

  logout(): void {
    this.authService.logout();
  }
}
