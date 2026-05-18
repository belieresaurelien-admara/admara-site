import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function AboutTeaser() {
  const t = await getTranslations('Creators.about');

  return (
    <section className="bg-cream py-xxxl">
      <div className="w-full max-w-[64rem] mx-auto px-lg grid gap-xl md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-md">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-olive">
            {t('eyebrow')}
          </span>
          <h2 className="font-serif text-h2 text-ink leading-[1.15]">
            {t('title')}
          </h2>
        </div>
        <div className="flex flex-col gap-md font-sans text-body text-ink/75">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <Link
            href="/about"
            className="font-sans text-caption uppercase tracking-[0.05em] text-olive border-b border-olive/40 hover:border-olive w-fit pb-xs transition-colors mt-md"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
