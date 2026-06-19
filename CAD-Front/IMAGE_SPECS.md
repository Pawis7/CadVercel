# Portal Público · Ciudadanía Digital Jalisco

## Especificaciones de imágenes

Dimensiones reales implementadas en el frontend. _18 de mayo de 2026_

---

## 1. Banners Hero — Dimensiones del contenedor completo

El banner cubre toda la sección. Diseño debe entregar una imagen que llene el área completa.  
Aplica a: **Inicio**, **Niñas y niños**, **Adolescentes**, **Familias**, **Docentes**, **Ayuda Digital**, **Edutips**, **Notebooks IA**, **Cursos**, **Recursos**, **Series**, **Juegos**, **Quiénes somos**.

**Dimensiones base (Entrega de diseño — Pantalla base tipo Mac M1 13"):**

| Estado del sidebar | Ancho del banner | Alto del banner (desktop ≥ 1024 px) | Aspect ratio |
| ------------------ | ---------------- | ----------------------------------- | ------------ |
| **Expandida**      | **1392 px**      | **423 px**                          | ~3.3:1       |
| **Contraída**      | **1546 px**      | **423 px**                          | ~3.65:1      |

> **Entrega base:** Entregar en la medida del sidebar **expandida** (`1392 × 423 px`) como base. El sistema escala automáticamente a `1546 × 423 px` al contraer la barra lateral.

**Adaptación a pantallas grandes (Monitores 1080p y superiores):**

| Estado del sidebar | Ancho del contenedor | Alto del banner (desktop ≥ 1024 px) |
| ------------------ | -------------------- | ----------------------------------- |
| **Expandida**      | **1604 px**          | **423 px**                          |
| **Contraída**      | **1788 px**          | **423 px**                          |

> [!NOTE]
> **Escalado automático por CSS:** Para pantallas grandes (como monitores 1080p), el contenedor se ensancha a `1604 px` / `1788 px`. **No es necesario entregar imágenes con estas dimensiones ultra-anchas**. El navegador escalará y adaptará automáticamente la imagen base de diseño (`1392 × 423 px` / `1546 × 423 px`) mediante CSS (`object-cover`) para cubrir el área del contenedor.

> **Sidebar reactivo:** La clase `body.sidebar-collapsed` se inyecta/remueve automáticamente con transición `300ms`. En móvil y tablet (< 1024 px) el alto es fluido — sin restricción fija.

---

## 2. Sub-niveles por Audiencia

Cards de nivel dentro de cada página de audiencia (sección "Encuentra tu nivel").

| Elemento                         | Aspect ratio | Imagen recomendada | `object-fit`   |
| -------------------------------- | ------------ | ------------------ | -------------- |
| **Portada de sub-nivel** (todos) | **5:3**      | **900 × 540 px**   | `object-cover` |

> Grid: 1 col (móvil) → 2 col (MD) → 3 col (LG) → 4 col (XL).

---

## 3. Portadas de Series

| Elemento             | Aspect ratio | Dimensiones mínimas  | `object-fit`   |
| -------------------- | ------------ | -------------------- | -------------- |
| **Portada de serie** | **16:10**    | **1600 × 1000 px**   | `object-cover` |

> Componente `<app-editable-image>` — dimensiones declaradas en código como `width="1600" height="1000"`.

---

## 4. Logo y Favicon

| Imagen           | Dimensiones              | Formato   |
| ---------------- | ------------------------ | --------- |
| Logo cuadrado    | 512 × 512 px             | SVG / PNG |
| Logo horizontal  | 1024 × 256 px            | SVG / PNG |
| Favicon          | 48 × 48 px               | ICO       |
| Favicon PNG      | 16 × 16 / 32 × 32 px     | PNG       |
| Apple touch icon | 180 × 180 px             | PNG       |
| Android Chrome   | 192 × 192 / 512 × 512 px | PNG       |

---

## 5. Open Graph (Redes Sociales)

| Imagen                                     | Dimensiones    | Aspect ratio |
| ------------------------------------------ | -------------- | ------------ |
| OG share (Facebook, LinkedIn, X, WhatsApp) | 1200 × 630 px  | 1.91:1       |
| OG cuadrado (Instagram)                    | 1080 × 1080 px | 1:1          |

---

> **Formato:** AVIF o WebP para fotografías (≤ 250 KB). SVG para logos e ilustraciones.  
> Sin texto incrustado — el texto lo sobreimpone el código.

---

_Ciudadanía Digital Jalisco · 18 de mayo de 2026_
