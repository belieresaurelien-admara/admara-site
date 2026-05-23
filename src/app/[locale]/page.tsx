import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import VideoBackground from '@/components/shared/VideoBackground';

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');

  return (
    <section className="relative isolate flex items-center justify-center h-[100svh] w-full overflow-hidden md:-mt-[5rem] md:pt-0">
      <VideoBackground
        desktopSrc="/videos/video-landing-page-desktop.mp4"
        phoneSrc="/videos/video-landing-page-phone.mp4"
        overlayOpacity={28}
      />

      <div className="relative z-10 w-full max-w-[48rem] mx-auto flex flex-col items-center gap-xl px-lg text-center">
        <h1 className="font-serif text-h1 text-cream leading-[1.1] drop-shadow-sm">
          {t('tagline')}
        </h1>
        <p className="font-sans text-body-lg text-cream/90 max-w-[32rem]">
          {t('sub')}
        </p>

        <div className="mt-md">
          <Link
            href="/service"
            className="font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors"
          >
            {t('cta_primary')}
          </Link>
        </div>
      </div>

      <Link
        href="/service"
        className="absolute bottom-[3rem] left-1/2 -translate-x-1/2 z-10 border border-white/80 text-cream/90 px-xl py-md font-sans text-caption uppercase tracking-[0.2em] bg-transparent hover:bg-white hover:text-ink transition-colors duration-[250ms]"
      >
        {t('cta_city')}
      </Link>
    </section>
  );
}
