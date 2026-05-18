import {getTranslations} from 'next-intl/server';

/**
 * F.5 placeholder — Agent B (form DA conversationnel) sera branché en F.8.
 * Pour l'instant : section CTA statique avec lien email vers Alyssia.
 */
export default async function CtaFormBrands() {
  const t = await getTranslations('Brands.ctaForm');

  return (
    <section id="form" className="bg-ink py-xxxl">
      <div className="w-full max-w-[48rem] mx-auto px-lg flex flex-col items-center text-center gap-lg">
        <span className="font-sans text-caption uppercase tracking-[0.05em] text-olive">
          {t('eyebrow')}
        </span>
        <h2 className="font-serif text-h2 text-cream leading-[1.15]">
          {t('title')}
        </h2>
        <p className="font-sans text-body-lg text-cream/80 max-w-[32rem]">
          {t('sub')}
        </p>

        {/* TODO F.8 — replace with <AgentB segment="brand" /> conversational form */}
        <div className="w-full max-w-[28rem] mt-md flex flex-col gap-md">
          <a
            href="mailto:alyssia@admara-studio.com?subject=Projet%20marque%20%E2%80%94%20ADMARA"
            className="font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors text-center"
          >
            {t('cta_email')}
          </a>
          <p className="font-sans text-caption text-cream/50">
            {t('reassurance')}
          </p>
        </div>
      </div>
    </section>
  );
}
