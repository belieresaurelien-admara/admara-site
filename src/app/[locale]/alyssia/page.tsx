import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Alyssia.meta'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function AlyssiaCardPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Alyssia');

  const whatsappUrl = 'https://wa.me/66954758972';
  const lineUrl = 'https://line.me/ti/p/_5B9jtA2-k';
  const emailUrl = `mailto:${t('cta_email_value')}`;

  return (
    <section className="min-h-[100svh] w-full flex items-center justify-center bg-cream px-lg py-xl">
      <div className="w-full max-w-[28rem] flex flex-col items-center text-center gap-lg">
        <Link
          href="/"
          className="font-serif text-h2 text-olive leading-none tracking-tight"
        >
          {t('brand')}
        </Link>

        <p className="font-sans text-body text-ink/70 max-w-[22rem]">
          {t('tagline')}
        </p>

        <div className="w-12 h-px bg-brick/40 my-sm" />

        <div className="flex flex-col items-center gap-xs">
          <h1 className="font-serif text-h2 text-ink leading-tight">
            {t('name')}
          </h1>
          <p className="font-sans text-caption uppercase tracking-[0.1em] text-brick">
            {t('role')}
          </p>
        </div>

        <a
          href="/api/vcard/alyssia"
          className="w-full max-w-[20rem] mt-md font-sans text-caption uppercase tracking-[0.1em] bg-ink text-cream px-xl py-md text-center hover:bg-brick transition-colors"
        >
          {t('cta_save')}
        </a>

        <div className="w-full max-w-[20rem] flex flex-col gap-sm mt-sm">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline justify-between border-b border-ink/15 py-md hover:border-brick transition-colors group"
          >
            <span className="font-sans text-caption uppercase tracking-[0.1em] text-ink/50 group-hover:text-brick transition-colors">
              {t('cta_whatsapp_label')}
            </span>
            <span className="font-sans text-body text-ink group-hover:text-brick transition-colors">
              {t('cta_whatsapp_value')}
            </span>
          </a>

          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline justify-between border-b border-ink/15 py-md hover:border-brick transition-colors group"
          >
            <span className="font-sans text-caption uppercase tracking-[0.1em] text-ink/50 group-hover:text-brick transition-colors">
              {t('cta_line_label')}
            </span>
            <span className="font-sans text-body text-ink group-hover:text-brick transition-colors">
              {t('cta_line_value')}
            </span>
          </a>

          <a
            href={emailUrl}
            className="flex items-baseline justify-between border-b border-ink/15 py-md hover:border-brick transition-colors group"
          >
            <span className="font-sans text-caption uppercase tracking-[0.1em] text-ink/50 group-hover:text-brick transition-colors">
              {t('cta_email_label')}
            </span>
            <span className="font-sans text-body text-ink group-hover:text-brick transition-colors">
              {t('cta_email_value')}
            </span>
          </a>

          <Link
            href="/"
            className="flex items-baseline justify-between border-b border-ink/15 py-md hover:border-brick transition-colors group"
          >
            <span className="font-sans text-caption uppercase tracking-[0.1em] text-ink/50 group-hover:text-brick transition-colors">
              {t('cta_site_label')}
            </span>
            <span className="font-sans text-body text-ink group-hover:text-brick transition-colors">
              {t('cta_site_value')}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
