import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { RevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card';
import { SectionFeaturedSelectorComponent } from '../../shared/section-featured-selector/section-featured-selector';

import { ImageEditService } from '../../core/services/image-edit.service';

@Component({
  selector: 'app-series-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RevealDirective, FeatureCardComponent, SectionFeaturedSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './series-list.html',
})
export class SeriesListComponent {
  private content = inject(ContentService);
  private imgEdit = inject(ImageEditService);

  query = signal('');
  featuredCards = this.content.seriesFeatureCards;
  editMode = this.imgEdit.isEditActive;

  /** Series filtradas y convertidas a FeatureCard para usar app-feature-card */
  cards = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.content.videoSeries();

    const filtered = !q ? all : all.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.videos.some((v) =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        (v.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    );

    return filtered.map((s) => this.content.seriesAsCard(s));
  });
}
