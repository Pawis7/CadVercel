import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { YoutubePlayerComponent } from '../shared/youtube-player/youtube-player';
import { ExploreByTopicComponent } from '../shared/explore-by-topic/explore-by-topic';
import { VideoModalComponent } from '../shared/video-modal/video-modal';

interface FilterChip { id: string; label: string; icon?: string; }
interface VideoMeta {
  id: string;
  age: string;
  level: string;
  topic: string;
  duration: string;
}

@Component({
  selector: 'app-edutips',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    RevealDirective, YoutubePlayerComponent, ExploreByTopicComponent, VideoModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edutips.html',
})
export class EdutipsComponent {
  private content = inject(ContentService);
  private videoMeta: Record<string, VideoMeta> = {
    'edu-1':  { id: 'edu-1',  age: 'a',     level: 'todos', topic: 'familia',      duration: 'med' },
    'edu-2':  { id: 'edu-2',  age: 'todos', level: 'todos', topic: 'herramientas', duration: 'cort' },
    'edu-3':  { id: 'edu-3',  age: 'k',     level: 'pri-a', topic: 'herramientas', duration: 'cort' },
    'edu-4':  { id: 'edu-4',  age: 'k',     level: 'pri-b', topic: 'herramientas', duration: 'cort' },
    'edu-5':  { id: 'edu-5',  age: 'todos', level: 'todos', topic: 'herramientas', duration: 'cort' },
    'edu-6':  { id: 'edu-6',  age: 't',     level: 'sec',   topic: 'bienestar',    duration: 'cort' },
    'edu-7':  { id: 'edu-7',  age: 't',     level: 'prep',  topic: 'herramientas', duration: 'cort' },
    'edu-8':  { id: 'edu-8',  age: 'todos', level: 'todos', topic: 'seguridad',    duration: 'cort' },
    'edu-9':  { id: 'edu-9',  age: 'k',     level: 'pre',   topic: 'familia',      duration: 'cort' },
    'edu-10': { id: 'edu-10', age: 't',     level: 'sec',   topic: 'bienestar',    duration: 'cort' },
    'edu-11': { id: 'edu-11', age: 'todos', level: 'todos', topic: 'seguridad',    duration: 'cort' },
    'edu-12': { id: 'edu-12', age: 'todos', level: 'todos', topic: 'ia',           duration: 'cort' },
    'edu-13': { id: 'edu-13', age: 'k',     level: 'pri-a', topic: 'herramientas', duration: 'cort' },
    'edu-14': { id: 'edu-14', age: 'todos', level: 'todos', topic: 'herramientas', duration: 'cort' },
    'edu-15': { id: 'edu-15', age: 'k',     level: 'pre',   topic: 'herramientas', duration: 'cort' },
    'edu-16': { id: 'edu-16', age: 't',     level: 'prep',  topic: 'ia',           duration: 'cort' },
    'edu-17': { id: 'edu-17', age: 'todos', level: 'todos', topic: 'seguridad',    duration: 'cort' },
    'edu-18': { id: 'edu-18', age: 'todos', level: 'todos', topic: 'bienestar',    duration: 'cort' },
    'edu-19': { id: 'edu-19', age: 'todos', level: 'todos', topic: 'seguridad',    duration: 'cort' },
  };

  query = signal('');
  ageFilter = signal('todos');
  levelFilter = signal('todos');
  topicFilter = signal('todos');
  durationFilter = signal('todos');

  ageOptions: FilterChip[]      = [
    { id: 'todos', label: 'Todas las edades' },
    { id: 'k',     label: '5-11 años', icon: 'face' },
    { id: 't',     label: '12-17 años', icon: 'forum' },
    { id: 'a',     label: 'Familias / 18+', icon: 'groups' },
  ];
  levelOptions: FilterChip[]    = [
    { id: 'todos',  label: 'Todos los niveles' },
    { id: 'pre',    label: 'Preescolar' },
    { id: 'pri-b',  label: 'Primaria baja' },
    { id: 'pri-a',  label: 'Primaria alta' },
    { id: 'sec',    label: 'Secundaria' },
    { id: 'prep',   label: 'Preparatoria' },
  ];
  topicOptions: FilterChip[]    = [
    { id: 'todos',        label: 'Todos los temas' },
    { id: 'seguridad',    label: 'Seguridad',      icon: 'shield' },
    { id: 'familia',      label: 'Familia',        icon: 'groups' },
    { id: 'bienestar',    label: 'Bienestar',      icon: 'sentiment_calm' },
    { id: 'ia',           label: 'Inteligencia IA', icon: 'auto_awesome' },
    { id: 'herramientas', label: 'Herramientas',   icon: 'school' },
  ];
  durationOptions: FilterChip[] = [
    { id: 'todos', label: 'Cualquier duración' },
    { id: 'cort',  label: '< 5 min', icon: 'speed' },
    { id: 'med',   label: '5-15 min' },
    { id: 'larg',  label: '> 15 min' },
  ];

  edutipsSeries = computed(() => this.content.getSeriesBySlug('edutips'));
  videos = computed(() => this.edutipsSeries()?.videos ?? []);

  filteredVideos = computed(() => {
    const q = this.query().trim().toLowerCase();
    const age = this.ageFilter();
    const level = this.levelFilter();
    const topic = this.topicFilter();
    const duration = this.durationFilter();

    return this.videos().filter((v) => {
      const meta = this.videoMeta[v.id];
      if (age !== 'todos' && meta?.age !== age && meta?.age !== 'todos') return false;
      if (level !== 'todos' && meta?.level !== level && meta?.level !== 'todos') return false;
      if (topic !== 'todos' && meta?.topic !== topic) return false;
      if (duration !== 'todos' && meta?.duration !== duration) return false;
      if (!q) return true;

      return (
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        (v.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  });

  activeVideo = signal<any>(null);

  getYoutubeThumb(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|\/watch\?v=))([\w-]{11})/);
    const vid = match ? match[1] : '';
    return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
}
