# Especificaciones de imágenes — Ciudadanía Digital

Tamaños recomendados (en píxeles) para todas las imágenes del portal. Las dimensiones están tomadas directamente del código (atributos `[width]`, `[height]` y `aspectLabel` del componente `<app-editable-image>`), por lo que son los tamaños **óptimos** que el navegador va a renderizar (entregar más grande es desperdicio, más chico se ve borroso).

## Formato y peso recomendados

| Uso                    | Formato preferido     | Fallback     | Peso máx. recomendado |
|------------------------|-----------------------|--------------|------------------------|
| Fotografías            | **AVIF** o **WebP**   | JPG (q≈82)   | **≤ 250 KB**           |
| Logos / íconos         | **SVG**               | PNG transp.  | ≤ 30 KB                |
| Favicon                | **ICO** + **PNG/SVG** | —            | ≤ 50 KB                |
| Open Graph (compartir) | **JPG** o **PNG**     | —            | ≤ 300 KB               |

> Para hi-DPI (retina) se puede subir **2×** la resolución exportando al doble (ej. hero a 3200×2400) y dejar que el navegador haga downscale. No es obligatorio: con los tamaños base abajo se ve bien en la mayoría de pantallas.

---

## 1) Página de Inicio (`/`)

### 1.1 Hero principal

| ID en el código | Dimensiones (px) | Aspect | Tema sugerido |
|-----------------|------------------|--------|---------------|
| `hero-main`     | **1600 × 1200**  | 4:3    | Persona/grupo usando dispositivo. Cara/sujeto en el **tercio derecho** (en mobile/lg el lado izquierdo se cubre con un degradado blanco). |

### 1.2 Categorías de la home (cards verticales)

Son 4 cards. Cada una abre la página de su audiencia. Sujeto en el **tercio inferior** (allí va el título sobreimpreso).

| ID en el código            | Dimensiones (px) | Aspect | Audiencia        | Tema sugerido                                   |
|----------------------------|------------------|--------|------------------|-------------------------------------------------|
| `category-ninas-y-ninos`   | **800 × 960**    | 5:6    | Niñas y niños    | Niñas/niños 5–11 años jugando, dibujando o con tablet. |
| `category-adolescentes`    | **800 × 960**    | 5:6    | Adolescentes     | Adolescente 12–17 años con celular, mochila o auriculares. |
| `category-familias`        | **800 × 960**    | 5:6    | Familias         | Familia conviviendo, mamá/papá con hijo/hija frente a pantalla. |
| `category-docentes`        | **800 × 960**    | 5:6    | Docentes         | Docente frente al grupo, pizarrón o laptop.     |

### 1.3 Series destacadas (mini-cards)

Reutiliza la portada de cada serie (ver sección 3).

### 1.4 Feature cards (mini-thumbnails dentro de cada card)

| ID en el código    | Dimensiones (px) | Aspect | Card destino       | Tema sugerido                                   |
|--------------------|------------------|--------|--------------------|-------------------------------------------------|
| `feature-edutips`  | **400 × 400**    | 1:1    | "Edutips"          | Imagen abstracta o detalle de play/video.       |
| `feature-casi`     | **400 × 400**    | 1:1    | "El día que casi"  | Estilo ilustrado/animado, alegre, infantil.     |
| `feature-ayuda`    | **400 × 400**    | 1:1    | "Ayuda Digital"    | Símbolo de protección/escudo/manos ayudando.    |

### 1.5 Banner CTA inferior

| ID en el código | Dimensiones (px) | Aspect | Tema sugerido |
|-----------------|------------------|--------|---------------|
| `cta-banner`    | **1920 × 900**   | 64:30  | Foto atmosférica, comunidad/conexión. Se renderiza al **30 % de opacidad** y con overlay azul/violeta/rosa. **Sin texto.** Mejor con zonas oscuras donde caerá la tipografía blanca. |

---

## 2) Páginas de Audiencia (`/p/:slug`)

Son 4 páginas, una por audiencia. Cada una tiene:

- **1 hero** (16:10) que se renderiza al 40 % de opacidad con overlay degradado.
- **N cards de sub-niveles** (5:4) con el título sobreimpreso.

### 2.1 Heros de audiencia

