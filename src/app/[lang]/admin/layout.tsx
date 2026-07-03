import type { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';

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
  return <AdminGuard>{children}</AdminGuard>;
}
