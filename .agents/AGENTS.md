# Directrices de Diseño y Colores Oficiales

Este documento establece las directrices estéticas y los colores institucionales que deben respetarse en todo el desarrollo del frontend de **Cursos Alfa Digital**.

## Paleta de Colores Oficiales

*   **Fondo Modo Oscuro:** `#0D1321` (Gris/Azul marino profundo en lugar de negro puro o gris opaco).
*   **Naranja Institucional:** `#FF8300`.
*   **Rojo Institucional:** `#C90045`.

## Configuración y Variables de Tailwind CSS v4

Estas variables están configuradas en [styles.css](file:///Users/yves/Documents/Sep/CursosAlfaDigital/CAD-Front/src/styles.css) dentro del bloque `@theme`. Cualquier clase de Tailwind que use estos identificadores se resolverá automáticamente con los colores institucionales:

*   `neutral-950` se resuelve como `#0D1321` (Fondo principal en modo oscuro).
*   `neutral-900` se resuelve como `#1b2336` (Superficies, tarjetas y paneles en modo oscuro).
*   `neutral-800` se resuelve como `#222c42` (Bordes en modo oscuro).
*   `orange-500` se resuelve como `#FF8300` (Naranja principal).
*   `red-600` se resuelve como `#C90045` (Rojo principal).

## Reglas de Diseño Estricto

1.  **Evitar Neones y Efectos Difuminados:** No utilizar efectos de neón (`blur-3xl`), ni resplandores de colores en sombras (`shadow-orange-500/20`). Usar sombras grises estándar, finas y limpias.
2.  **Transiciones e Interacciones:** Todas las interacciones táctiles y de desplazamiento de menús deben contar con transiciones suaves (`transition-all duration-200 ease-out`).
3.  **Tipografía:** Utilizar `Montserrat` (definida como la fuente predeterminada del sistema `font-sans`).
4.  **Consistencia de Archivos:** Preservar la integridad de los comentarios y documentar todas las adiciones de componentes.
