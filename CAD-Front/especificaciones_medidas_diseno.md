# 🎨 Guía de Especificaciones Técnicas y Medidas de Diseño
### *Plataforma Interactiva de Ciudadanía Digital SEP Jalisco*

Esta guía técnica compila las **dimensiones exactas, relaciones de aspecto (aspect ratios), radios de borde, tipografías y zonas seguras** para todos los elementos visuales de la plataforma. Ha sido diseñada con el objetivo de ser compartida directamente con el equipo de **Diseño Gráfico, Ilustración y UX/UI** para asegurar que los recursos exportados encajen perfectamente en los layouts CSS sin deformaciones ni cortes accidentales.

---

## 📂 Resumen Rápido para Exportación de Assets

| Elemento | Relación de Aspecto | Tamaño de Lienzo Recomendado (Px) | Formato Recomendado | Observaciones / Safe Zones |
| :--- | :---: | :---: | :---: | :--- |
| **1. Imagen Banner Principal** | `16:10` | **1600 × 1000 px** *(Medida Obligatoria)* | `.webp` o `.png` | Esquinas redondeadas automáticas (`32px`). Evitar logos en los bordes. |
| **2. Miniaturas de Niveles** | `5:3` | **1000 × 600 px** *(Min: 500×300)* | `.webp` o `.jpg` | El tercio superior izquierdo queda tapado parcialmente por el badge flotante. |
| **3. Iconos Vectoriales** | `1:1` | **128 × 128 px** | SVG Vectorial | Centrados en caja transparente, color sólido. |
| **4. Avatares del Chat** | `1:1` | **256 × 256 px** | `.png` Transparente | Círculo perfecto. Máximo contraste con fondo de color sólido. |

---

## 🍊 Sección 1: Banners Principales (Ej. Banner "Familias")

El banner principal utiliza un contenedor fluido y responsivo en dos columnas que reordena los elementos en pantallas móviles (apilado vertical).

```
+-----------------------------------------------------------------------+
|  Inicio > Familias                                                    |
|                                       +----------------------------+  |
|  [PARA ACOMPAÑAR EN CASA]             |                            |  |
|                                       |                            |  |
|  Familias                             |        IMAGEN HERO         |  |
|                                       |         (16:10)            |  |
|  Conversaciones que sí ayudan         |      1600 x 1000 px        |  |
|                                       |                            |  |
|  Guías por edad, acuerdos familiares  |                            |  |
|                                       +----------------------------+  |
|  (Edad)  (Niveles)  (Temas)                                           |
+-----------------------------------------------------------------------+
```

### 📏 Especificaciones Técnicas del Banner:
*   **Contenedor Completo (`.rounded-[2rem]`):**
    *   **Radio de Curvatura (Border Radius):** `32px` (`2rem`).
    *   **Relleno Interno (Padding):** `32px` en Desktop (`p-8`), `24px` en Móvil (`p-6`).
*   **Imagen Hero (Lado Derecho):**
    *   **Relación de Aspecto:** Exacta `16:10`.
    *   **Dimensiones de Exportación:** **1600 px de ancho × 1000 px de alto** (medida obligatoria y unificada para todas las secciones).
    *   **Bordes de la Imagen:** Redondeados a `24px` (`rounded-[1.5rem]`).
    *   **Composición de la Imagen:** El contenido importante (personas, rostros) debe estar centralizado. Los bordes se recortarán ligeramente de forma responsiva.
*   **Cromática y Contraste:**
    *   Los colores de fondo son sólidos o degradados de alta saturación (Naranja Familias: `#E95C17`, Violeta Jóvenes: `#6D28D9`).
    *   El texto siempre es blanco (`#FFFFFF`) y el texto secundario es blanco al 90% (`rgba(255,255,255,0.9)`).
*   **Tipografía Empleada:**
    *   **Título Principal:** Serif o Display extra gruesa (`font-black`), tamaño `3rem` (48px) en desktop.
    *   **Subtítulo:** Sans-serif amigable, `1.25rem` (20px), peso semibold.

