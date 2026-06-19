import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FeatureCard, VideoSeries } from '../models/content.models';

const CARDS_KEY  = 'cdj_card_edits_v1';
const SERIES_KEY = 'cdj_series_edits_v1';

/**
 * Gestiona ediciones pendientes (parches) sobre FeatureCards y VideoSeries.
 *
 * Estrategia: guarda un mapa de overrides parciales en localStorage.
 * El ContentService fusiona estos parches encima de los datos del backend
 * cada vez que cualquiera de los signals cambia — gracias a computed().
 *
 * Cuando el backend implementa el endpoint PATCH /content/feature-cards/:id,
 * solo hay que llamar a pushToBackend() y limpiar el localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ContentEditService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /** Mapa id → parche parcial de FeatureCard */
  readonly cardPatches = signal<Record<string, Partial<FeatureCard>>>(
    this.load<Record<string, Partial<FeatureCard>>>(CARDS_KEY) ?? {}
  );

  /** Mapa id → parche parcial de VideoSeries */
  readonly seriesPatches = signal<Record<string, Partial<VideoSeries>>>(
    this.load<Record<string, Partial<VideoSeries>>>(SERIES_KEY) ?? {}
  );

  constructor() {
    if (!this.isBrowser) return;
    effect(() => { this.save(CARDS_KEY,  this.cardPatches()); });
    effect(() => { this.save(SERIES_KEY, this.seriesPatches()); });
  }

  // ─── FeatureCard ────────────────────────────────────────────────────────────

  patchCard(id: string, patch: Partial<Omit<FeatureCard, 'id'>>) {
    this.cardPatches.update((current) => ({
      ...current,
      [id]: { ...(current[id] ?? {}), ...patch },
    }));
  }

  resetCard(id: string) {
    this.cardPatches.update(({ [id]: _, ...rest }) => rest);
  }

  /** Aplica los parches locales sobre el array original de cards. */
  applyCardPatches(cards: FeatureCard[]): FeatureCard[] {
    const patches = this.cardPatches();
    return cards.map((c) =>
      patches[c.id] ? { ...c, ...patches[c.id] } : c
    );
  }

  // ─── VideoSeries ─────────────────────────────────────────────────────────────

  patchSeries(id: string, patch: Partial<Omit<VideoSeries, 'id' | 'videos'>>) {
    this.seriesPatches.update((current) => ({
      ...current,
      [id]: { ...(current[id] ?? {}), ...patch },
    }));
  }

  resetSeries(id: string) {
    this.seriesPatches.update(({ [id]: _, ...rest }) => rest);
  }

  /** Aplica los parches locales sobre el array original de series. */
  applySeriesPatches(series: VideoSeries[]): VideoSeries[] {
    const patches = this.seriesPatches();
    return series.map((s) =>
      patches[s.id] ? { ...s, ...patches[s.id] } : s
    );
  }

  // ─── Merge desde backend ──────────────────────────────────────────────────────
  /**
   * Llamar cuando el backend confirma los cambios.
   * Limpia solo los parches que el servidor ya persistió.
   */
  confirmCardPatch(id: string) { this.resetCard(id); }
  confirmSeriesPatch(id: string) { this.resetSeries(id); }

  // ─── Utils ───────────────────────────────────────────────────────────────────

  private save(key: string, data: unknown) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }

  private load<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
