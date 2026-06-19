import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Logo de Cursos Alfa Digital.
 *
 * - variant="normal" → logo oficial con texto integrado (sobre fondos claros)
 * - variant="white"  → logo blanco con texto (sobre fondos oscuros / crimson)
 * - variant="icon"   → SOLO el icono crimson, sin texto. Útil cuando el texto
 *                      se pone aparte en HTML (sidebar header).
 * - variant="auto"   → cambia automáticamente entre normal y white con
 *                      [data-theme="dark"] en <html>
 */
@Component({
  selector: 'app-cad-logo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="cad-logo grid place-items-center overflow-hidden" [class]="containerClass">
      @if (variant === 'icon') {
        <img src="/CiudadaniaLogo.png" alt="Cursos Alfa Digital"
             class="h-full w-full object-contain" loading="eager">
      } @else if (variant === 'white') {
        <img src="/Ciudadania_logo_blanco.png" alt="Cursos Alfa Digital"
             class="h-full w-full object-contain" loading="eager">
      } @else if (variant === 'normal') {
        <img src="/Ciudadania_logo.png" alt="Cursos Alfa Digital"
             class="h-full w-full object-contain" loading="eager">
      } @else {
        <img src="/Ciudadania_logo.png" alt="Cursos Alfa Digital"
             class="cad-logo__light h-full w-full object-contain" loading="eager">
        <img src="/Ciudadania_logo_blanco.png" alt="Cursos Alfa Digital"
             class="cad-logo__dark h-full w-full object-contain" loading="eager">
      }
    </span>
  `,
  styles: [`
    :host { display: inline-block; }
    .cad-logo { position: relative; }
    .cad-logo__dark { display: none; }
    :host-context([data-theme='dark']) .cad-logo__light { display: none; }
    :host-context([data-theme='dark']) .cad-logo__dark  { display: block; }
  `],
})
export class CadLogoComponent {
  @Input() containerClass: string = 'h-10 w-10';
  @Input() variant: 'auto' | 'normal' | 'white' | 'icon' = 'auto';
}
