/**
 * Configuración de la API del backend de Cursos Alfa Digital.
 *
 * En dev local apunta al Next.js en :4280.
 * Cuando el backend pase a producción, este es el único archivo a tocar
 * (o se mete en environment.ts si separamos build configs).
 */

const RUNTIME_OVERRIDE_KEY = 'cad_api_base_v1';

function readOverride(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try { return localStorage.getItem(RUNTIME_OVERRIDE_KEY); } catch { return null; }
}

export const API_BASE: string = readOverride() ?? 'http://localhost:4280/api';

export const API_TIMEOUT_MS = 4500;

/**
 * Token Bearer del admin. Se inyecta solo en peticiones admin.
 * En dev se puede pegar via `localStorage.setItem('cad_admin_token_v1', '...')`
 * En prod lo va a inyectar el panel admin después del login real.
 */
const ADMIN_TOKEN_KEY = 'cad_admin_token_v1';

export function getAdminToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
}

export function setAdminToken(token: string | null) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else       localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
}
