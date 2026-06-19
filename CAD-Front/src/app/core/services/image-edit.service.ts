import { Injectable, signal, effect, inject, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { ApiClient } from './api.client';

const STORAGE_KEY   = 'cad_image_overrides_v1';
const EDIT_MODE_KEY = 'cad_edit_mode_v1';

/**
 * Gestiona el modo de edición y los overrides locales de imágenes.
 *
 * REGLA DE SEGURIDAD:
 *   `editMode` es la señal interna (puede ser true/false).
 *   `isEditActive` es el computed que deben usar los componentes:
 *     = editMode() && auth.isLogged()
 *   Si el usuario cierra sesión → isEditActive cae a false automáticamente.
 *   `toggleEdit()` es un no-op si el usuario no está logueado.
 */
@Injectable({ providedIn: 'root' })
export class ImageEditService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser  = isPlatformBrowser(this.platformId);
  private auth       = inject(AuthService);
  private api        = inject(ApiClient);

  /** Estado interno del lápiz. No usar directamente en templates. */
  readonly editMode  = signal<boolean>(false);

  /** ← Usar ESTE en templates y componentes: garantiza auth + lápiz */
  readonly isEditActive = computed(() => this.editMode() && this.auth.isLogged());

  readonly overrides = signal<Record<string, string>>(this.readOverrides());

  constructor() {
    if (!this.isBrowser) return;

    // Persistir overrides
    effect(() => {
      const v = this.overrides();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
    });

    // Auth guard reactivo:
    // - Si se desloguea con el lápiz activo → editMode = false
    // - Si se loguea y tenía el lápiz activo antes → restaurar
    effect(() => {
      const logged = this.auth.isLogged();
      if (!logged) {
        this.editMode.set(false);
        try { localStorage.setItem(EDIT_MODE_KEY, '0'); } catch {}
      }
    });
  }

  /**
   * Activa/desactiva el lápiz. No-op si el usuario no está logueado.
   */
  toggleEdit() {
    if (!this.auth.isLogged()) {
      this.editMode.set(false);
      return;
    }
    this.editMode.update((v) => {
      const next = !v;
      try { localStorage.setItem(EDIT_MODE_KEY, next ? '1' : '0'); } catch {}
      return next;
    });
  }

  /** Restaura el lápiz desde localStorage. Llamar solo después de checkSession(). */
  restoreEditMode() {
    if (!this.isBrowser || !this.auth.isLogged()) return;
    const saved = this.readEditMode();
    if (saved) this.editMode.set(true);
  }

  setOverride(id: string, dataUrl: string) {
    this.overrides.update((v) => ({ ...v, [id]: dataUrl }));
  }

  clearOverride(id: string) {
    this.overrides.update((v) => {
      const { [id]: _, ...rest } = v;
      return rest;
    });
  }

  async uploadImage(id: string, file: File): Promise<void> {
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await this.api.putMultipart<any>(`/images/${id}`, form);
      const url = res.data?.url ?? res.url;
      if (url) {
        this.setOverride(id, url);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  }

  async deleteOverride(id: string): Promise<void> {
    try {
      await this.api.del(`/images/${id}`);
      this.clearOverride(id);
    } catch (err) {
      console.error('Error deleting image override:', err);
      throw err;
    }
  }

  clearAll() { this.overrides.set({}); }

  getOverride(id: string): string | undefined {
    return this.overrides()[id];
  }

  mergeBackendOverrides(serverMap: Record<string, string>) {
    if (!serverMap || typeof serverMap !== 'object') return;
    this.overrides.update((current) => {
      const merged: Record<string, string> = { ...serverMap };
      for (const [id, val] of Object.entries(current)) {
        if (val?.startsWith('data:')) merged[id] = val;
      }
      return merged;
    });
  }

  private readOverrides(): Record<string, string> {
    if (!this.isBrowser) return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  private readEditMode(): boolean {
    if (!this.isBrowser) return false;
    try { return localStorage.getItem(EDIT_MODE_KEY) === '1'; } catch { return false; }
  }
}
