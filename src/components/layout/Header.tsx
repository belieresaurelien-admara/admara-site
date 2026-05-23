import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const navItems = [
  {href: '/', key: 'home'},
  {href: '/service', key: 'service'},
  {href: '/admara', key: 'admara'}
] as const;

export default async function Header() {
  const t = await getTranslations('Nav');

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/90 backdrop-blur-sm border-b border-olive/10">
      <div className="w-full max-w-[80rem] mx-auto flex items-center justify-between px-lg py-md">
        <Link
          href="/"
          className="font-serif text-h3 text-olive hover:text-ink transition-colors"
          aria-label="Admara — Home"
        >
          Admara
        </Link>

        <nav aria-label={t('label')} className="hidden md:flex items-center gap-xl">
          {navItems.map(({href, key}) => (
            <Link
              key={key}
              href={href}
              scroll={true}
              className="font-sans text-caption uppercase tracking-[0.05em] text-ink/70 hover:text-brick transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
