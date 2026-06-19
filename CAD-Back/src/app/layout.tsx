// Layout raíz mínimo. El backend vive en /api/* — el navegador casi no toca
// otras rutas, pero Next.js requiere un layout para que el app router compile.

export const metadata = {
  title: 'CAD-Back · API Cursos Alfa Digital',
  description: 'Backend del portal Cursos Alfa Digital — Next.js + Prisma + PostgreSQL.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>{children}</body>
    </html>
  );
}
