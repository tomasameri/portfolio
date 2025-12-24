import { LocaleProvider } from "@/context/LocaleContext";
import ThemeToggle from "@/components/ThemeToggle";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang && ['en', 'es'].includes(lang) ? lang : 'en';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LocaleProvider lang={locale}>
        <ThemeToggle />
        <main>
          {children}
        </main>
      </LocaleProvider>
    </div>
  );
}

