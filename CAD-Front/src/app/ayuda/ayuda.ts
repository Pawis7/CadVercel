import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HELP_CHANNELS, HELP_SITUATIONS } from '../core/data/page-content';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { AudIllustrationComponent } from '../shared/aud-illustration/aud-illustration';
import { UiIconComponent, UiIconName } from '../shared/ui-icon/ui-icon';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, AudIllustrationComponent, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ayuda.html',
})
export class AyudaComponent {
  situations = HELP_SITUATIONS.map((situation, index) => ({
    ...situation,
    uiIcon: ([
      'message',
      'warning',
      'shield',
      'lock',
      'flag',
      'user',
    ] as UiIconName[])[index] ?? 'shield',
  }));

  channels = HELP_CHANNELS.map((channel, index) => ({
    ...channel,
    uiIcon: ([
      'community',
      'building',
      'shield',
    ] as UiIconName[])[index] ?? 'community',
  }));

  steps = [
    { icon: 'spark' as UiIconName, title: 'Detente y respira', description: 'No respondas en caliente. Toma distancia.' },
    { icon: 'file' as UiIconName, title: 'Guarda evidencia', description: 'Captura mensajes, links y nombres de usuario.' },
    { icon: 'shield' as UiIconName, title: 'Bloquea y reporta', description: 'Usa los reportes de la plataforma para frenar el contacto.' },
    { icon: 'phone' as UiIconName, title: 'Pide apoyo', description: 'Habla con alguien de confianza y llama a una línea oficial.' },
  ];

  cleanPhone(phone: string): string {
    return phone.replace(/\s+/g, '');
  }
}
