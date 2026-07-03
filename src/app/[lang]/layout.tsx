import type { Metadata } from "next";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import NavigationSidebar from "@/components/NavigationSidebar";
import SettingsDock from "@/components/SettingsDock";
import HtmlLang from "@/components/HtmlLang";
import { SITE_URL, LOCALES } from "@/lib/siteConfig";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = LOCALES.includes(lang as (typeof LOCALES)[number]) ? lang : 'en';

  return {
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
    openGraph: {
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
  };
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
          <HtmlLang lang={locale} />
          {/* Replaced hardcoded pale-sky/gunmetal with tonal surface */}
          <div className="min-h-screen bg-surface transition-colors duration-200">
            <NavigationSidebar />
            <SettingsDock />
            <main className="transition-colors duration-200">
              {children}
            </main>
          </div>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

