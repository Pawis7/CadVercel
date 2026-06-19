import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ContentService } from '../core/services/content.service';
import { CadLogoComponent } from '../shared/cad-logo/cad-logo';
import { ImageEditService } from '../core/services/image-edit.service';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  routerLink: string[];
  audience: string;
}

const COLLAPSE_KEY = 'cad_sidebar_collapsed';

/**
 * Sidebar persistente estilo Coursera/edX — solo cursos.
 *
 * - Default: 256px expanded, items con label visible.
 * - Collapsable a 72px con toggle (estado persistido en localStorage).
 * - Una sección: Cursos (Inicio + Catálogo + accesos rápidos por nivel).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CadLogoComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() variant: 'desktop' | 'mobile' = 'desktop';
  @Output() navigate = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  private auth = inject(AuthService);
  isAuthenticated = this.auth.isLogged;

  private imgEdit = inject(ImageEditService);
  editMode = this.imgEdit.isEditActive;

  private content = inject(ContentService);
  branding = this.content.branding;

  collapsed = signal<boolean>(this.readCollapsed());

  toggleEdit() {
    this.imgEdit.toggleEdit();
  }

  constructor() {
    effect(() => {
      const isCollapsed = this.collapsed();
      if (typeof document !== 'undefined' && this.variant === 'desktop') {
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);
      }
    });
  }

  /** Sección CURSOS — navegación principal */
  learnSections: SidebarItem[] = [
    { id: 'home',    label: 'Inicio',     icon: 'home',      routerLink: ['/'],       audience: 'cdj' },
    { id: 'cursos',  label: 'Cursos',     icon: 'menu_book', routerLink: ['/cursos'], audience: 'teachers' },
  ];

  /** Accesos rápidos por nivel — todos apuntan al catálogo */
  levelLinks: SidebarItem[] = [
    { id: 'basico',      label: 'Básico',      icon: 'stars',          routerLink: ['/cursos'], audience: 'cdj' },
    { id: 'intermedio',  label: 'Intermedio',  icon: 'trending_up',    routerLink: ['/cursos'], audience: 'cdj' },
    { id: 'avanzado',    label: 'Avanzado',    icon: 'workspace_premium', routerLink: ['/cursos'], audience: 'cdj' },
  ];

  toggleCollapse() {
    this.collapsed.update((v) => !v);
    this.persistCollapsed();
  }

  onNavigate() {
    this.navigate.emit();
  }

  private readCollapsed(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  }
  private persistCollapsed() {
    try {
      if (this.collapsed()) localStorage.setItem(COLLAPSE_KEY, '1');
      else localStorage.removeItem(COLLAPSE_KEY);
    } catch {}
  }
}
