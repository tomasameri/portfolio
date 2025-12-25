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
};

export default nextConfig;