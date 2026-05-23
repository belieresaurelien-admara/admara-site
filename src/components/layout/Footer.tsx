import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

const navItems = [
  {href: '/', key: 'home'},
  {href: '/service', key: 'service'},
  {href: '/admara', key: 'admara'}
] as const;

const legalItems = [
  {href: '/legal/privacy', key: 'privacy'},
  {href: '/legal/terms', key: 'terms'},
  {href: '/legal/imprint', key: 'imprint'}
] as const;

export default async function Footer() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-olive/10 bg-cream">
      <div className="w-full max-w-[80rem] mx-auto px-lg py-xxl grid gap-xl md:grid-cols-3">
        <div className="flex flex-col gap-md">
          <Link href="/" className="font-serif text-h3 text-olive w-fit">
            Admara
          </Link>
          <p className="font-sans text-body text-ink/70 max-w-[20rem]">
            {t('tagline')}
          </p>
        </div>

        <nav aria-label={t('navLabel')} className="flex flex-col gap-sm">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-ink/50 mb-xs">
            {t('explore')}
          </span>
          {navItems.map(({href, key}) => (
            <Link
              key={key}
              href={href}
              className="font-sans text-body text-ink/80 hover:text-brick transition-colors w-fit"
            >
              {tNav(key)}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-sm">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-ink/50 mb-xs">
            {t('contact')}
          </span>
          <a
            href="mailto:alyssia@admara-studio.com"
            className="font-sans text-body text-ink/80 hover:text-brick transition-colors w-fit"
          >
            alyssia@admara-studio.com
          </a>
          <a
            href="https://instagram.com/admara.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-body text-ink/80 hover:text-brick transition-colors w-fit"
          >
            @admara.studio
          </a>
        </div>
      </div>

      <div className="border-t border-olive/10">
        <div className="w-full max-w-[80rem] mx-auto px-lg py-md flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
          <p className="font-sans text-caption text-ink/50">
            © {year} Admara Studio. {t('rights')}
          </p>
          <nav aria-label={t('legalLabel')} className="flex flex-wrap items-center gap-md">
            {legalItems.map(({href, key}) => (
              <Link
                key={key}
                href={href}
                className="font-sans text-caption text-ink/60 hover:text-brick transition-colors"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
