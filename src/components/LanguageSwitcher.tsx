'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {useTransition} from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  }

  return (
    <nav
      aria-label={t('label')}
      className="inline-flex items-center gap-sm text-caption uppercase tracking-[0.05em]"
      data-pending={isPending ? '' : undefined}
    >
      {routing.locales.map((loc, idx) => {
        const isActive = loc === locale;
        return (
          <span key={loc} className="inline-flex items-center gap-sm">
            <button
              type="button"
              onClick={() => switchTo(loc)}
              disabled={isActive || isPending}
              className={
                isActive
                  ? 'text-olive font-semibold cursor-default'
                  : 'text-ink/60 hover:text-olive transition-colors cursor-pointer'
              }
              aria-current={isActive ? 'true' : undefined}
            >
              {loc.toUpperCase()}
            </button>
            {idx < routing.locales.length - 1 ? (
              <span aria-hidden className="text-ink/30">/</span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
