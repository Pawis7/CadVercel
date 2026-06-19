# CDJ-Back · API Ciudadanía Digital Jalisco

Backend del portal **Ciudadanía Digital Jalisco**.
Stack: **Next.js 15 (App Router · route handlers) + Prisma 6 + PostgreSQL 17**.
Pensado para correr en el servidor Ubuntu propio de la SEP.

---

## Arquitectura en una diapositiva

```
CDJ-Back/
├── docker-compose.yml          ← Postgres local (dev)
├── prisma/
│   ├── schema.prisma           ← Modelo de datos completo
│   └── seed.ts                 ← Datos iniciales (replica el front)
├── public/uploads/             ← Imágenes subidas por el admin
└── src/
    ├── app/
    │   ├── layout.tsx          ← Layout raíz mínimo
    │   ├── page.tsx            ← Inventario de endpoints (UI de servicio)
    │   └── api/
    │       ├── health/                   GET smoke check
    │       ├── content/
    │       │   ├── site/                 GET bundle del sitio (boot del front)
    │       │   ├── audiences/            GET lista
    │       │   ├── audiences/[slug]/     GET detalle + series recomendadas
    │       │   ├── feature-cards/        GET · PUT (admin)
    │       │   └── series/               GET (todas o ?slug=…)
    │       ├── resources/                GET (filtros) · POST (admin)
    │       │   └── [slug]/               GET · PUT · DELETE (admin)
    │       ├── help/
    │       │   ├── situations/           GET
    │       │   │   └── [slug]/           GET
    │       │   └── channels/             GET
    │       ├── learning-paths/           GET · POST (admin)
    │       │   └── [slug]/               GET · PUT · DELETE (admin)
    │       ├── images/                   GET overrides
    │       │   └── [id]/                 PUT (admin · multipart) · DELETE
    │       ├── videos/[id]/              GET · PUT (admin: cambia URL YouTube)
    │       └── upload/                   POST (admin · multipart, archivo libre)
    ├── lib/
    │   ├── prisma.ts                     ← Cliente único (singleton dev-safe)
    │   ├── auth.ts                       ← isAdmin() bearer token estático
    │   ├── responses.ts                  ← ok / created / badRequest / notFound / serverError
    │   ├── validation.ts                 ← Zod schemas
    │   └── uploads.ts                    ← Persistencia de archivos en /public/uploads
    └── types/
```

**Decisiones:**
- **Route handlers** sobre RSC: el backend no renderiza UI, solo sirve JSON y archivos.
- **Bearer token estático** ahora; cuando llegue el login real (LDAP/SSO de la SEP) se cambia `lib/auth.ts` sin tocar las rutas.
- **`ImageOverride`** desacopla las imágenes del modelo: el front pide la URL por ID (`hero-main`, `category-ninas-y-ninos`, etc.) y el back devuelve el override si existe, si no la imagen base.
- **Enums Prisma** (`AudienceKey`, `ResourceFormat`, `ResourceTheme`…) en lugar de strings libres → integridad y autocompletado.

---

## Setup local

### 1) Postgres con Docker (recomendado)

```bash
cd CDJ-Back
cp .env.example .env
# Edita ADMIN_TOKEN con: openssl rand -hex 32

# Levanta Postgres + pgAdmin
docker compose up -d
# pgAdmin queda en http://127.0.0.1:5050  (admin@cdj.local / cdj_dev)
```

### 2) Dependencias + DB

```bash
yarn install
yarn db:generate      # Genera el client Prisma
yarn db:migrate       # Crea las tablas (modo dev)
yarn db:seed          # Mete el contenido inicial
```

### 3) Servidor

```bash
yarn dev              # http://127.0.0.1:4180
```

Abre <http://127.0.0.1:4180> y verás el inventario de endpoints.
Prueba: <http://127.0.0.1:4180/api/health>

---

## Scripts

| Script              | Qué hace                                                                |
|---------------------|--------------------------------------------------------------------------|
| `yarn dev`          | Next dev server (HMR) en `:4180`                                         |
| `yarn build`        | Build de producción                                                      |
| `yarn start`        | Sirve el build                                                           |
| `yarn db:up`        | `docker compose up -d postgres`                                          |
| `yarn db:down`      | `docker compose down`                                                    |
| `yarn db:generate`  | `prisma generate` (cliente TS)                                           |
| `yarn db:migrate`   | `prisma migrate dev` (crea/actualiza schema)                             |
| `yarn db:reset`     | `prisma migrate reset --force` (borra DB y reseedea)                     |
| `yarn db:studio`    | UI web de Prisma para inspeccionar/editar datos                          |
| `yarn db:seed`      | Reseedea sin tocar el schema                                             |

---

## Llamando a la API desde CDJ-Front

```ts
// CDJ-Front · src/app/core/services/content.service.ts (siguiente paso)
const API = 'http://127.0.0.1:4180/api';
const res = await fetch(`${API}/content/site`);
const { data } = await res.json();
```

Las llamadas admin requieren header:

```
Authorization: Bearer <ADMIN_TOKEN>
```

CORS abierto en dev (`*` por defecto) y restringido en prod por la variable `CORS_ORIGIN`.

---

## Subir imágenes desde el panel admin

```bash
# Reemplazar la imagen del hero
curl -X PUT http://127.0.0.1:4180/api/images/hero-main \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@/ruta/local/hero.png"
# → { data: { id: "hero-main", url: "/uploads/hero-main.png", ... } }
```

El front consume el mapa de overrides desde `GET /api/images` al boot y lo aplica
automáticamente vía el componente `<app-editable-image>`.

---

## Producción (Ubuntu de la SEP)

```bash
# En el servidor:
yarn install --production
yarn db:generate
yarn db:migrate deploy        # Sin prompts interactivos
yarn build
PORT=4180 yarn start          # idealmente detrás de PM2 o systemd
```

Nginx/Caddy delante para SSL + cache de `/uploads/*`.

---

## Pendientes / próximos pasos

- [ ] Conectar el `ContentService` del front al backend (con fallback a estático).
- [ ] Construir el panel `/admin` en el front que use estos endpoints.
- [ ] Migrar overrides de localStorage → backend.
- [ ] Endpoints para `LearningPath` ya están — falta UI en el front.
- [ ] Login real cuando la SEP entregue el SSO.
