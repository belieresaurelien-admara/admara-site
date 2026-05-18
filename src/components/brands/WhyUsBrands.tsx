import {getTranslations} from 'next-intl/server';

const pillars = ['selection', 'direction', 'delivery', 'nomadic'] as const;

export default async function WhyUsBrands() {
  const t = await getTranslations('Brands.whyUs');

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

        <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((key, idx) => (
            <article
              key={key}
              className="bg-cream p-lg flex flex-col gap-sm border-t-2 border-olive/30"
            >
              <span className="font-sans text-caption text-olive/70">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-h3 text-ink">
                {t(`pillars.${key}.title`)}
              </h3>
              <p className="font-sans text-body text-ink/70">
                {t(`pillars.${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
