import {getTranslations, setRequestLocale} from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PaletteShowcase from '@/components/PaletteShowcase';

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');

  return (
    <main className="flex flex-col min-h-screen bg-cream">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-lg py-lg">
        <span className="font-serif text-h3 text-olive">Admara</span>
        <LanguageSwitcher />
      </header>

      <section className="flex flex-1 items-center justify-center px-lg py-xxxl">
        <div className="max-w-3xl flex flex-col items-center gap-lg text-center">
          <h1 className="font-serif text-h1 text-olive leading-[1.1]">
            {t('tagline')}
          </h1>
          <p className="font-sans text-body-lg text-ink/80 max-w-xl">
            {t('sub')}
          </p>
        </div>
      </section>

      <PaletteShowcase />
    </main>
  );
}
