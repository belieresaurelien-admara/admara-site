import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import VideoBackground from '@/components/shared/VideoBackground';

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');

  return (
    <section className="relative isolate flex items-center justify-center h-[100svh] -mt-[5rem] pt-[5rem] overflow-hidden">
      <VideoBackground
        desktopSrc="/videos/video-landing-page-desktop.mp4"
        phoneSrc="/videos/video-landing-page-phone.mp4"
        overlayOpacity={35}
      />

      <div className="relative z-10 w-full max-w-[48rem] mx-auto flex flex-col items-center gap-xl px-lg text-center">
        <h1 className="font-serif text-h1 text-cream leading-[1.1] drop-shadow-sm">
          {t('tagline')}
        </h1>
        <p className="font-sans text-body-lg text-cream/90 max-w-[32rem]">
          {t('sub')}
        </p>

        <div className="flex flex-col sm:flex-row gap-md mt-md">
          <Link
            href="/creators"
            className="font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors"
          >
            {t('cta_creators')}
          </Link>
          <Link
            href="/brands"
            className="font-sans text-caption uppercase tracking-[0.05em] border border-cream/60 text-cream px-xl py-md hover:bg-cream hover:text-ink transition-colors"
          >
            {t('cta_brands')}
          </Link>
        </div>
      </div>
    </section>
  );
}
