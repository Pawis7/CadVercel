import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[class.reveal-init]': 'true',
  },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private fallbackTimer?: ReturnType<typeof setTimeout>;

  @Input('appReveal') direction: RevealDirection = 'up';
  @Input() revealDelay = 0;
  @Input() revealDuration = 700;
  @Input() revealThreshold = 0.05;
  @Input() revealOnce = true;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = this.el.nativeElement;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    element.dataset['revealDirection'] = this.direction;
    element.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);
    element.style.setProperty('--reveal-duration', `${this.revealDuration}ms`);

    if (reduceMotion || !('IntersectionObserver' in window)) {
      element.classList.add('reveal-in');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('reveal-in');
            if (this.revealOnce) this.observer?.unobserve(entry.target);
          } else if (!this.revealOnce) {
            (entry.target as HTMLElement).classList.remove('reveal-in');
          }
        }
      },
      { threshold: this.revealThreshold, rootMargin: '0px 0px 25% 0px' },
    );

    this.observer.observe(element);

    // Fallback: si pasados 1.6s no se ha activado (caso fullpage screenshot,
    // contenedor con overflow extraño, etc.), forzamos el estado visible.
    this.fallbackTimer = setTimeout(() => {
      if (!element.classList.contains('reveal-in')) {
        element.classList.add('reveal-in');
        this.observer?.unobserve(element);
      }
    }, 1600 + this.revealDelay);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
  }
}
