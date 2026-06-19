import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CadLogoComponent } from '../shared/cad-logo/cad-logo';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CadLogoComponent],
  template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>

      <div class="login-card glass">
        <div class="login-header">
          <app-cad-logo variant="white" containerClass="h-16 w-auto shrink-0"></app-cad-logo>
          <h1 class="login-title">Acceso Alfa</h1>
          <p class="login-subtitle">Panel de administración · CAD</p>
        </div>

        <form (submit)="onLogin(); $event.preventDefault()" class="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <span class="material-symbols-rounded">mail</span>
              <input 
                type="email" 
                id="email" 
                name="email" 
                [(ngModel)]="email" 
                placeholder="admin@cdj.jalisco.gob.mx"
                required
                autocomplete="email"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <span class="material-symbols-rounded">lock</span>
              <input 
                type="password" 
                id="password" 
                name="password" 
                [(ngModel)]="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
              >
            </div>
          </div>

          @if (error()) {
            <div class="error-message">
              <span class="material-symbols-rounded">warning</span>
              {{ error() }}
            </div>
          }

          <button type="submit" class="login-btn" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Validando...
            } @else {
              <span>Entrar</span>
              <span class="material-symbols-rounded">arrow_forward</span>
            }
          </button>
        </form>

        <div class="login-footer">
          <a routerLink="/" class="back-link">
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            Volver al inicio
          </a>
        </div>
      </div>
      
      <div class="legal-notice">
        Sistema exclusivo para personal autorizado de Cursos Alfa Digital Jalisco.
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
    }

    .login-page {
      position: relative;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--surface-base);
      overflow: hidden;
      color: var(--text-primary);
    }

    .login-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      opacity: 0.4;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.2;
      animation: drift 20s infinite alternate;
    }

    .blob-1 {
      top: -10%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: var(--c-cdj-soft);
    }

    .blob-2 {
      bottom: -10%;
      left: -10%;
      width: 600px;
      height: 600px;
      background: var(--c-cdj);
      animation-delay: -5s;
    }

    @keyframes drift {
      from { transform: translate(0, 0) scale(1); }
      to { transform: translate(60px, 60px) scale(1.15); }
    }

    .login-card {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      padding: 3rem 2.5rem;
      background: var(--surface-card);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      backdrop-filter: saturate(180%) blur(12px);
      -webkit-backdrop-filter: saturate(180%) blur(12px);
    }

    /* En modo oscuro, le damos un toque más "glass" */
    [data-theme='dark'] .login-card {
      background: rgba(17, 24, 39, 0.7);
    }

    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .login-title {
      font-size: 2rem;
      font-weight: 900;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }

    .login-subtitle {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-mute);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .form-group label {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-soft);
      margin-left: 0.25rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper span {
      position: absolute;
      left: 1.25rem;
      color: var(--text-mute);
      font-size: 1.25rem;
      pointer-events: none;
    }

    .input-wrapper input {
      width: 100%;
      height: 3.5rem;
      background: var(--surface-soft);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 0 1.25rem 0 3.5rem;
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 500;
      transition: all 200ms ease;
    }

    .input-wrapper input:focus {
      outline: none;
      background: var(--surface-card);
      border-color: var(--c-cdj);
      box-shadow: var(--ring-focus);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--c-help-cream);
      border: 1px solid var(--c-help-tint);
      border-radius: var(--radius-md);
      color: var(--c-help);
      font-size: 0.875rem;
      font-weight: 600;
    }

    .login-btn {
      height: 3.5rem;
      margin-top: 1rem;
      background: var(--c-cdj);
      color: var(--text-on-accent);
      border: none;
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: var(--shadow-md);
    }

    .login-btn:hover:not(:disabled) {
      background: var(--c-cdj-deep);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .login-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-mute);
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
      transition: color 200ms ease;
    }

    .back-link:hover {
      color: var(--c-cdj);
    }

    .legal-notice {
      position: relative;
      z-index: 10;
      margin-top: 3rem;
      font-size: 0.75rem;
      color: var(--text-mute);
      text-align: center;
      max-width: 300px;
      line-height: 1.5;
      font-weight: 500;
    }

    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async onLogin() {
    if (!this.email || !this.password) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }
}
