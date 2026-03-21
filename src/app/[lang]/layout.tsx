import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleToggle from "@/components/LocaleToggle";
import NavigationSidebar from "@/components/NavigationSidebar";

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
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider lang={locale}>
          <div className="min-h-screen bg-pale-sky dark:bg-gunmetal transition-colors duration-200">
            <NavigationSidebar />
            <ThemeToggle />
            <LocaleToggle />
            <main className="transition-colors duration-200">
              {children}
            </main>
          </div>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

