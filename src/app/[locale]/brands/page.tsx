import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import HeroBrands from '@/components/brands/HeroBrands';
import WhyUsBrands from '@/components/brands/WhyUsBrands';
import HowItWorksBrands from '@/components/brands/HowItWorksBrands';
import PricingBrands from '@/components/brands/PricingBrands';
import AboutTeaserBrands from '@/components/brands/AboutTeaserBrands';
import CtaFormBrands from '@/components/brands/CtaFormBrands';

export async function generateMetadata({params}: PageProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Brands.meta'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function BrandsPage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroBrands />
      <WhyUsBrands />
      <HowItWorksBrands />
      <PricingBrands />
      <AboutTeaserBrands />
      <CtaFormBrands />
    </>
  );
}