| ID en el código       | Dimensiones (px) | Aspect | Página           | Tema sugerido                                              |
|-----------------------|------------------|--------|------------------|------------------------------------------------------------|
| `aud-kids-hero`       | **1600 × 1000**  | 16:10  | Niñas y niños    | Niñez aprendiendo con tecnología, ambiente cálido y seguro. |
| `aud-teens-hero`      | **1600 × 1000**  | 16:10  | Adolescentes     | Adolescentes con dispositivos, vibe directo y honesto.     |
| `aud-families-hero`   | **1600 × 1000**  | 16:10  | Familias         | Familia conversando, momento real (sofá, comedor).         |
| `aud-teachers-hero`   | **1600 × 1000**  | 16:10  | Docentes         | Docente activo en aula con tecnología.                     |

### 2.2 Sub-niveles — Niñas y niños (3 imágenes)

| ID en el código      | Dimensiones (px) | Aspect | Sub-nivel       | Edad          |
|----------------------|------------------|--------|-----------------|---------------|
| `sub-kids-pre`       | **900 × 720**    | 5:4    | Preescolar      | 3 a 5 años    |
| `sub-kids-pb`        | **900 × 720**    | 5:4    | Primaria baja   | 6 a 8 años    |
| `sub-kids-pa`        | **900 × 720**    | 5:4    | Primaria alta   | 9 a 11 años   |

### 2.3 Sub-niveles — Adolescentes (2 imágenes)

| ID en el código      | Dimensiones (px) | Aspect | Sub-nivel       | Edad          |
|----------------------|------------------|--------|-----------------|---------------|
| `sub-teens-sec`      | **900 × 720**    | 5:4    | Secundaria      | 12 a 14 años  |
| `sub-teens-prep`     | **900 × 720**    | 5:4    | Preparatoria    | 15 a 17 años  |

### 2.4 Sub-niveles — Familias (4 imágenes)

| ID en el código      | Dimensiones (px) | Aspect | Sub-nivel       | Edad          |
|----------------------|------------------|--------|-----------------|---------------|
| `sub-fam-05`         | **900 × 720**    | 5:4    | Primera infancia | 0 a 5 años   |
| `sub-fam-611`        | **900 × 720**    | 5:4    | Niñez            | 6 a 11 años  |
| `sub-fam-1214`       | **900 × 720**    | 5:4    | Adolescencia temprana | 12 a 14 años |
| `sub-fam-1522`       | **900 × 720**    | 5:4    | Adolescencia tardía y juventud | 15 a 22 años |

### 2.5 Sub-niveles — Docentes (5 imágenes)

| ID en el código      | Dimensiones (px) | Aspect | Sub-nivel       | Edad          |
|----------------------|------------------|--------|-----------------|---------------|
| `sub-doc-pre`        | **900 × 720**    | 5:4    | Preescolar      | 3 a 5 años    |
| `sub-doc-pb`         | **900 × 720**    | 5:4    | Primaria baja   | 6 a 8 años    |
| `sub-doc-pa`         | **900 × 720**    | 5:4    | Primaria alta   | 9 a 11 años   |
| `sub-doc-sec`        | **900 × 720**    | 5:4    | Secundaria      | 12 a 14 años  |
| `sub-doc-prep`       | **900 × 720**    | 5:4    | Preparatoria    | 15 a 17 años  |

> **Total sub-niveles**: 14 imágenes en 5:4 (900×720).

---

## 3) Series de video (`/series` y `/series/:slug`)

Una imagen por serie. Sirve para tres usos: (a) mini-card en el home, (b) card del catálogo `/series`, (c) hero del detalle `/series/:slug`. Sin texto en la imagen.

| ID en el código              | Dimensiones (px) | Aspect | Serie                  | Tema sugerido                                          |
|------------------------------|------------------|--------|------------------------|--------------------------------------------------------|
| `series-cover-edutips`       | **1600 × 1000**  | 16:10  | **Edutips**            | Cápsulas para tu día a día digital. Estilo limpio, tono blue/cyan. |
| `series-cover-casi`          | **1600 × 1000**  | 16:10  | **El día que casi**    | Serie animada infantil. Tono yellow/orange, ilustración. |
| `series-cover-familias`      | **1600 × 1000**  | 16:10  | **Familias conectadas** | Familia conversando en casa. Tono orange/rose, real, cotidiano. |

> Si en el futuro se agregan más series, el ID es siempre `series-cover-{id-de-la-serie}` y el tamaño 1600×1000.

---

## 4) Branding e identidad del sitio

