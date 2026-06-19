import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ContentService } from '../core/services/content.service';
import { CdjLogoComponent } from '../shared/cdj-logo/cdj-logo';
import { ImageEditService } from '../core/services/image-edit.service';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  routerLink: string[];
  audience: string;
  subItems?: { label: string; href: string }[];
}

const COLLAPSE_KEY = 'cdj_sidebar_collapsed';

/**
 * Sidebar persistente estilo Coursera/edX.
 *
 * - Default: 256px expanded, items con label visible.
 * - Collapsable a 72px con toggle (estado persistido en localStorage).
 * - Tres secciones: Aprender, Audiencias (con sub-niveles expandibles), Ayuda.
 * - Mobile: drawer 100%.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CdjLogoComponent],
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
  editMode = this.imgEdit.isEditActive;   // ← siempre auth-gated

  private content = inject(ContentService);
  branding = this.content.branding;

  collapsed = signal<boolean>(this.readCollapsed());
  openedAudience = signal<string | null>(null);

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

  /** Sección APRENDER — los espacios de contenido educativo */
  learnSections: SidebarItem[] = [
    { id: 'home',      label: 'Inicio',         icon: 'home',             routerLink: ['/'],            audience: 'cdj' },
    { id: 'cursos',    label: 'Cursos',         icon: 'menu_book',        routerLink: ['/cursos'],      audience: 'teachers' },
    { id: 'recursos',  label: 'Recursos',       icon: 'auto_stories',     routerLink: ['/recursos'],    audience: 'cdj' },
    { id: 'series',    label: 'Series',         icon: 'movie',            routerLink: ['/series'],      audience: 'casi' },
  ];

  /** Sección AUDIENCIAS — perfiles con sub-niveles */
  audiences: SidebarItem[] = [
    {
      id: 'kids',  label: 'Niñas y niños',  icon: 'child_care',
      routerLink: ['/p', 'ninas-y-ninos'], audience: 'kids',
      subItems: [
        { label: 'Preescolar',     href: '/p/ninas-y-ninos#preescolar' },
        { label: 'Primaria baja',  href: '/p/ninas-y-ninos#primaria-baja' },
        { label: 'Primaria alta',  href: '/p/ninas-y-ninos#primaria-alta' },
      ],
    },
    {
      id: 'teens', label: 'Adolescentes', icon: 'forum',
      routerLink: ['/p', 'adolescentes'], audience: 'teens',
      subItems: [
        { label: 'Secundaria',  href: '/p/adolescentes#secundaria' },
        { label: 'Preparatoria', href: '/p/adolescentes#preparatoria' },
      ],
    },
    {
      id: 'families', label: 'Familias', icon: 'family_restroom',
      routerLink: ['/p', 'familias'], audience: 'families',
      subItems: [
        { label: '0–5 años',   href: '/p/familias#fam-0-5' },
        { label: '6–11 años',  href: '/p/familias#fam-6-11' },
        { label: '12–14 años', href: '/p/familias#fam-12-14' },
        { label: '15–22 años', href: '/p/familias#fam-15-22' },
      ],
    },
    {
      id: 'teachers', label: 'Docentes', icon: 'school',
      routerLink: ['/p', 'docentes'], audience: 'teachers',
      subItems: [
        { label: 'Preescolar',    href: '/p/docentes#doc-pre' },
        { label: 'Primaria baja', href: '/p/docentes#doc-pb' },
        { label: 'Primaria alta', href: '/p/docentes#doc-pa' },
        { label: 'Secundaria',    href: '/p/docentes#doc-sec' },
        { label: 'Preparatoria',  href: '/p/docentes#doc-prep' },
      ],
    },
  ];

  /** Sección AYUDA Y COMUNIDAD */
  helpSections: SidebarItem[] = [
    { id: 'ayuda',   label: 'Ayuda Digital',  icon: 'shield',  routerLink: ['/ayuda'],         audience: 'help' },
    { id: 'juegos',  label: 'Juegos',         icon: 'sports_esports',   routerLink: ['/juegos'],      audience: 'families' },
    { id: 'notebooks', label: 'Notebooks IA', icon: 'auto_awesome',     routerLink: ['/notebooks-ia'], audience: 'teens' },
    { id: 'quienes', label: 'Quiénes somos',  icon: 'groups',  routerLink: ['/quienes-somos'], audience: 'cdj' },
  ];

  toggleCollapse() {
    this.collapsed.update((v) => !v);
    this.persistCollapsed();
    if (this.collapsed()) this.openedAudience.set(null);
  }

  toggleAudience(id: string, ev: Event) {
    // ev.preventDefault(); // Permitimos la navegación si es un enlace, el toggle es secundario
    ev.stopPropagation();
    this.openedAudience.update((curr) => (curr === id ? null : id));
  }

  onNavigate() {
    this.openedAudience.set(null);
    this.navigate.emit();
  }

  onSubitemClick() {
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
