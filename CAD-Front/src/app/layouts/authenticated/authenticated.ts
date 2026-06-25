import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './authenticated.html',
})
export class AuthenticatedLayout implements OnInit {
  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;
  readonly todayYear = new Date().getFullYear();

  readonly isDarkMode = signal<boolean>(false);
  readonly isProfileOpen = signal<boolean>(false);
  readonly isNavbarHidden = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Hide navbar on scroll down past header height (64px)
    if (scrollTop > this.lastScrollTop && scrollTop > 64) {
      this.isNavbarHidden.set(true);
      this.closeProfileDropdown();
      this.closeMobileMenu();
    } else {
      // Show navbar on scroll up
      this.isNavbarHidden.set(false);
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    const nextDarkState = !this.isDarkMode();
    const doc = document as any;
    
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        this.applyTheme(nextDarkState);
      });
    } else {
      this.applyTheme(nextDarkState);
    }
  }

  private applyTheme(dark: boolean): void {
    this.isDarkMode.set(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleProfileDropdown(): void {
    this.isProfileOpen.update(val => !val);
  }

  closeProfileDropdown(): void {
    this.isProfileOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
