import {NextResponse, type NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Card routes default to English first (these URLs are scanned via QR by
// international contacts). The /fr/<route> path still works for FR speakers.
const EN_FIRST_ROUTES = new Set(['/alyssia', '/aurelien']);

export default function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  if (EN_FIRST_ROUTES.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
