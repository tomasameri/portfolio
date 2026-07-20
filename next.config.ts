// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Configuración para Appwrite Sites
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost',
        '*.appwrite.network',
        '*.appwrite.io',
        'cloud.appwrite.io',
      ],
    },
  },
  // La raíz `/` no tiene página (todo vive bajo `/[lang]`). Sin este redirect
  // devolvía 404, dejando la home del dominio sin indexar. Redirige al locale
  // por defecto (es) con 308 (permanente) para que Google consolide `/` en `/es`
  // y deje de tratar `/es` como duplicado de la home. Si en el futuro se agrega
  // detección de idioma, se hace detectando y renderizando el locale — NO
  // redirigiendo, porque un redirect permanente por-usuario rompería el caché.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/es',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;