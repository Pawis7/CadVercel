import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Logo de Ciudadanía Digital Jalisco.
 *
 * - variant="normal" → logo oficial con texto integrado (sobre fondos claros)
 * - variant="white"  → logo blanco con texto (sobre fondos oscuros / crimson)
 * - variant="icon"   → SOLO el icono crimson, sin texto. Útil cuando el texto
 *                      se pone aparte en HTML (sidebar header).
 * - variant="auto"   → cambia automáticamente entre normal y white con
 *                      [data-theme="dark"] en <html>
 */
@Component({
  selector: 'app-cdj-logo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="cdj-logo grid place-items-center overflow-hidden" [class]="containerClass">
      @if (variant === 'icon') {
        <img src="/CiudadaniaLogo.png" alt="Ciudadanía Digital Jalisco"
             class="h-full w-full object-contain" loading="eager">
      } @else if (variant === 'white') {
        <img src="/Ciudadania_logo_blanco.png" alt="Ciudadanía Digital Jalisco"
             class="h-full w-full object-contain" loading="eager">
      } @else if (variant === 'normal') {
        <img src="/Ciudadania_logo.png" alt="Ciudadanía Digital Jalisco"
             class="h-full w-full object-contain" loading="eager">
      } @else {
        <img src="/Ciudadania_logo.png" alt="Ciudadanía Digital Jalisco"
             class="cdj-logo__light h-full w-full object-contain" loading="eager">
        <img src="/Ciudadania_logo_blanco.png" alt="Ciudadanía Digital Jalisco"
             class="cdj-logo__dark h-full w-full object-contain" loading="eager">
      }
    </span>
  `,
  styles: [`
    :host { display: inline-block; }
    .cdj-logo { position: relative; }
    .cdj-logo__dark { display: none; }
    :host-context([data-theme='dark']) .cdj-logo__light { display: none; }
    :host-context([data-theme='dark']) .cdj-logo__dark  { display: block; }
  `],
})
export class CdjLogoComponent {
  @Input() containerClass: string = 'h-10 w-10';
  @Input() variant: 'auto' | 'normal' | 'white' | 'icon' = 'auto';
}
