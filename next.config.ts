// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Configuración para Appwrite Sites
  output: 'standalone',
  // `hostname: '**'` dejaba a `/_next/image` como optimizador abierto: cualquiera
  // podía pedir `tomasameri.com/_next/image?url=<imagen ajena>` y gastar CPU y
  // ancho de banda del servidor sirviendo contenido de terceros desde el dominio
  // propio. Se acota a los hosts que el sitio realmente usa.
  //
  // Para permitir un host nuevo (por ejemplo si pegás la URL de otro CDN en el
  // formulario del admin), agregá una entrada más acá.
  images: {
    remotePatterns: [
      // Portadas del blog: el propio formulario del admin sugiere Unsplash.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Appwrite Storage, por si las imágenes pasan a subirse en vez de pegarse.
      { protocol: 'https', hostname: 'nyc.cloud.appwrite.io', pathname: '/v1/storage/**' },
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