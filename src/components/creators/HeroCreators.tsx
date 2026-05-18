import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function HeroCreators() {
  const t = await getTranslations('Creators.hero');

  return (
    <section className="bg-cream pt-xxxl pb-xxl">
      <div className="w-full max-w-[64rem] mx-auto px-lg flex flex-col items-center text-center gap-lg">
        <span className="font-sans text-caption uppercase tracking-[0.05em] text-olive">
          {t('eyebrow')}
        </span>
        <h1 className="font-serif text-h1 text-ink leading-[1.1] max-w-[48rem]">
          {t('title')}
        </h1>
        <p className="font-sans text-body-lg text-ink/75 max-w-[36rem]">
          {t('sub')}
        </p>
        <div className="flex flex-col sm:flex-row gap-md mt-md">
          <Link
            href="/creators#form"
            className="font-sans text-caption uppercase tracking-[0.05em] bg-olive text-cream px-xl py-md hover:bg-ink transition-colors"
          >
            {t('cta_primary')}
          </Link>
          <Link
            href="/pricing"
            className="font-sans text-caption uppercase tracking-[0.05em] border border-olive/40 text-olive px-xl py-md hover:border-olive hover:bg-olive hover:text-cream transition-colors"
          >
            {t('cta_secondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
