'use client';

import {useTranslations} from 'next-intl';

export default function AgentFallback() {
  const t = useTranslations('Service.fallback');
  const calUrl =
    process.env.NEXT_PUBLIC_CAL_URL || 'https://cal.com/admara/discovery-call';

  return (
    <div className="flex flex-col items-center text-center gap-md max-w-[36rem]">
      <p className="font-sans text-body text-cream/85">{t('intro')}</p>
      <div className="flex flex-col sm:flex-row gap-md">
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors"
        >
          {t('cta_cal')}
        </a>
        <a
          href="mailto:alyssia@admara-studio.com?subject=Projet%20ADMARA"
          className="font-sans text-caption uppercase tracking-[0.05em] border border-cream/60 text-cream px-xl py-md hover:bg-cream hover:text-ink transition-colors"
        >
          {t('cta_email')}
        </a>
      </div>
    </div>
  );
}
