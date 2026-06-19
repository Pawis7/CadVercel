import { ChangeDetectionStrategy, Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AUDIENCE_PAGES } from '../core/data/page-content';
import { ContentService } from '../core/services/content.service';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { AudIllustrationComponent } from '../shared/aud-illustration/aud-illustration';
import { SecondaryFraudSimulatorComponent } from '../shared/secondary-fraud-simulator/secondary-fraud-simulator';
import { AudienceSlug } from '../core/models/content.models';
import { FeatureCardComponent } from '../shared/feature-card/feature-card';
import { SectionFeaturedSelectorComponent } from '../shared/section-featured-selector/section-featured-selector';

const SLUG_TO_AUDIENCE: Record<string, AudienceSlug> = {
  'ninas-y-ninos': 'kids',
  'adolescentes':  'teens',
  'familias':      'families',
  'docentes':      'teachers',
};

interface LevelResource {
  id: string;
  title: string;
  description: string;
  type: 'game' | 'video' | 'guide';
  typeLabel: string;
  icon: string;
  badge: string;
  duration: string;
  colorClass: string;
  actionLabel: string;
  link: string;
  level: string; // e.g. 'secundaria', 'preparatoria', 'primaria-baja', etc.
}

const LEVEL_RESOURCES: LevelResource[] = [
  // Secundaria resources (Teens 12-14)
  {
    id: 'simulador-fraudes',
    title: 'Simulador de Fraudes por Chat',
    description: 'Enfréntate a chats sospechosos simulados en un entorno virtual realista. Aprende a detectar enlaces trampa, cobros falsos y extorsiones de forma segura.',
    type: 'game',
    typeLabel: 'Minijuego',
    icon: 'sports_esports',
    badge: 'Simulación Móvil',
    duration: '5 min',
    colorClass: 'from-violet-600 to-indigo-700',
    actionLabel: 'Iniciar Simulación',
    link: '#simulador-fraudes-anchor',
    level: 'secundaria'
  },
  {
    id: 'detective-fraudes',
    title: 'Detective de Fraudes Digitales',
    description: 'Examina capturas de pantalla de correos, analiza enlaces dudosos y sube de nivel desenmascarando estafadores en la red.',
    type: 'game',
    typeLabel: 'Quiz Interactivo',
    icon: 'psychology',
    badge: 'Popular',
    duration: '8 min',
    colorClass: 'from-fuchsia-500 to-pink-500',
    actionLabel: 'Jugar Ahora',
    link: 'https://example.com/games/detective',
    level: 'secundaria'
  },
  {
    id: 'video-huella',
    title: 'Cápsula: La huella digital de Sofía',
    description: 'Video animado que muestra de manera divertida y reflexiva cómo tus publicaciones actuales definen tu reputación digital del mañana.',
    type: 'video',
    typeLabel: 'Video Animado',
    icon: 'play_circle',
    badge: 'Multimedia',
    duration: '3 min',
    colorClass: 'from-sky-400 to-blue-600',
    actionLabel: 'Ver Video',
    link: '#',
    level: 'secundaria'
  },
  {
    id: 'guia-seguridad',
    title: 'Guía: Checklist de Privacidad en Redes',
    description: 'Pasos rápidos en formato interactivo para configurar TikTok, Instagram y WhatsApp con máxima privacidad y seguridad.',
    type: 'guide',
    typeLabel: 'Guía PDF',
    icon: 'description',
    badge: 'Descargable',
    duration: '4 páginas',
    colorClass: 'from-rose-400 to-rose-600',
    actionLabel: 'Descargar PDF',
    link: '#',
    level: 'secundaria'
  },
  
  // Preparatoria resources (Teens 15-17)
  {
    id: 'simulador-huella-3d',
    title: 'Simulador 3D: Huella Digital Permanente',
    description: 'Toma decisiones cruciales a lo largo de una semana de vida digital y visualiza quién y cómo rastrea tu actividad en internet.',
    type: 'game',
    typeLabel: 'Simulador 3D',
    icon: '3d_rotation',
    badge: 'Avanzado',
    duration: '12 min',
    colorClass: 'from-purple-600 to-pink-600',
    actionLabel: 'Explorar Simulador',
    link: '#',
    level: 'preparatoria'
  },
  {
    id: 'fake-news-academy',
    title: 'Academia de Desinformación',
    description: 'Juego interactivo para aprender a detectar fake news, imágenes generadas por IA y deepfakes en redes sociales.',
    type: 'game',
    typeLabel: 'Minijuego',
    icon: 'fact_check',
    badge: 'Nuevo',
    duration: '10 min',
    colorClass: 'from-amber-500 to-orange-600',
    actionLabel: 'Comenzar Reto',
    link: '#',
    level: 'preparatoria'
  },
  {
    id: 'video-algoritmo',
    title: 'Cápsula: La burbuja del filtro y los algoritmos',
    description: 'Descubre cómo las redes sociales seleccionan el contenido que ves y aprende hacks sencillos para salir de su bucle infinito.',
    type: 'video',
    typeLabel: 'Video Animado',
    icon: 'smart_screen',
    badge: 'Recomendado',
    duration: '5 min',
    colorClass: 'from-cyan-400 to-blue-500',
    actionLabel: 'Ver Video',
    link: '#',
    level: 'preparatoria'
  },
  {
    id: 'guia-bienestar',
    title: 'Guía: Hacks de Desintoxicación Digital',
    description: 'Estrategias y trucos validados por expertos para reducir el uso excesivo de pantallas y mejorar tu sueño sin desconectarte de tus amigos.',
    type: 'guide',
    typeLabel: 'Guía PDF',
    icon: 'spa',
    badge: 'Descargable',
    duration: '6 páginas',
    colorClass: 'from-rose-400 to-rose-500',
    actionLabel: 'Descargar Guía',
    link: '#',
    level: 'preparatoria'
  }
];

