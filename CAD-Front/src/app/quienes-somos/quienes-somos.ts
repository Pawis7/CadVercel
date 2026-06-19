import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ABOUT_TEAM } from '../core/data/page-content';
import { ContentService } from '../core/services/content.service';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quienes-somos.html',
})
export class QuienesSomosComponent {
  private content = inject(ContentService);
  pillars = this.content.pillars;
  team = ABOUT_TEAM;
}
