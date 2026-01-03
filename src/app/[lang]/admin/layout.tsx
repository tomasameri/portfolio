'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Verificar si estamos en la ruta de login (puede ser /es/admin/login, /en/admin/login, etc.)
  const isLoginPage = pathname?.includes('/admin/login');

  // No proteger la ruta de login
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Proteger todas las demás rutas de admin
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

