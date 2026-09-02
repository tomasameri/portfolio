import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { SITE_NAME } from '@/lib/siteConfig';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Tomas Ameri — Digital Product Builder';
    const tag = searchParams.get('tag') || 'AI & Engineering';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px',
            backgroundColor: '#0e131f',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(14, 165, 233, 0.15) 20%, transparent 70%)',
            color: '#ffffff',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 20px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                color: '#38bdf8',
                fontSize: '20px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {tag}
            </div>

            <div
              style={{
                fontSize: '22px',
                color: '#94a3b8',
                fontWeight: 600,
              }}
            >
              tomasameri.com
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#f8fafc',
              maxWidth: '1000px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {/* Author Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              paddingTop: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#0e131f',
                }}
              >
                TA
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#f8fafc' }}>
                  {SITE_NAME}
                </div>
                <div style={{ fontSize: '18px', color: '#94a3b8' }}>
                  Digital Product Builder · @toto_visiora
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: '20px',
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              tomasameri.com →
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