---

## 🎒 Sección 2: Cards de Nivel (Ej. "Secundaria" y "Preparatoria")

Los cards de nivel actúan como disparadores visuales para el portal de aprendizaje. Tienen una composición con una imagen destacada en la parte superior y texto informativo debajo.

```
+----------------------------------------+
| [🎨 Badge Icono]         ( ACTIVO )    |   <- Aspect Ratio Imagen: 5:3
|                                        |      Tamaño: 1000 x 600 px
|              IMAGEN 5:3                |
|                                        |
+----------------------------------------+
| 12 A 14 AÑOS                           |   <- Subtítulo de Audiencia
| Secundaria                             |   <- Título de Nivel (font-black)
| -------------------------------------- |
| [Libro] 15 recursos     Abrir portal > |
+----------------------------------------+
```

### 📏 Especificaciones Técnicas del Card de Nivel:
*   **Caja Contenedora:**
    *   **Ancho:** Auto-ajustable por Grid de 4 columnas (entre `280px` y `340px` por card).
    *   **Radio de Curvatura:** `24px` (`rounded-3xl`).
    *   **Efecto Hover:** Escala sutil del `103%` (`scale-103`) y sombra profunda.
*   **Imagen de Cabecera:**
    *   **Relación de Aspecto:** **5:3** (`aspect-[5/3]`).
    *   **Dimensiones de Exportación:** **1000 px de ancho × 600 px de alto**.
    *   **Recorte Visual:** El contenedor de la imagen tiene un `overflow: hidden`, lo que redondea las esquinas superiores a `24px` y mantiene las inferiores rectas.
*   **Badge del Icono (Flotante arriba a la izquierda):**
    *   **Caja:** Circunferencia/Cuadrado redondeado de `40px × 40px` (`h-10 w-10`).
    *   **Icono Interno:** Iconografía material redondeada (`material-symbols-rounded`) de `20px` en color sólido.
*   **Textos del Card:**
    *   **Línea de Edad:** Tamaño `10px`, peso `font-black` (900), tracking de caracteres extra espaciado (`tracking-widest`).
    *   **Título:** Tamaño `18px`, peso `font-black`.

---

## 📝 Sección 3: Cards de Cursos y Recursos (Ej. "Fundamentos de Ciudadanía Digital")

Estos cards muestran los cursos activos en formato de grilla de 3 columnas. Son compactos y leen información estructurada de la base de datos.

```
+----------------------------------------+
|  [Tag] [Tag]                   [Libro] |   <- Cabecera de Categorías
|                                        |
|  Fundamentos de                        |
|  Ciudadanía Digital                    |   <- Título (Máx 2 líneas)
|                                        |
|  Curso introductorio sobre seguridad,  |
|  privacidad y convivencia en internet  |   <- Sinopsis (Máx 3 líneas)
|                                        |
|  #seguridad #privacidad                |   <- Temáticas/Hashtags
|  ------------------------------------- |
|  8h · 4 unidades             Básico -> |   <- Metadatos
+----------------------------------------+
```

### 📏 Especificaciones Técnicas del Card de Curso:
*   **Caja Contenedora:**
    *   **Ancho:** Responsivo en grilla de 3 columnas (aprox. `360px` a `400px` de ancho).
    *   **Radio de Curvatura:** `24px` (`rounded-3xl`).
    *   **Bordes:** Borde sutil de `1px` color `#E2E8F0` (en modo claro) o gris oscuro suave en modo oscuro.
*   **Zonas de Texto y Límites de Contenido (Safe Zones para Copy):**
    *   **Título del Curso:** Máximo 2 líneas de texto (`text-lg`, `font-black`, aprox. `18px`). *Consejo: limitar títulos a un máximo de 50 caracteres.*
    *   **Descripción/Sinopsis:** Texto regular `text-xs` (12px) o `text-sm` (14px). *Consejo: limitar a un máximo de 140 caracteres para evitar que los cards crezcan desproporcionadamente.*
