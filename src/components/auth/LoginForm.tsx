'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirigir al panel admin después de login exitoso
      // Usar window.location para forzar una recarga completa
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pale-sky dark:bg-gunmetal px-4">
      <div className="max-w-md w-full bg-alice-blue dark:bg-pale-sky/10 rounded-xl shadow-lg p-8 border border-dust-grey/30 dark:border-pale-sky/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-gunmetal dark:text-alice-blue">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky focus:border-cool-sky focus:ring-cool-sky"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky focus:border-cool-sky focus:ring-cool-sky"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

