import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from './sidebar/sidebar';
import { ContentService } from './core/services/content.service';
import { BrandIconComponent } from './shared/brand-icon/brand-icon';
import { ImageEditService } from './core/services/image-edit.service';
import { CdjLogoComponent } from './shared/cdj-logo/cdj-logo';
import { AuthService } from './core/services/auth.service';
import { UiIconComponent } from './shared/ui-icon/ui-icon';

const ADMIN_FLAG = 'cdj_admin_v1';
const THEME_KEY  = 'cdj_theme';

type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, SidebarComponent, BrandIconComponent, CdjLogoComponent, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private imgEdit = inject(ImageEditService);

  branding = this.content.branding;
  socialLinks = this.content.socialLinks;
  footerColumns = this.content.footerColumns;
  editMode = this.imgEdit.isEditActive;   // computed: editMode && isLogged
  hasOverrides = computed(() => Object.keys(this.imgEdit.overrides()).length > 0);

  drawerOpen = signal(false);
  scrolled = signal(false);
  searchOpen = signal(false);
  searchQuery = signal('');
  private auth = inject(AuthService);
  /** true si el backend confirmó una sesión válida — fuente de verdad para botones de edición */
  isLogged = this.auth.isLogged;
  isAuthenticated = this.isLogged; // alias para el template

  /** Estado para la animación de cierre de sesión */
  loggingOut = signal(false);

  isAdmin = signal<boolean>(this.readAdminFlag());
  theme = signal<ThemeMode>(this.readTheme());
  year = new Date().getFullYear();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('inlineSearch') inlineSearch?: ElementRef<HTMLInputElement>;

  topNav: { label: string; href: string; exact: boolean }[] = [
    { label: 'Perfiles',  href: '/p/adolescentes', exact: false },
    { label: 'Cursos',    href: '/cursos',         exact: false },
    { label: 'Recursos',  href: '/recursos',       exact: false },
    { label: 'Ayuda',     href: '/ayuda',          exact: false },
  ];

  constructor() {
    this.applyTheme(this.theme());

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.closeDrawer();
        this.searchOpen.set(false);
      });

    // Verificar sesión al arrancar; después restaurar editMode si había sesión activa
    this.auth.checkSession().then(() => this.imgEdit.restoreEditMode());

    // Activar/desactivar modo admin con ?admin=1 / ?admin=0 en la URL
    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const v = params.get('admin');
      if (v === '1') this.setAdminFlag(true);
      else if (v === '0') this.setAdminFlag(false);
    });
  }

  ngAfterViewInit() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearch();
      }
    });
  }

  toggleDrawer() {
    this.drawerOpen.update((v) => !v);
    document.body.style.overflow = this.drawerOpen() ? 'hidden' : '';
  }

  closeDrawer() {
    if (!this.drawerOpen()) return;
    this.drawerOpen.set(false);
    document.body.style.overflow = '';
  }

  openSearch() {
    this.searchOpen.set(true);
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 60);
  }
  closeSearch() {
    this.searchOpen.set(false);
    this.searchQuery.set('');
  }

  signLanguage = signal(false);

  toggleSignLanguage() {
    this.signLanguage.update((v) => !v);
  }

  async onLogout() {
    this.loggingOut.set(true);
    // Pequeño delay artificial para que la animación sea perceptible y premium
    await new Promise(resolve => setTimeout(resolve, 800));
    await this.auth.logout();
    // No usamos router.navigate, usamos location.href para recargar todo el estado (placebo de limpieza)
    window.location.href = '/';
  }

  toggleEdit() { this.imgEdit.toggleEdit(); }
  resetAllImages() {
    if (confirm('¿Restablecer todas las imágenes a la versión original?')) {
      this.imgEdit.clearAll();
    }
  }

  toggleTheme() {
    const next: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  }

  private applyTheme(mode: ThemeMode) {
    if (typeof document === 'undefined') return;
    if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.searchOpen()) { this.closeSearch(); return; }
    this.closeDrawer();
  }

  private readAdminFlag(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(ADMIN_FLAG) === '1';
  }
  private setAdminFlag(on: boolean) {
    try {
      if (on) localStorage.setItem(ADMIN_FLAG, '1');
      else localStorage.removeItem(ADMIN_FLAG);
    } catch {}
    this.isAdmin.set(on);
    if (!on && this.editMode()) this.imgEdit.toggleEdit();
  }

  private readTheme(): ThemeMode {
    if (typeof localStorage === 'undefined') return 'light';
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
