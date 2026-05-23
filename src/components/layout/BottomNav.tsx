'use client';

import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const items = [
  {
    href: '/',
    key: 'home',
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10 L12 4 L21 10 V21 H3 V10 Z" />
        <path d="M10 21 V14 H14 V21" />
      </svg>
    )
  },
  {
    href: '/service',
    key: 'service',
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a8 8 0 0 1-12.7 6.5L3 21l2.5-5.3A8 8 0 1 1 21 12z" />
      </svg>
    )
  },
  {
    href: '/admara',
    key: 'admara',
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      </svg>
    )
  }
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations('Nav');

  const isActive = (href: string) => {
    const cleaned = pathname.replace(/^\/(fr|en)/, '') || '/';
    if (href === '/') return cleaned === '/';
    return cleaned.startsWith(href);
  };

  return (
    <nav
      aria-label={t('label')}
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-cream/95 backdrop-blur-sm border-t border-olive/10"
    >
      {items.map(({href, key, icon}) => {
        const active = isActive(href);
        return (
          <Link
            key={key}
            href={href}
            scroll={true}
            aria-current={active ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center justify-center py-sm gap-[3px] transition-colors duration-150 ${
              active ? 'text-brick' : 'text-ink/50 hover:text-brick'
            }`}
          >
            {icon}
            <span className="font-sans text-[10px] uppercase tracking-[0.08em]">
              {t(key)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
