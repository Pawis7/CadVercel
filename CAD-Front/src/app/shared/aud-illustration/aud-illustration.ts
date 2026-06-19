import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Ilustraciones SVG inline temáticas por audiencia.
 *
 * Estilo: formas geométricas suaves, sin caras detalladas (evita uncanny valley
 * cuando hablamos de niños y adolescentes). Paleta cálida derivada del scope
 * de audiencia activo (--aud, --aud-soft, --aud-tint, --aud-cream).
 *
 * Sirven como:
 *  - Fondo decorativo rico en heroes
 *  - Placeholder cuando una imagen real falla
 *  - Cover de cards mientras no hay foto cargada
 *
 * Cada escena es composable: capas de fondo + dispositivo + figura humana
 * estilizada + accesorios temáticos (estrellas, hojas, escudo, libro, etc.)
 */
export type AudTheme = 'kids' | 'teens' | 'families' | 'teachers' | 'help' | 'edutips' | 'casi' | 'cdj';
export type AudScene = 'hero' | 'study' | 'play' | 'connect' | 'shield' | 'spark' | 'compass';

@Component({
  selector: 'app-aud-illustration',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="'aud-illustration relative h-full w-full overflow-hidden ' + (audClass())"
      [attr.role]="alt() ? 'img' : 'presentation'"
      [attr.aria-label]="alt() || null">
      <svg
        [attr.viewBox]="viewBox()"
        preserveAspectRatio="xMidYMid slice"
        class="absolute inset-0 h-full w-full"
        aria-hidden="true">
        <defs>
          <linearGradient id="bg-{{uid}}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   [attr.stop-color]="'var(--aud-cream)'" />
            <stop offset="100%" [attr.stop-color]="'var(--aud-tint)'" />
          </linearGradient>
          <linearGradient id="figure-{{uid}}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   [attr.stop-color]="'var(--aud)'" stop-opacity="0.95" />
            <stop offset="100%" [attr.stop-color]="'var(--aud-soft)'" stop-opacity="0.95" />
          </linearGradient>
          <radialGradient id="halo-{{uid}}" cx="50%" cy="40%" r="60%">
            <stop offset="0%"   [attr.stop-color]="'var(--aud-soft)'" stop-opacity="0.45" />
            <stop offset="100%" [attr.stop-color]="'var(--aud)'" stop-opacity="0" />
          </radialGradient>
          <pattern id="dots-{{uid}}" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" [attr.fill]="'var(--aud)'" fill-opacity="0.18" />
          </pattern>
        </defs>

        <!-- Fondo gradient -->
        <rect width="100%" height="100%" [attr.fill]="'url(#bg-' + uid + ')'" />

        <!-- Halo decorativo -->
        <circle cx="78%" cy="22%" r="180" [attr.fill]="'url(#halo-' + uid + ')'" />

        <!-- Patrón de puntos sutil esquina -->
        <rect x="0" y="60%" width="40%" height="40%" [attr.fill]="'url(#dots-' + uid + ')'" />

        <!-- Forma orgánica de fondo -->
        <path
          d="M -50,300 C 100,260 220,360 380,320 C 540,280 640,360 800,300 L 800,500 L -50,500 Z"
          [attr.fill]="'var(--aud-tint)'"
          fill-opacity="0.6" />

        <!-- Escena por tipo -->
        <ng-container [ngSwitch]="scene()">
          <ng-container *ngSwitchCase="'study'">
            <!-- Escritorio + laptop + figura -->
            <ellipse cx="400" cy="430" rx="260" ry="14" [attr.fill]="'var(--aud)'" fill-opacity="0.16" />
            <rect x="270" y="320" width="260" height="14" rx="4" [attr.fill]="'var(--aud)'" fill-opacity="0.85" />
            <rect x="290" y="200" width="220" height="120" rx="14" [attr.fill]="'#ffffff'" stroke-width="6" [attr.stroke]="'var(--aud)'" />
            <rect x="304" y="214" width="192" height="92" rx="6" [attr.fill]="'var(--aud-cream)'" />
            <circle cx="400" cy="260" r="22" [attr.fill]="'var(--aud-soft)'" />
            <rect x="372" y="288" width="56" height="6" rx="3" [attr.fill]="'var(--aud)'" />
            <rect x="345" y="300" width="110" height="4" rx="2" [attr.fill]="'var(--aud-soft)'" />

            <!-- Figura humana stylized (silhouette) -->
            <circle cx="180" cy="240" r="38" [attr.fill]="'url(#figure-' + uid + ')'" />
            <path d="M 130,420 C 130,330 230,330 230,420 Z" [attr.fill]="'url(#figure-' + uid + ')'" />
            <circle cx="172" cy="232" r="3" fill="#fff" />
            <circle cx="188" cy="232" r="3" fill="#fff" />
            <path d="M 170,250 Q 180,256 190,250" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" />
          </ng-container>

          <ng-container *ngSwitchCase="'play'">
            <!-- Estrellas, sparkles, juguete -->
            <circle cx="180" cy="200" r="60" [attr.fill]="'var(--aud-soft)'" fill-opacity="0.9" />
            <circle cx="180" cy="200" r="32" fill="#fff" />
            <circle cx="172" cy="195" r="4" [attr.fill]="'var(--aud)'" />
            <circle cx="188" cy="195" r="4" [attr.fill]="'var(--aud)'" />
            <path d="M 168,210 Q 180,222 192,210" [attr.stroke]="'var(--aud)'" stroke-width="3" fill="none" stroke-linecap="round" />

            <path d="M 540,160 l 18,40 44,4 -34,28 12,42 -40,-22 -40,22 12,-42 -34,-28 44,-4 z"
                  [attr.fill]="'var(--aud-soft)'" />
            <circle cx="640" cy="280" r="22" [attr.fill]="'var(--aud)'" />
            <circle cx="120" cy="380" r="14" [attr.fill]="'var(--aud-soft)'" />
            <path d="M 380,360 q 30,-50 60,0 q -30,50 -60,0 z" [attr.fill]="'var(--aud-tint)'" stroke-width="3" [attr.stroke]="'var(--aud)'" />
          </ng-container>

          <ng-container *ngSwitchCase="'connect'">
            <!-- Tres figuras conectadas, mensaje -->
            <line x1="220" y1="280" x2="420" y2="220" [attr.stroke]="'var(--aud)'" stroke-width="3" stroke-dasharray="6 6" />
            <line x1="420" y1="220" x2="600" y2="290" [attr.stroke]="'var(--aud)'" stroke-width="3" stroke-dasharray="6 6" />
            <circle cx="220" cy="280" r="34" [attr.fill]="'url(#figure-' + uid + ')'" />
            <circle cx="420" cy="200" r="40" [attr.fill]="'url(#figure-' + uid + ')'" />
            <circle cx="600" cy="290" r="34" [attr.fill]="'url(#figure-' + uid + ')'" />
            <rect x="180" y="320" width="80" height="100" rx="40" [attr.fill]="'url(#figure-' + uid + ')'" />
            <rect x="376" y="248" width="88" height="120" rx="44" [attr.fill]="'url(#figure-' + uid + ')'" />
            <rect x="560" y="330" width="80" height="100" rx="40" [attr.fill]="'url(#figure-' + uid + ')'" />
            <!-- Mensajes burbuja -->
            <rect x="320" y="100" width="160" height="48" rx="24" fill="#fff" stroke-width="3" [attr.stroke]="'var(--aud)'" />
            <circle cx="360" cy="124" r="4" [attr.fill]="'var(--aud)'" />
            <circle cx="380" cy="124" r="4" [attr.fill]="'var(--aud)'" />
            <circle cx="400" cy="124" r="4" [attr.fill]="'var(--aud)'" />
          </ng-container>

          <ng-container *ngSwitchCase="'shield'">
            <!-- Escudo + candado -->
            <path d="M 400,140 L 540,180 L 540,320 Q 540,400 400,440 Q 260,400 260,320 L 260,180 Z"
                  [attr.fill]="'url(#figure-' + uid + ')'" />
            <path d="M 400,170 L 510,200 L 510,310 Q 510,378 400,408 Q 290,378 290,310 L 290,200 Z"
                  fill="#fff" fill-opacity="0.18" />
            <rect x="370" y="270" width="60" height="56" rx="6" fill="#fff" />
            <path d="M 380,270 v -16 a 20,20 0 0 1 40,0 v 16" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" />
            <circle cx="400" cy="296" r="6" [attr.fill]="'var(--aud)'" />
          </ng-container>

          <ng-container *ngSwitchCase="'spark'">
            <!-- TV / video / spark -->
            <rect x="220" y="160" width="360" height="220" rx="22" [attr.fill]="'var(--aud)'" />
            <rect x="240" y="180" width="320" height="180" rx="14" [attr.fill]="'var(--aud-cream)'" />
            <polygon points="380,220 380,320 470,270" fill="#fff" />
            <rect x="350" y="396" width="100" height="12" rx="6" [attr.fill]="'var(--aud)'" />
            <circle cx="160" cy="120" r="14" [attr.fill]="'var(--aud-soft)'" />
            <circle cx="640" cy="160" r="20" [attr.fill]="'var(--aud-soft)'" />
            <circle cx="680" cy="380" r="12" [attr.fill]="'var(--aud)'" />
          </ng-container>

          <ng-container *ngSwitchCase="'compass'">
            <!-- Brújula / mapa / ruta -->
            <circle cx="400" cy="280" r="120" fill="#fff" stroke-width="6" [attr.stroke]="'var(--aud)'" />
            <circle cx="400" cy="280" r="100" [attr.fill]="'var(--aud-cream)'" />
            <polygon points="400,200 420,280 400,360 380,280" [attr.fill]="'var(--aud)'" />
            <circle cx="400" cy="280" r="10" fill="#fff" stroke-width="4" [attr.stroke]="'var(--aud)'" />
            <text x="400" y="178" text-anchor="middle" font-family="Garet, sans-serif" font-weight="900" font-size="18" [attr.fill]="'var(--aud)'">N</text>
          </ng-container>

          <!-- Default: hero balanceado -->
          <ng-container *ngSwitchDefault>
            <!-- Pantalla flotante -->
            <rect x="380" y="160" width="320" height="200" rx="20" fill="#fff" stroke-width="6" [attr.stroke]="'var(--aud)'" />
            <rect x="396" y="176" width="288" height="168" rx="10" [attr.fill]="'var(--aud-cream)'" />
            <circle cx="540" cy="232" r="32" [attr.fill]="'var(--aud-soft)'" />
            <polygon points="528,216 528,248 560,232" fill="#fff" />
            <rect x="430" y="280" width="220" height="6" rx="3" [attr.fill]="'var(--aud)'" />
            <rect x="430" y="294" width="160" height="6" rx="3" [attr.fill]="'var(--aud-soft)'" />

            <!-- Decoración orbital -->
            <circle cx="180" cy="180" r="48" [attr.fill]="'var(--aud-soft)'" fill-opacity="0.85" />
            <path d="M 160,180 l 14,16 28,-32" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />

            <circle cx="160" cy="380" r="34" [attr.fill]="'var(--aud)'" />
            <path d="M 148,380 q 12,-14 24,0 q -12,14 -24,0 z" fill="#fff" />

            <circle cx="720" cy="380" r="26" [attr.fill]="'var(--aud-soft)'" />
            <path d="M 720,366 v 28 M 706,380 h 28" stroke="#fff" stroke-width="5" stroke-linecap="round" />

            <!-- Estrellas -->
            <path d="M 740,140 l 6,14 14,2 -10,10 2,14 -12,-7 -12,7 2,-14 -10,-10 14,-2 z" [attr.fill]="'var(--aud)'" />
            <circle cx="120" cy="280" r="8" [attr.fill]="'var(--aud)'" />
            <circle cx="280" cy="420" r="6" [attr.fill]="'var(--aud-soft)'" />
          </ng-container>
        </ng-container>
      </svg>
    </div>
  `,
})
export class AudIllustrationComponent {
  theme = input<AudTheme>('cdj');
  scene = input<AudScene>('hero');
  alt = input<string>('');

  protected uid = Math.random().toString(36).slice(2, 9);

  protected viewBox = computed(() => '0 0 800 500');

  protected audClass = computed(() => {
    const map: Record<AudTheme, string> = {
      kids:     'audience-kids',
      teens:    'audience-teens',
      families: 'audience-families',
      teachers: 'audience-teachers',
      help:     'audience-help',
      edutips:  'audience-edutips',
      casi:     'audience-casi',
      cdj:      '',
    };
    return map[this.theme()] ?? '';
  });
}
