import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeatureCard } from '../../core/models/content.models';
import { ImageEditService } from '../../core/services/image-edit.service';
import { ContentEditService } from '../../core/services/content-edit.service';
import { AuthService } from '../../core/services/auth.service';
import { ContentService } from '../../core/services/content.service';
import { EditableImageComponent } from '../editable-image/editable-image';
import { RevealDirective } from '../scroll-reveal/scroll-reveal.directive';
import { CARD_DESTINATIONS, resolveDestination } from '../../core/data/card-destinations';

/**
 * Tarjeta de contenido destacado — reutilizable en cualquier página.
 *
 * Campos editables (solo admin logueado):
 *   · title       → patchSeries (fuente de verdad compartida)
 *   · description → patchSeries
 *   · imageUrl    → patchSeries (como URL de texto)
 *   · destination → patchCard  (selección de ruta, no texto libre)
 *
 * href se resuelve automáticamente de destination — nunca se escribe a mano.
 * Si el usuario cierra sesión con el lápiz activo, editMode cae a false.
 *
 * Uso:
 *   <app-feature-card [card]="myCard" [delay]="80" />
 */
@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule, RouterLink, EditableImageComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-card.html',
})
export class FeatureCardComponent {
  private imgEdit     = inject(ImageEditService);
  private contentEdit = inject(ContentEditService);
  private auth        = inject(AuthService);
  private contentSvc  = inject(ContentService);

  @Input({ required: true }) card!: FeatureCard;
  @Input() delay = 0;
  @Input() showDescription = true;

  /** Lista de destinos válidos para el <select> del panel */
  readonly destinations = CARD_DESTINATIONS;

  /**
   * Editar solo está disponible si el admin está logueado.
   * isEditActive ya combina editMode + auth.isLogged() en el servicio.
   */
  editMode = this.imgEdit.isEditActive;

  panelOpen        = signal(false);
  editTitle        = signal('');
  editDescription  = signal('');
  editImageUrl     = signal('');
  editDestination  = signal('');

  /** ¿Hay parches locales pendientes de sincronizar con el backend? */
  hasEdits = computed(() => {
    const sp = this.contentEdit.seriesPatches()[this.card?.id];
    const cp = this.contentEdit.cardPatches()[this.card?.id];
    return !!(sp && Object.keys(sp).length) || !!(cp && Object.keys(cp).length);
  });

  /** Etiqueta del destino actual para mostrar en la tarjeta */
  destinationLabel = computed(() => {
    const key = this.contentEdit.cardPatches()[this.card?.id]?.['destination'] as string
      ?? this.card?.destination;
    return CARD_DESTINATIONS.find((d) => d.key === key)?.label ?? '';
  });

  openPanel() {
    this.editTitle.set(this.card.title);
    this.editDescription.set(this.card.description);
    this.editImageUrl.set(this.card.imageUrl);
    this.editDestination.set(this.card.destination ?? '');
    this.panelOpen.set(true);
  }

  closePanel() { this.panelOpen.set(false); }

  async savePanel() {
    // Título, descripción e imagen → patchSeries (fuente de verdad)
    const seriesPatch: { title?: string; description?: string; coverImageUrl?: string } = {};
    const t = this.editTitle().trim();
    const d = this.editDescription().trim();
    const u = this.editImageUrl().trim();
    if (t) seriesPatch.title = t;
    if (d) seriesPatch.description = d;
    if (u) {
      seriesPatch.coverImageUrl = u;
      this.imgEdit.setOverride(this.card.id, u);
    }
    if (Object.keys(seriesPatch).length) {
      this.contentEdit.patchSeries(this.card.id, seriesPatch);
    }

    // Destino → patchCard (campo exclusivo de FeatureCard, resuelve href)
    const dest = this.editDestination();
    if (dest && dest !== this.card.destination) {
      this.contentEdit.patchCard(this.card.id, {
        destination: dest,
        href: resolveDestination(dest),
      });
    }

    this.panelOpen.set(false);

    try {
      await this.contentSvc.saveCardToDatabase(this.card.id, {
        title: t,
        description: d,
        imageUrl: u,
        destination: dest
      });
    } catch (err) {
      console.error('Error al persistir en base de datos:', err);
    }
  }

  resetCard() {
    this.contentEdit.resetSeries(this.card.id);
    this.contentEdit.resetCard(this.card.id);
    this.imgEdit.clearOverride(this.card.id);
  }

  hasImageOverride(): boolean {
    return !!this.imgEdit.getOverride(this.card.id);
  }
}
