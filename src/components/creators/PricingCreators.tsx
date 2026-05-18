import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type PackKey = 'discover' | 'signature' | 'editorial' | 'recurring';

const packs: {key: PackKey; price: string; featured?: boolean}[] = [
  {key: 'discover', price: '390 €'},
  {key: 'signature', price: '990 €', featured: true},
  {key: 'editorial', price: '1 890 €'},
  {key: 'recurring', price: '790 €/mois'}
];

export default async function PricingCreators() {
  const t = await getTranslations('Creators.pricing');

  return (
    <section className="bg-sand py-xxxl">
      <div className="w-full max-w-[80rem] mx-auto px-lg">
        <div className="max-w-[40rem] mb-xxl flex flex-col gap-md">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-olive">
            {t('eyebrow')}
          </span>
          <h2 className="font-serif text-h2 text-ink leading-[1.15]">
            {t('title')}
          </h2>
          <p className="font-sans text-body-lg text-ink/70">
            {t('intro')}
          </p>
        </div>

        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
          {packs.map(({key, price, featured}) => (
            <article
              key={key}
              className={
                featured
                  ? 'bg-cream p-lg flex flex-col gap-md border border-olive lg:-mt-md lg:pb-xl shadow-medium'
                  : 'bg-cream p-lg flex flex-col gap-md border border-olive/15'
              }
            >
              <div className="flex flex-col gap-xs">
                <h3 className="font-serif text-h3 text-ink">
                  {t(`packs.${key}.name`)}
                </h3>
                {featured ? (
                  <span className="font-sans text-caption uppercase tracking-[0.05em] text-olive">
                    {t('featured')}
                  </span>
                ) : null}
              </div>
              <p className="font-serif text-price text-olive">{price}</p>
              <p className="font-sans text-body text-ink/70 flex-1">
                {t(`packs.${key}.body`)}
              </p>
              <Link
                href="/creators#form"
                className="font-sans text-caption uppercase tracking-[0.05em] text-olive border-b border-olive/40 hover:border-olive w-fit pb-xs transition-colors"
              >
                {t('cta')}
              </Link>
            </article>
          ))}
        </div>

        <p className="font-sans text-caption text-ink/50 mt-xl max-w-[40rem]">
          {t('reassurance')}
        </p>
      </div>
    </section>
  );
}
