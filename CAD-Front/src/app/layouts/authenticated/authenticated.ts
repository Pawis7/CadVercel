import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './authenticated.html',
})
export class AuthenticatedLayout {
  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;
  readonly todayYear = new Date().getFullYear();

  logout(): void {
    this.authService.logout();
  }
}