@Component({
  selector: 'app-audiencia',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, AudIllustrationComponent, SecondaryFraudSimulatorComponent, FeatureCardComponent, SectionFeaturedSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audiencia.html',
})
export class AudienciaComponent {
  private route   = inject(ActivatedRoute);
  private content = inject(ContentService);

  slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  page          = computed(() => AUDIENCE_PAGES.find((a) => a.slug === this.slug()));
  audienceTheme = computed<AudienceSlug>(() => SLUG_TO_AUDIENCE[this.slug()] ?? 'cdj');

  /** Tarjetas destacadas seleccionadas por el administrador desde base de datos */
  recommendedCards = computed(() => {
    const aud = this.audienceTheme();
    if (aud === 'kids') return this.content.kidsFeatureCards();
    if (aud === 'teens') return this.content.teensFeatureCards();
    if (aud === 'families') return this.content.familiesFeatureCards();
    if (aud === 'teachers') return this.content.teachersFeatureCards();
    return [];
  });

  isTeenAudience = computed(() => this.slug() === 'adolescentes');

  // Interactive Level selection inside page
  selectedLevel = signal<string>('secundaria');
  searchQuery = signal<string>('');
  activeFilter = signal<'todos' | 'game' | 'video' | 'guide'>('todos');

  // React to slug changes to reset selections
  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug === 'ninas-y-ninos') {
        this.selectedLevel.set('primaria-baja');
      } else if (currentSlug === 'adolescentes') {
        this.selectedLevel.set('secundaria');
      } else if (currentSlug === 'familias') {
        this.selectedLevel.set('fam-6-11');
      } else if (currentSlug === 'docentes') {
        this.selectedLevel.set('doc-pb');
      }
      this.searchQuery.set('');
      this.activeFilter.set('todos');
    }, { allowSignalWrites: true });
  }

  getActiveLevelName = computed(() => {
    const p = this.page();
    if (!p) return '';
    const current = p.subLevels.find((sub) => sub.id === this.selectedLevel());
    return current ? current.title : '';
  });

  filteredResources = computed(() => {
    const lvl = this.selectedLevel();
    const query = this.searchQuery().trim().toLowerCase();
    const cat = this.activeFilter();

    // In a production system, these might come from a backend content database
    // For our simulation, we return these curated high-fidelity items
    return LEVEL_RESOURCES.filter((r) => {
      if (r.level !== lvl) return false;
      if (cat !== 'todos' && r.type !== cat) return false;
      if (query) {
        return (
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  });

  updateSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  scrollToAnchor(anchorId: string): void {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

