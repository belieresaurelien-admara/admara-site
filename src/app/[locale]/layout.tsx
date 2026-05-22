import type {Metadata} from 'next';
import {Tenor_Sans, Cormorant_Garamond} from 'next/font/google';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import '../globals.css';

const tenorSans = Tenor_Sans({
  variable: '--font-tenor-sans',
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Admara Studio',
  description:
    "Production photo & vidéo soft premium nomade SEA — du contenu premium, de vrais lieux, des photographes curatés."
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({
  children,
  params
}: LayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${tenorSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink font-sans flex flex-col">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <PageTransition />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
