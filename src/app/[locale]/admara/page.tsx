import type {Metadata} from 'next';
import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Admara.meta'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function AdmaraPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Admara');

  const founders = ['aurelien', 'alyssia'] as const;
  const pillars = ['selection', 'order', 'moodboard', 'coordination'] as const;

  return (
    <>
      {/* ⚠️ Fichier attendu : public/images/header-admara.jpg */}
      <div className="relative w-full h-[280px] md:h-[520px] overflow-hidden">
        <Image
          src="/images/header-admara.jpg"
          alt="ADMARA Studio"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center text-center px-lg gap-md">
          <span className="font-sans text-caption uppercase tracking-[0.1em] text-cream/70">
            {t('hero.eyebrow')}
          </span>
          <h1 className="font-serif text-h1 text-cream leading-[1.1] max-w-[52rem] drop-shadow-sm">
            {t('hero.title')}
          </h1>
          <p className="font-sans text-body-lg text-cream/85 max-w-[36rem]">
            {t('hero.sub')}
          </p>
        </div>
      </div>

      <section className="md:hidden bg-cream pt-xl pb-lg px-lg text-center">
        <span className="font-sans text-caption uppercase tracking-[0.1em] text-brick">
          {t('hero.eyebrow')}
        </span>
        <h1 className="font-serif text-h1 text-ink leading-[1.1] mt-sm">
          {t('hero.title')}
        </h1>
        <p className="font-sans text-body-lg text-ink/75 mt-md max-w-[32rem] mx-auto">
          {t('hero.sub')}
        </p>
      </section>

      <section className="bg-sand py-xxl">
        <div className="w-full max-w-[56rem] mx-auto px-lg flex flex-col gap-lg">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
            {t('why.eyebrow')}
          </span>
          <h2 className="font-serif text-h2 text-ink leading-[1.15] max-w-[40rem]">
            {t('why.title')}
          </h2>
          <div className="divider-brick mt-md mb-sm" />
          <div className="flex flex-col gap-md font-sans text-body-lg text-ink/80 max-w-[44rem]">
            <p>{t('why.p1')}</p>
            <p>{t('why.p2')}</p>
            <p>{t('why.p3')}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-xxl">
        <div className="w-full max-w-[72rem] mx-auto px-lg flex flex-col gap-xl">
          <div className="flex flex-col gap-sm">
            <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
              {t('team.eyebrow')}
            </span>
            <h2 className="font-serif text-h2 text-ink leading-[1.15] max-w-[40rem]">
              {t('team.title')}
            </h2>
            <div className="divider-brick mt-md mb-sm" />
          </div>
          <div className="grid gap-lg md:grid-cols-2">
            {founders.map((key) => (
              <article
                key={key}
                className="card-hover bg-sand/60 border border-olive/10 p-xl flex flex-col gap-md"
              >
                <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
                  {t(`team.founders.${key}.role`)}
                </span>
                <h3 className="font-serif text-h3 text-ink">
                  {t(`team.founders.${key}.name`)}
                </h3>
                <p className="font-sans text-body text-ink/75">
                  {t(`team.founders.${key}.bio`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-xxl">
        <div className="w-full max-w-[72rem] mx-auto px-lg flex flex-col gap-xl">
          <div className="flex flex-col gap-sm max-w-[48rem]">
            <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
              {t('method.eyebrow')}
            </span>
            <h2 className="font-serif text-h2 text-ink leading-[1.15]">
              {t('method.title')}
            </h2>
            <div className="divider-brick mt-md mb-sm" />
            <p className="font-sans text-body-lg text-ink/75 mt-sm">
              {t('method.intro')}
            </p>
          </div>
          <ol className="grid gap-lg md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((key, i) => (
              <li
                key={key}
                className="card-hover bg-cream border border-olive/10 p-lg flex flex-col gap-sm"
              >
                <span className="font-serif text-h3 text-brick leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-h3 text-ink mt-sm">
                  {t(`method.pillars.${key}.title`)}
                </h3>
                <p className="font-sans text-body text-ink/75">
                  {t(`method.pillars.${key}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink py-xxl">
        <div className="w-full max-w-[48rem] mx-auto px-lg flex flex-col items-center text-center gap-lg">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
            {t('cta.eyebrow')}
          </span>
          <h2 className="font-serif text-h2 text-cream leading-[1.15] max-w-[36rem]">
            {t('cta.title')}
          </h2>
          <p className="font-sans text-body-lg text-cream/75 max-w-[32rem]">
            {t('cta.sub')}
          </p>
          <Link
            href="/service"
            className="font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors mt-md"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </>
  );
}
