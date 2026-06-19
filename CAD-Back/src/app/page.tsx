// Landing del backend. Quien abre la URL raíz ve el inventario de endpoints
// y el estado del servicio. No es UI pública — es una página de servicio.

const ENDPOINTS = [
  { method: 'GET',  path: '/api/health',                    desc: 'Smoke check' },
  { method: 'GET',  path: '/api/content/site',              desc: 'Bundle completo del sitio (boot del front)' },
  { method: 'GET',  path: '/api/content/audiences',         desc: 'Lista de audiencias' },
  { method: 'GET',  path: '/api/content/audiences/:slug',   desc: 'Detalle de audiencia + series recomendadas' },
  { method: 'GET',  path: '/api/content/series',            desc: 'Series con sus videos' },
  { method: 'GET',  path: '/api/content/feature-cards',     desc: 'Feature cards del home' },
  { method: 'PUT',  path: '/api/content/feature-cards',     desc: 'Actualizar (admin)', auth: true },
  { method: 'GET',  path: '/api/resources',                 desc: 'Recursos paginados con filtros' },
  { method: 'POST', path: '/api/resources',                 desc: 'Crear recurso (admin)', auth: true },
  { method: 'GET',  path: '/api/resources/:slug',           desc: 'Detalle de recurso' },
  { method: 'PUT',  path: '/api/resources/:slug',           desc: 'Actualizar recurso (admin)', auth: true },
  { method: 'DEL',  path: '/api/resources/:slug',           desc: 'Borrar recurso (admin)', auth: true },
  { method: 'GET',  path: '/api/help/situations',           desc: 'Situaciones de Ayuda Digital' },
  { method: 'GET',  path: '/api/help/situations/:slug',     desc: 'Detalle de situación' },
  { method: 'GET',  path: '/api/help/channels',             desc: 'Canales de orientación / atención / denuncia' },
  { method: 'GET',  path: '/api/learning-paths',            desc: 'Rutas guiadas' },
  { method: 'POST', path: '/api/learning-paths',            desc: 'Crear ruta (admin)', auth: true },
  { method: 'GET',  path: '/api/learning-paths/:slug',      desc: 'Detalle de ruta' },
  { method: 'PUT',  path: '/api/learning-paths/:slug',      desc: 'Actualizar (admin)', auth: true },
  { method: 'DEL',  path: '/api/learning-paths/:slug',      desc: 'Borrar (admin)', auth: true },
  { method: 'GET',  path: '/api/images',                    desc: 'Mapa de overrides de imágenes' },
  { method: 'PUT',  path: '/api/images/:id',                desc: 'Subir/reemplazar imagen (admin, multipart)', auth: true },
  { method: 'DEL',  path: '/api/images/:id',                desc: 'Quitar override (admin)', auth: true },
  { method: 'GET',  path: '/api/videos/:id',                desc: 'Detalle de video' },
  { method: 'PUT',  path: '/api/videos/:id',                desc: 'Actualizar URL YouTube / metadata (admin)', auth: true },
  { method: 'POST', path: '/api/upload',                    desc: 'Subir archivo genérico (admin, multipart)', auth: true },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 880, margin: '40px auto', padding: '0 20px', color: '#0F172A' }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>CDJ-Back</h1>
      <p style={{ color: '#475569', marginBottom: 28 }}>
        API REST de Ciudadanía Digital Jalisco — Next.js + Prisma + PostgreSQL.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
            <th style={{ padding: '8px 10px' }}>Método</th>
            <th style={{ padding: '8px 10px' }}>Endpoint</th>
            <th style={{ padding: '8px 10px' }}>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {ENDPOINTS.map((e) => (
            <tr key={`${e.method}-${e.path}`} style={{ borderTop: '1px solid #E2E8F0' }}>
              <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: e.method === 'GET' ? '#0F766E' : e.method === 'DEL' ? '#E11D48' : '#7C3AED' }}>
                {e.method}
              </td>
              <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>
                {e.path}{' '}
                {e.auth && <span style={{ color: '#92400E', fontSize: 10 }}>· admin</span>}
              </td>
              <td style={{ padding: '8px 10px', color: '#475569' }}>{e.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
