import type {Metadata} from 'next';
import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import AgentB from '@/components/ai/AgentB';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Service.meta'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function ServicePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Service');

  const audiences = ['professional', 'creative', 'personal'] as const;
  const steps = [
    'discovery',
    'mission_order',
    'submission',
    'coordination',
    'delivery'
  ] as const;
  const pillars = ['qualite', 'temps', 'suivi', 'securite'] as const;

  return (
    <>
      {/* Photo header — desktop full overlay, mobile compact */}
      <div className="relative w-full h-[280px] md:h-[520px] overflow-hidden">
        <Image
          src="/images/header-le-service.jpg"
          alt="Le Service ADMARA"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-ink/40" />
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
          <Link
            href="#agent"
            className="font-sans text-caption uppercase tracking-[0.08em] border border-cream/70 text-cream px-xl py-md mt-sm hover:bg-brick hover:border-brick hover:text-cream transition-colors"
          >
            {t('hero.cta')}
          </Link>
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
        <Link
          href="#agent"
          className="inline-block font-sans text-caption uppercase tracking-[0.08em] bg-brick text-cream px-xl py-md mt-lg hover:bg-ink transition-colors"
        >
          {t('hero.cta')}
        </Link>
      </section>

      <section className="bg-sand py-xxl">
        <div className="w-full max-w-[72rem] mx-auto px-lg flex flex-col gap-xl">
          <div className="flex flex-col gap-sm max-w-[48rem]">
            <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
              {t('audiences.eyebrow')}
            </span>
            <h2 className="font-serif text-h2 text-ink leading-[1.15]">
              {t('audiences.title')}
            </h2>
            <p className="font-sans text-body-lg text-ink/75 mt-sm">
              {t('audiences.intro')}
            </p>
          </div>
          <div className="grid gap-lg md:grid-cols-3">
            {audiences.map((key) => (
              <article
                key={key}
                className="card-hover bg-cream border border-olive/10 p-lg flex flex-col gap-sm"
              >
                <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
                  {t(`audiences.${key}.label`)}
                </span>
                <h3 className="font-serif text-h3 text-ink mt-xs">
                  {t(`audiences.${key}.title`)}
                </h3>
                <p className="font-sans text-body text-ink/75">
                  {t(`audiences.${key}.body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-xxl">
        <div className="w-full max-w-[72rem] mx-auto px-lg flex flex-col gap-xl">
          <div className="flex flex-col gap-sm max-w-[48rem]">
            <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
              {t('howItWorks.eyebrow')}
            </span>
            <h2 className="font-serif text-h2 text-ink leading-[1.15]">
              {t('howItWorks.title')}
            </h2>
            <p className="font-sans text-body-lg text-ink/75 mt-sm">
              {t('howItWorks.intro')}
            </p>
          </div>
          <ol className="grid gap-md md:grid-cols-5 border-t border-olive/10 pt-lg">
            {steps.map((key, i) => (
              <li
                key={key}
                className="card-hover flex flex-col gap-sm p-md bg-cream/40 border border-olive/10"
              >
                <span className="font-serif text-h3 text-brick leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans text-caption uppercase tracking-[0.05em] text-ink mt-sm">
                  {t(`howItWorks.steps.${key}.title`)}
                </h3>
                <p className="font-sans text-body text-ink/75">
                  {t(`howItWorks.steps.${key}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand py-xxl">
        <div className="w-full max-w-[72rem] mx-auto px-lg flex flex-col gap-xl">
          <div className="flex flex-col gap-sm max-w-[48rem]">
            <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
              {t('whyUs.eyebrow')}
            </span>
            <h2 className="font-serif text-h2 text-ink leading-[1.15]">
              {t('whyUs.title')}
            </h2>
          </div>
          <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((key) => (
              <article
                key={key}
                className="card-hover bg-cream border border-olive/10 border-l-2 border-l-brick p-lg flex flex-col gap-sm"
              >
                <h3 className="font-serif text-h3 text-ink">
                  {t(`whyUs.pillars.${key}.title`)}
                </h3>
                <p className="font-sans text-body text-ink/75">
                  {t(`whyUs.pillars.${key}.body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-xxl">
        <div className="w-full max-w-[56rem] mx-auto px-lg flex flex-col gap-lg">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
            {t('continuity.eyebrow')}
          </span>
          <h2 className="font-serif text-h2 text-ink leading-[1.15] max-w-[44rem]">
            {t('continuity.title')}
          </h2>
          <div className="divider-brick mt-md mb-sm" />
          <div className="flex flex-col gap-md font-sans text-body-lg text-ink/80 max-w-[44rem]">
            <p>{t('continuity.p1')}</p>
            <p>{t('continuity.p2')}</p>
          </div>
        </div>
      </section>

      <section id="agent" className="bg-ink py-xxxl">
        <div className="w-full max-w-[56rem] mx-auto px-lg flex flex-col items-center text-center gap-xl">
          <div className="flex flex-col items-center gap-sm">
            <span className="font-sans text-caption uppercase tracking-[0.05em] text-brick">
              {t('cta.eyebrow')}
            </span>
            <h2 className="font-serif text-h2 text-cream leading-[1.15] max-w-[40rem]">
              {t('cta.title')}
            </h2>
            <p className="font-sans text-body-lg text-cream/75 max-w-[32rem] mt-sm">
              {t('cta.sub')}
            </p>
          </div>
          <AgentB />
          <p className="font-sans text-caption text-cream/50 max-w-[32rem]">
            {t('cta.reassurance')}
          </p>
        </div>
      </section>
    </>
  );
}
