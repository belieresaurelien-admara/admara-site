import {useTranslations} from 'next-intl';

const SWATCHES = [
  {name: 'olive', hex: '#726D2D', textClass: 'text-cream'},
  {name: 'cream', hex: '#F4EFE6', textClass: 'text-ink'},
  {name: 'sand', hex: '#D9CDB6', textClass: 'text-ink'},
  {name: 'brick', hex: '#8E3A19', textClass: 'text-cream'},
  {name: 'ink', hex: '#0A0A0A', textClass: 'text-cream'}
] as const;

export default function PaletteShowcase() {
  const t = useTranslations('Palette');

  return (
    <section
      aria-labelledby="palette-title"
      className="w-full max-w-7xl mx-auto px-lg py-xxl"
    >
      <h2
        id="palette-title"
        className="font-serif text-h2 text-ink mb-xl"
      >
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
        {SWATCHES.map(({name, hex, textClass}) => (
          <div
            key={name}
            className={`flex flex-col justify-between aspect-[4/5] rounded-md p-lg shadow-soft ${textClass}`}
            style={{backgroundColor: hex}}
          >
            <span className="font-sans text-caption uppercase tracking-[0.05em] opacity-80">
              {hex}
            </span>
            <div className="flex flex-col gap-xs">
              <span className="font-serif text-h3 capitalize">{name}</span>
              <span className="font-sans text-caption opacity-90 leading-tight">
                {t(name)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
