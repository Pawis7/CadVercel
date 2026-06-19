import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TopicItem {
  id: string;
  label: string;
  icon: string;
  bgClass: string;
}

export const DEFAULT_TOPICS: TopicItem[] = [
  { id: 'seguridad',     label: 'Seguridad y privacidad', icon: 'lock',          bgClass: 'bg-blue-500' },
  { id: 'convivencia',   label: 'Convivencia digital',    icon: 'forum',         bgClass: 'bg-violet-500' },
  { id: 'bienestar',     label: 'Bienestar digital',      icon: 'spa',           bgClass: 'bg-rose-500' },
  { id: 'pensamiento',   label: 'Pensamiento crítico',    icon: 'psychology',    bgClass: 'bg-amber-500' },
  { id: 'creatividad',   label: 'Creatividad y creación', icon: 'palette',       bgClass: 'bg-pink-500' },
  { id: 'uso',           label: 'Uso responsable',        icon: 'eco',           bgClass: 'bg-rose-500' },
];

@Component({
  selector: 'app-explore-by-topic',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card mb-8 p-6 sm:mb-10 sm:p-8">
      <div class="section-head">
        <div>
          <p class="eyebrow text-[color:var(--c-teens)]">Explora por tema</p>
          <h2 class="display-2 mt-1">{{ heading }}</h2>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        <article *ngFor="let t of topics; let i = index"
           class="group flex flex-col items-center gap-2.5 rounded-xl border border-transparent p-3 transition-all hover:border-[color:var(--border-soft)] hover:bg-[color:var(--surface-soft)] sm:gap-3 sm:p-4">
          <span
            class="grid h-12 w-12 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
            [ngClass]="t.bgClass">
            <span class="material-symbols-rounded text-2xl icon-fill sm:text-[26px]">{{ t.icon }}</span>
          </span>
          <span class="text-center text-[11px] font-bold leading-tight text-[color:var(--text-secondary)] sm:text-xs">
            {{ t.label }}
          </span>
        </article>
      </div>
    </section>
  `,
})
export class ExploreByTopicComponent {
  @Input() heading = 'Encuentra por interés';
  @Input() topics: TopicItem[] = DEFAULT_TOPICS;
}
