# Guía de Diseño Responsivo para Jalisco Aprende (1080p, 2K y Laptops)

Este documento describe la estrategia de diseño y escalabilidad responsiva implementada en el frontend de **Jalisco Aprende** para garantizar una visualización perfecta en cualquier tipo de monitor (laptops compactas, pantallas 1080p estándar y monitores 2K).

---

## 1. Estrategia de Escalado Proporcional (HTML Rem-Scaling)

La mayoría de las clases de Tailwind CSS (como `text-sm`, `p-4`, `w-12`, `h-20`, etc.) se calculan en base a la unidad de medida relativa `rem` (donde por defecto `1rem = 16px`).

Para que la interfaz no se vea minúscula en pantallas grandes ni gigantesca en laptops de 13 pulgadas, modificamos de forma selectiva el tamaño de la fuente raíz del documento (`html`) en [styles.css](file:///Users/yves/Documents/Sep/CursosAlfaDigital/CAD-Front/src/styles.css) utilizando consultas de medios (`@media` queries):

| Tipo de Pantalla | Ancho de Ventana Lógico | Tamaño de Fuente Raíz (`html`) | Incremento en Escala |
| :--- | :--- | :--- | :--- |
| **Laptops (MacBook Air 13", etc.)** | `< 1880px` | `16px` (original) | 0% (Estándar) |
| **Monitores 1080p (Maximizado)** | `>= 1880px` y `< 2500px` | `17.5px` | **+9.4%** |
| **Monitores 2K (Maximizado)** | `>= 2500px` | `21.5px` | **+34.4%** |

> [!NOTE]
> Los breakpoints se establecieron en `1880px` (para 1080p) y `2500px` (para 2K) para descontar el ancho de las barras de scroll y bordes de las ventanas de los navegadores maximizados (que miden aproximadamente 15-20px).

---

## 2. Clases CSS Personalizadas de Rejilla y Contenedor

Para evitar problemas de compilación y caché en Angular con el scanning de Tailwind v4, se crearon dos clases CSS nativas directas en `styles.css`:

### A. `.container-autenticado`
Se utiliza para los contenedores globales de contenido (barra de navegación, contenedor principal y pie de página) en [authenticated.html](file:///Users/yves/Documents/Sep/CursosAlfaDigital/CAD-Front/src/app/layouts/authenticated/authenticated.html):
*   **En Laptops:** Capped en `max-w-7xl` (1280px) o `2xl:max-w-[1600px]`, centrado.
*   **En 1080p:** Se expande automáticamente hasta **`2000px`**.
*   **En 2K:** Se expande automáticamente hasta **`2500px`**.

### B. `.grid-cursos`
Se utiliza en el listado de tarjetas de cursos y en la rejilla de carga (esqueleto) de [cursos.html](file:///Users/yves/Documents/Sep/CursosAlfaDigital/CAD-Front/src/app/pages/cursos/cursos.html) para ajustar dinámicamente las columnas y el tamaño de las tarjetas:
*   **En Laptops:** Se muestran **4 columnas** con un ancho de tarjeta de aprox. `330px`.
*   **En 1080p:** Se muestran **5 columnas** con un ancho de tarjeta de aprox. `355px`.
*   **En 2K:** Se muestran **5 columnas** con un ancho de tarjeta muy amplio de aprox. `480px` (haciendo las tarjetas más anchas y legibles en pantallas gigantes).

---

## 3. Directrices para Nuevos Componentes

Si vas a crear nuevos elementos o modificar los existentes, sigue estas reglas para mantener la compatibilidad responsiva:

1.  **Evitar Píxeles Fijos:** En lugar de usar clases con píxeles arbitrarios en fuentes o tamaños (ej. `text-[16px]`, `w-[320px]`), prefiere el sistema basado en `rem` (ej. `text-base`, `w-80` o en su defecto `text-[1rem]`, `w-[20rem]`).
2.  **Imágenes y Logotipos:** Si es estrictamente necesario definir un ancho/alto en píxeles para imágenes (como logotipos), decláralo en `rem` (ej. `h-[3.25rem]` que equivale a 52px). Esto asegurará que la imagen se agrande automáticamente en 1080p y 2K.
3.  **Uso de Contenedores:** Coloca siempre los componentes de página principales dentro de un contenedor que lleve la clase `.container-autenticado` para mantener la simetría con la barra de navegación y el pie de página global.
