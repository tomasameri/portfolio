'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CardManager from '@/components/admin/CardManager';

export default function AdminCardsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-pale-sky dark:bg-gunmetal py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-cool-sky hover:text-cool-sky/80 transition-colors mb-4 inline-block"
          >
            ← Volver al Dashboard
          </Link>
        </div>
        <CardManager />
      </div>
    </div>
  );
}

