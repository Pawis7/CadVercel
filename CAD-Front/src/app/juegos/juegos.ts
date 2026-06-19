import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GAMES } from '../core/data/special-sections.data';
import { Game, GameKind } from '../core/models/special-sections.models';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-juegos',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './juegos.html',
})
export class JuegosComponent {
  protected games = signal<Game[]>(GAMES);

  protected ageBucket = signal<'todos' | 'kids' | 'teens' | 'familias'>('todos');

  protected filtered = computed(() => {
    const b = this.ageBucket();
    return this.games().filter((g) => {
      if (b === 'todos') return true;
      if (b === 'kids')     return g.audience === 'kids' || (g.ageMin ?? 0) <= 11;
      if (b === 'teens')    return g.audience === 'teens' || ((g.ageMin ?? 0) >= 11 && (g.ageMin ?? 0) <= 18);
      if (b === 'familias') return g.audience === 'families';
      return true;
    });
  });

  protected kindLabels: Record<GameKind, { label: string; icon: string }> = {
    quiz:       { label: 'Quiz',         icon: 'quiz' },
    simulator:  { label: 'Simulador',    icon: 'memory' },
    card_game:  { label: 'Cartas',       icon: 'style' },
    story:      { label: 'Historia',     icon: 'auto_stories' },
    puzzle:     { label: 'Rompecabezas', icon: 'extension' },
    arcade:     { label: 'Arcade',       icon: 'sports_esports' },
    embed:      { label: 'En sitio',     icon: 'play_arrow' },
    external:   { label: 'Externo',      icon: 'open_in_new' },
  };
}
