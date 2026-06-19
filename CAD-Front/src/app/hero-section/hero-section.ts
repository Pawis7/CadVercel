import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Slide {
  id: string;
  badge: string;
  badgeIcon: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  audience: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  @Input() embedded = false;

  slides: Slide[] = [
    {
      id: 'el-dia-que-casi',
      badge: 'Serie animada',
      badgeIcon: 'animation',
      title: 'El día que… ¡Casi!',
      description:
        'Historias cortas donde los personajes evitan riesgos digitales tomando buenas decisiones a tiempo.',
      image: '/Portadas/EDQCasi_Portada.png',
      ctaLabel: 'Ver capítulos',
      ctaHref: '/series',
      audience: 'casi',
    },
    {
      id: 'edutips',
      badge: 'Biblioteca',
      badgeIcon: 'play_circle',
      title: 'Edutips',
      description:
        'Microvideos para aprender a moverte en internet con seguridad, criterio y respeto.',
      image: '/Portadas/Edutips_Portada.png',
      ctaLabel: 'Ver biblioteca',
      ctaHref: '/edutips',
      audience: 'edutips',
    },
    {
      id: 'ayuda-digital',
      badge: 'Orientación',
      badgeIcon: 'support_agent',
      title: 'Ayuda Digital',
      description:
        'Si recibiste un fraude, acoso o algo no está bien, no estás solo: aquí encuentras a quién acudir.',
      image: '/Portadas/AyudaDigital_Portada.png',
      ctaLabel: 'Pedir ayuda',
      ctaHref: '/ayuda',
      audience: 'help',
    },
  ];

  currentIndex = signal(0);
  isPaused = signal(false);
  progressKey = signal(0);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly AUTOPLAY_MS = 6000;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slides.length);
    this.progressKey.update((k) => k + 1);
  }

  prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.slides.length) % this.slides.length);
    this.progressKey.update((k) => k + 1);
  }

  goTo(i: number): void {
    this.currentIndex.set(i);
    this.progressKey.update((k) => k + 1);
  }

  onMouseEnter(): void {
    this.isPaused.set(true);
  }

  onMouseLeave(): void {
    this.isPaused.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.intervalId = setInterval(() => {
      if (!this.isPaused()) this.next();
    }, this.AUTOPLAY_MS);
  }

  private stopAutoplay(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
