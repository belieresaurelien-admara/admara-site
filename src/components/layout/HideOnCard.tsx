'use client';

import {usePathname} from 'next/navigation';

const CARD_ROUTES = ['/alyssia', '/aurelien'];

export default function HideOnCard({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const cleaned = pathname.replace(/^\/(?:fr|en)/, '') || '/';
  const isCard = CARD_ROUTES.some((route) => cleaned === route || cleaned.startsWith(`${route}/`));
  if (isCard) return null;
  return <>{children}</>;
}
