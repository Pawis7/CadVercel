import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RESOURCES } from '../core/data/page-content';
import { ContentService } from '../core/services/content.service';
import { ImageEditService } from '../core/services/image-edit.service';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { UiIconComponent, UiIconName } from '../shared/ui-icon/ui-icon';
import { FeatureCardComponent } from '../shared/feature-card/feature-card';
import { SectionFeaturedSelectorComponent } from '../shared/section-featured-selector/section-featured-selector';

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RevealDirective, UiIconComponent, FeatureCardComponent, SectionFeaturedSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recursos.html',
})
export class RecursosComponent {
  private content = inject(ContentService);
  private imgEdit = inject(ImageEditService);

  featuredCards = this.content.recursosFeatureCards;
  editMode = this.imgEdit.isEditActive;
  private allResources = RESOURCES.map((resource, index) => ({
    ...resource,
    uiIcon: ([
      'play',
      'phone',
      'course',
      'check',
      'community',
      'spark',
      'file',
      'library',
    ] as UiIconName[])[index] ?? 'library',
    kind: ([
      'video',
      'audio',
      'guia',
      'pdf',
      'guia',
      'guia',
      'pdf',
      'guia',
    ] as string[])[index] ?? 'guia',
  }));

  query = signal('');
  typeFilter = signal('todos');

  resourceTypes = [
    { id: 'todos', label: 'Todos' },
    { id: 'video', label: 'Video' },
    { id: 'guia', label: 'Guía' },
    { id: 'pdf', label: 'PDF' },
    { id: 'audio', label: 'Audio' },
  ];

  resources = computed(() => {
    const query = this.query().trim().toLowerCase();
    const type = this.typeFilter();

    return this.allResources.filter((resource) => {
      if (type !== 'todos' && resource.kind !== type) return false;
      if (!query) return true;

      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)
      );
    });
  });

  highlightedTopics: { title: string; copy: string; icon: UiIconName; tone: string }[] = [
    { title: 'Privacidad', copy: 'Cuidar datos, cuentas y reputación digital.', icon: 'lock', tone: 'bg-sky-600' },
    { title: 'Convivencia', copy: 'Hablar, responder y poner límites con criterio.', icon: 'community', tone: 'bg-violet-600' },
    { title: 'Bienestar', copy: 'Usar tecnología con más equilibrio y claridad.', icon: 'spark', tone: 'bg-rose-600' },
  ];
}