*   **Tags y Badges de Categoría:**
    *   Fondo de color pastel suave con texto oscuro (Verde: `bg-teal-50` / `text-teal-700`, Naranja: `bg-amber-50` / `text-amber-700`).
    *   Bordes redondeados de `8px`.
    *   Tipografía extra bold, tamaño `10px`.

---

## 📱 Sección 4: Simulador de Chat (Mockup del Dispositivo)

El simulador simula un chat de mensajería (tipo WhatsApp/SMS) sobre un chasis virtual de alta fidelidad que no menciona marcas comerciales directamente pero luce ultra-moderno.

```
                  CHASIS MÓVIL DISPOSITIVO
                +--------------------------+
                |    [ DYNAMIC ISLAND ]    |  <- Estado Dinámico (Escribiendo/Riesgo)
                | 12:45              [WiFi]|  <- Status Bar
                | +----------------------+ |
                | | [WA] Contacto        | |  <- Cabecera de Chat (48px de alto)
                | |----------------------| |
                | |                      | |
                | | (SISTEMA) Alerta     | |  <- Burbuja Sistema (Centro)
                | |                      | |
                | | [Otro] ¡Ganaste!     | |  <- Mensaje Entrante (Fondo Blanco)
                | |                      | |
                | |         [Tú] ¿Liga?  | |  <- Mensaje Saliente (Fondo Verde Claro)
                | |                      | |
                | +----------------------+ |
                | | [ + ] Escribe... [o] | |  <- Barra de entrada de texto
                | +----------------------+ |
                |         [ HOME BAR ]     |  <- Indicador inferior de arrastre
                +--------------------------+
```

### 📏 Especificaciones Técnicas del Dispositivo:
*   **Caja del Dispositivo Móvil:**
    *   **Ancho:** `320px` a `340px`.
    *   **Alto:** `580px` a `620px`.
    *   **Bisel Externo:** `4px` en color negro sólido mate.
    *   **Bordes del Teléfono:** Redondeados a `40px` para imitar curvas orgánicas de dispositivos de alta gama.
*   **Dynamic Island (Cápsula superior):**
    *   **Caja base:** `110px de ancho × 24px de alto` (se expande animadamente a `160px` de ancho cuando detecta alertas).
    *   **Fondo:** Negro piano (`#000000`).
    *   **Animación:** Transición de tamaño ultra-suave (`transition-all duration-500 ease-out`).
*   **Avatares de Chats:**
    *   **Dimensiones:** Cuadrados o círculos perfectos de `32px × 32px`.
    *   **Degradados de fondo:** Soportados mediante hojas de estilo CSS dinámicas.
*   **Burbujas de Chat:**
    *   **Mensaje de Tercero:** Fondo blanco (`#FFFFFF`), texto gris oscuro (`#1E293B`).
    *   **Mensaje Propio:** Fondo verde WhatsApp (`#E2F7CB`), texto oscuro (`#0F172A`).
    *   **Radio de Esquina:** `16px` general, con la esquina que apunta al emisor recta (`4px`).

---

## 🎨 Paleta Oficial de Colores de la Plataforma

Para la creación de ilustraciones o elementos visuales nuevos, por favor utilizar los siguientes colores hex oficiales:

*   **Primario General:** `#E95C17` (Naranja Institucional)
*   **Secundario Jóvenes:** `#6D28D9` (Violeta Profundo)
*   **Éxito / Seguro:** `#10B981` (Verde Esmeralda)
*   **Advertencia / Parcial:** `#F59E0B` (Ámbar)
*   **Peligro / Riesgo:** `#EF4444` (Rojo Coral)
*   **Fondo de Interfaz (Modo Oscuro):** `#0B0F19` (Azul Noche Profundo)
*   **Fondo de Tarjeta (Modo Oscuro):** `#151D30` (Azul Superficie)

---
*Fin del documento de especificaciones técnicas. Diseñado con ❤️ para el equipo creativo de Ciudadanía Digital.*
