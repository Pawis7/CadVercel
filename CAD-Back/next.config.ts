import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Desactivamos los headers de CORS aquí porque ahora los maneja el middleware.ts
  // de forma más dinámica y segura (soportando credentials para cookies).
};

export default nextConfig;
