'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pale-sky dark:bg-gunmetal py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gunmetal dark:text-alice-blue">
            Panel de Administración
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gunmetal/70 dark:text-pale-sky/80">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gunmetal dark:bg-pale-sky/20 text-pale-sky dark:text-pale-sky rounded-md hover:bg-gunmetal/90 dark:hover:bg-pale-sky/30 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/cards"
            className="p-6 bg-alice-blue dark:bg-pale-sky/10 rounded-xl border border-dust-grey/30 dark:border-pale-sky/20 hover:border-cool-sky/40 dark:hover:border-cool-sky/30 transition-all hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gunmetal dark:text-alice-blue mb-2">
              Gestionar Cards
            </h2>
            <p className="text-gunmetal/70 dark:text-pale-sky/80">
              Administra las cards de redes sociales, ajusta tamaños, URLs y orden.
            </p>
          </Link>

          <Link
            href="/admin/blog"
            className="p-6 bg-alice-blue dark:bg-pale-sky/10 rounded-xl border border-dust-grey/30 dark:border-pale-sky/20 hover:border-cool-sky/40 dark:hover:border-cool-sky/30 transition-all hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gunmetal dark:text-alice-blue mb-2">
              Gestionar Blog
            </h2>
            <p className="text-gunmetal/70 dark:text-pale-sky/80">
              Crea, edita y publica entradas de blog.
            </p>
          </Link>

          <Link
            href="/admin/projects"
            className="p-6 bg-alice-blue dark:bg-pale-sky/10 rounded-xl border border-dust-grey/30 dark:border-pale-sky/20 hover:border-cool-sky/40 dark:hover:border-cool-sky/30 transition-all hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gunmetal dark:text-alice-blue mb-2">
              Gestionar Proyectos
            </h2>
            <p className="text-gunmetal/70 dark:text-pale-sky/80">
              Administra tus proyectos, agrega descripciones, tecnologías y enlaces.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

