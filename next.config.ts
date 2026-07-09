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
  // por defecto. 307 (temporal) por si más adelante se agrega detección de idioma.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;