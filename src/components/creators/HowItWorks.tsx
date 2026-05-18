import {getTranslations} from 'next-intl/server';

const steps = ['discovery', 'matching', 'booking', 'preshoot', 'delivery'] as const;

export default async function HowItWorks() {
  const t = await getTranslations('Creators.howItWorks');

  return (
    <section className="bg-cream py-xxxl">
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

        <ol className="grid gap-md md:grid-cols-5">
          {steps.map((key, idx) => (
            <li
              key={key}
              className="flex flex-col gap-sm pt-md border-t border-olive/30"
            >
              <span className="font-serif text-h3 text-olive">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sans text-caption uppercase tracking-[0.05em] text-ink">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="font-sans text-body text-ink/70">
                {t(`steps.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