| ID                  | Dimensiones (px) | Formato     | Notas                                                                  |
|---------------------|------------------|-------------|------------------------------------------------------------------------|
| `logo-square`       | **512 × 512**    | SVG / PNG   | Logo de la marca para uso general. Hoy se renderiza inline desde `cdj-logo.ts`; este archivo es para reemplazos futuros. |
| `logo-horizontal`   | **1024 × 256**   | SVG / PNG   | Versión horizontal (footer, encabezados de PDF, etc.). Opcional.       |
| `logo-monocromo`    | **512 × 512**    | SVG         | Versión a 1 color para impresos.                                       |

---

## 5) Favicon e iconos del navegador

| Archivo                  | Dimensiones (px)                  | Formato | Ruta destino                   |
|--------------------------|-----------------------------------|---------|--------------------------------|
| `favicon.ico`            | **48 × 48** (multi-res 16/32/48)  | ICO     | `/public/favicon.ico` (ya existe) |
| `favicon-16.png`         | **16 × 16**                       | PNG     | `/public/favicon-16.png`       |
| `favicon-32.png`         | **32 × 32**                       | PNG     | `/public/favicon-32.png`       |
| `apple-touch-icon.png`   | **180 × 180**                     | PNG     | `/public/apple-touch-icon.png` |
| `android-chrome-192.png` | **192 × 192**                     | PNG     | `/public/android-chrome-192.png` |
| `android-chrome-512.png` | **512 × 512**                     | PNG     | `/public/android-chrome-512.png` |
| `safari-pinned-tab.svg`  | vector                            | SVG     | `/public/safari-pinned-tab.svg` (1 color, fondo transparente) |

> `mask-icon` color sugerido: `#0EA5A4` (teal del sitio).

---

## 6) Open Graph / compartir en redes

| ID         | Dimensiones (px) | Aspect  | Notas                                                                       |
|------------|------------------|---------|-----------------------------------------------------------------------------|
| `og-share` | **1200 × 630**   | 1.91:1  | Imagen para Facebook, LinkedIn, X y WhatsApp. Texto legible en miniatura.   |
| `og-square`| **1080 × 1080**  | 1:1     | Opcional, para Instagram / WhatsApp Status.                                 |

---

## Reglas para los diseñadores

1. **Espacio seguro**: deja **12 % de margen** en todos los lados sin elementos críticos. Los heros suelen recibir gradientes encima.
2. **Texto en imagen**: **no**. Todo el texto se sobreimpone desde el código (para internacionalización futura y accesibilidad).
3. **Paleta del sitio** (por si necesitas tonificar):
   - Teal `#0F766E` / `#0EA5A4`
   - Violet `#8B80C1`
   - Pink `#F2746B`
   - Slate `#0F172A`
4. **Personas**: contacto visual, sonrisa natural, sin estereotipos. Diversidad real (edad, género, fenotipo). Niñez con autorización.
5. **Tecnología**: dispositivos modernos pero **sin marcas** visibles.
6. **Atmosféricas (cta-banner / heros)**: van con overlay duotone (30–40 % opacidad), así que mejor fotos con buena composición y zonas oscuras donde caerá el texto.

---

## Cómo cambiar imágenes desde la UI (sin tocar código)

1. En el header presiona el botón **"Editar"** (ícono lápiz).
2. Cada imagen mostrará un botón **"Modificar"**.
3. Click → seleccionar archivo desde tu máquina.
4. La imagen queda guardada en tu navegador (`localStorage`). Útil para previsualizar versiones.
5. **"Restablecer"** vuelve a la imagen original.
6. **"Restablecer todas"** (icono ⟳ en header) limpia todos los overrides.

> Cuando el back esté listo, este mismo botón subirá el archivo al servidor.

---

## Resumen ejecutivo (cheatsheet)

```
HERO INICIO        →  1600 × 1200  (4:3)     × 1
CATEGORÍAS HOME    →   800 ×  960  (5:6)     × 4   (kids, teens, familias, docentes)
HERO AUDIENCIA     →  1600 × 1000  (16:10)   × 4   (kids, teens, familias, docentes)
SUB-NIVELES        →   900 ×  720  (5:4)     × 14  (3 + 2 + 4 + 5)
SERIES (cover)     →  1600 × 1000  (16:10)   × 3   (edutips, casi, familias)
FEATURE CARDS      →   400 ×  400  (1:1)     × 3   (edutips, casi, ayuda)
CTA BANNER         →  1920 ×  900  (64:30)   × 1
LOGO               →   512 ×  512  (SVG)     × 1
FAVICONS           →   16/32/48/180/192/512  set completo
OG SHARE           →  1200 ×  630  (1.91:1)  × 1
```

**Total mínimo de imágenes únicas**: 31 fotografías + 3 feature thumbs + set de favicon + logo + OG.
