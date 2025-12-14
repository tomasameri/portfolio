import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Tomas Ameri | Portfolio & Blog",
  description: "Personal portfolio and blog of Tomas Ameri - Exploring AI, Tech & Design",
  keywords: ["portfolio", "blog", "web development", "AI", "tech", "design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-lemon-chiffon text-dusty-olive">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
