import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import HeroCreators from '@/components/creators/HeroCreators';
import WhyUs from '@/components/creators/WhyUs';
import HowItWorks from '@/components/creators/HowItWorks';
import PricingCreators from '@/components/creators/PricingCreators';
import AboutTeaser from '@/components/creators/AboutTeaser';
import CtaForm from '@/components/creators/CtaForm';

export async function generateMetadata({params}: PageProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Creators.meta'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function CreatorsPage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroCreators />
      <WhyUs />
      <HowItWorks />
      <PricingCreators />
      <AboutTeaser />
      <CtaForm />
    </>
  );
}
