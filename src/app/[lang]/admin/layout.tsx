import type { Metadata } from 'next';
import { Anonymous_Pro } from 'next/font/google';
import AdminGuard from '@/components/admin/AdminGuard';
import { AuthProvider } from '@/context/AuthContext';
import './admin.css';

// Fuente legacy del editor markdown. Vive acá y no en el layout raíz para que
// las páginas públicas no descarguen una familia que no usan.
const anonymousPro = Anonymous_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anonymous-pro',
});

// El panel de administración nunca debe indexarse.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // AuthProvider solo acá: montarlo en el layout raíz hacía un `account.get()`
    // en cada página pública (401 en consola + el SDK de Appwrite en el bundle).
    <AuthProvider>
      <div className={anonymousPro.variable}>
        <AdminGuard>{children}</AdminGuard>
      </div>
    </AuthProvider>
  );
}
