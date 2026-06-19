import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NOTEBOOKS_IA } from '../core/data/special-sections.data';
import { AINotebook, AINotebookKind } from '../core/models/special-sections.models';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-notebooks-ia',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notebooks-ia.html',
})
export class NotebooksIaComponent {
  protected notebooks = signal<AINotebook[]>(NOTEBOOKS_IA);

  protected kindFilter = signal<AINotebookKind | 'todos'>('todos');

  protected filtered = computed(() => {
    const k = this.kindFilter();
    return this.notebooks().filter((n) => k === 'todos' || n.kind === k);
  });

  protected featured = computed(() => {
    const list = this.filtered();
    return list.find((n) => n.featured) ?? list[0];
  });

  protected rest = computed(() => {
    const currentFeatured = this.featured();
    return this.filtered().filter((n) => n.id !== currentFeatured?.id);
  });

  protected kindMeta: Record<AINotebookKind, { label: string; icon: string; brand: string }> = {
    notebooklm:     { label: 'NotebookLM',      icon: 'auto_awesome',  brand: 'Google' },
    gemini_gem:     { label: 'Gemini Gem',      icon: 'diamond',       brand: 'Google' },
    chatgpt_gpt:    { label: 'ChatGPT GPT',     icon: 'smart_toy',     brand: 'OpenAI' },
    claude_project: { label: 'Claude Project',  icon: 'psychology',    brand: 'Anthropic' },
    other:          { label: 'Asistente IA',    icon: 'tips_and_updates', brand: 'Otro' },
  };
}
