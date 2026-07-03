/**
 * Renderiza uno o varios objetos JSON-LD como <script type="application/ld+json">.
 * Es un Server Component (sin 'use client'): el markup llega en el HTML inicial,
 * que es justo lo que leen Google y los motores generativos.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // El contenido es data controlada por nosotros; escapamos `<` por seguridad.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
