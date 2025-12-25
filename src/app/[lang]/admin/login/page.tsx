'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pale-sky dark:bg-gunmetal">
        <div className="text-gunmetal dark:text-pale-sky">Verificando sesión...</div>
      </div>
    );
  }

  // Si ya está autenticado, no mostrar el formulario (será redirigido)
  if (user) {
    return null;
  }

  return <LoginForm />;
}

