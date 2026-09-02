import type { Metadata } from "next";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import NavigationSidebar from "@/components/NavigationSidebar";
import SettingsDock from "@/components/SettingsDock";
import Footer from "@/components/Footer";
import HtmlLang from "@/components/HtmlLang";
import JsonLd from "@/components/JsonLd";
import { personSchema, webSiteSchema } from "@/lib/schema";
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from "@/lib/siteConfig";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = LOCALES.includes(lang as (typeof LOCALES)[number]) ? lang : DEFAULT_LOCALE;

  return {
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`])),
        'x-default': `${SITE_URL}/${DEFAULT_LOCALE}`,
      },
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
  const locale = lang && LOCALES.includes(lang as (typeof LOCALES)[number]) ? lang : DEFAULT_LOCALE;

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider lang={locale}>
          <HtmlLang lang={locale} />
          <JsonLd data={[personSchema(), webSiteSchema()]} />
          {/* Replaced hardcoded pale-sky/gunmetal with tonal surface */}
          <div className="min-h-screen bg-surface transition-colors duration-200">
            <NavigationSidebar />
            <SettingsDock />
            <main className="transition-colors duration-200">
              {children}
            </main>
            <Footer />
          </div>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

