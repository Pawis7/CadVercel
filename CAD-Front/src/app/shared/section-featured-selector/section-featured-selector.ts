import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { ImageEditService } from '../../core/services/image-edit.service';
import { FeatureCard } from '../../core/models/content.models';

@Component({
  selector: 'app-section-featured-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-featured-selector.html',
  styleUrl: './section-featured-selector.css',
})
export class SectionFeaturedSelectorComponent {
  private content = inject(ContentService);
  private imgEdit = inject(ImageEditService);

  @Input() section!: string;
  @Input() sectionTitle: string = 'esta sección';

  // Solo se muestra si editMode está activo y logueado
  isEditActive = this.imgEdit.isEditActive;

  // Estado del modal
  isOpen = signal(false);
  isSaving = signal(false);

  // Lista de todas las feature cards disponibles en la BD (el pool)
  allCards = this.content.featureCards;

  // ID's seleccionados locales
  selectedIds = signal<string[]>([]);

  // Nombre legible del destino de la card
  getDestinationLabel(dest?: string): string {
    if (!dest) return 'Ninguno';
    const map: Record<string, string> = {
      series: 'Catálogo de Series',
      series_edutips: 'Serie Edutips',
      series_casi: 'Serie El día que casi',
      series_familias: 'Serie Familias conectadas',
      cursos: 'Cursos en línea',
      juegos: 'Juegos interactivos',
      recursos: 'Biblioteca de recursos',
      ayuda: 'Ayuda Digital',
      edutips: 'Biblioteca Edutips',
      notebooks_ia: 'Notebooks IA',
      ninas_y_ninos: 'Perfil Niñas y Niños',
      adolescentes: 'Perfil Adolescentes',
      familias: 'Perfil Familias',
      docentes: 'Perfil Docentes',
      quienes_somos: 'Quiénes Somos',
      inicio: 'Página de Inicio',
    };
    return map[dest] ?? dest;
  }

  openModal() {
    // Cargar selección actual basada en el campo sections
    const current = this.allCards()
      .filter((card) => card.sections?.includes(this.section))
      .map((card) => card.id);
    this.selectedIds.set(current);
    this.isOpen.set(true);
  }

  closeModal() {
    if (this.isSaving()) return;
    this.isOpen.set(false);
  }

  toggleCard(cardId: string) {
    const current = [...this.selectedIds()];
    const idx = current.indexOf(cardId);
    if (idx > -1) {
      // Remover
      current.splice(idx, 1);
      this.selectedIds.set(current);
    } else {
      // Agregar si no excede el límite de 3
      if (current.length >= 3) {
        alert('Solo puedes seleccionar un máximo de 3 elementos destacados para esta sección.');
        return;
      }
      current.push(cardId);
      this.selectedIds.set(current);
    }
  }

  async saveFeatured() {
    this.isSaving.set(true);
    try {
      await this.content.updateSectionFeaturedCards(this.section, this.selectedIds());
      this.isOpen.set(false);
    } catch (err) {
      alert('Error al guardar la selección de destacados.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
