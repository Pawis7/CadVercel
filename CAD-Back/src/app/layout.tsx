// Layout raíz mínimo. El backend vive en /api/* — el navegador casi no toca
// otras rutas, pero Next.js requiere un layout para que el app router compile.

export const metadata = {
  title: 'CDJ-Back · API Ciudadanía Digital Jalisco',
  description: 'Backend del portal Ciudadanía Digital — Next.js + Prisma + PostgreSQL.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>{children}</body>
    </html>
  );
}
