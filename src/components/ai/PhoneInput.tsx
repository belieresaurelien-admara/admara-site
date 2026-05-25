'use client';

import {useState, useMemo, useEffect, useRef} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import Picker from 'react-mobile-picker';
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode
} from 'libphonenumber-js/min';

type Props = {
  defaultCountryRaw?: string;
  onSubmit: (payload: {
    phone_country_code: string;
    phone_number: string;
    e164: string;
  }) => void;
};

type CountryEntry = {iso: CountryCode; name: string; dial: string};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export default function PhoneInput({defaultCountryRaw, onSubmit}: Props) {
  const t = useTranslations('Service.agent.phoneInput');
  const locale = useLocale();
  const [iso, setIso] = useState<CountryCode>('FR');
  const [number, setNumber] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const countries: CountryEntry[] = useMemo(() => {
    const display = new Intl.DisplayNames([locale, 'fr', 'en'], {
      type: 'region'
    });
    return getCountries()
      .map((iso) => ({
        iso,
        name: display.of(iso) ?? iso,
        dial: '+' + getCountryCallingCode(iso)
      }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  useEffect(() => {
    if (!defaultCountryRaw) return;
    const target = normalize(defaultCountryRaw);
    const match = countries.find((c) => normalize(c.name) === target);
    if (match) setIso(match.iso);
  }, [defaultCountryRaw, countries]);

  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = normalize(search);
    return countries.filter(
      (c) =>
        normalize(c.name).includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [countries, search]);

  const current = countries.find((c) => c.iso === iso);
  const dialCode = current?.dial ?? '+33';

  const e164 = `${dialCode}${number.replace(/\D/g, '')}`;
  const isValid = number.length >= 4 && isValidPhoneNumber(e164, iso);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      phone_country_code: dialCode,
      phone_number: number.replace(/\D/g, ''),
      e164
    });
  };

  const [pickerValue, setPickerValue] = useState({country: iso as string});
  useEffect(() => {
    setPickerValue({country: iso});
  }, [iso]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="w-full max-w-[26rem] mx-auto flex flex-col gap-md" ref={containerRef}>
      {/* Mobile : wheel picker */}
      <div className="md:hidden">
        <span className="font-sans text-caption uppercase tracking-[0.05em] text-cream/50 mb-xs block">
          {t('country_label')}
        </span>
        <Picker
          value={pickerValue}
          onChange={(val) => {
            const next = val.country as CountryCode;
            setPickerValue({country: next});
            setIso(next);
          }}
          height={150}
          itemHeight={36}
          wheelMode="natural"
        >
          <Picker.Column name="country">
            {countries.map((c) => (
              <Picker.Item key={c.iso} value={c.iso}>
                {c.dial} {c.name}
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </div>

      {/* Desktop : combobox searchable */}
      <div className="hidden md:block relative">
        <label className="font-sans text-caption uppercase tracking-[0.05em] text-cream/50 mb-xs block">
          {t('country_label')}
        </label>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={t('country_label')}
          className="w-full bg-transparent border-b border-cream/40 focus:border-cream py-md px-xs text-body font-sans text-cream text-left outline-none transition-colors"
        >
          {current ? `${current.dial}  ${current.name}` : t('select')}
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-xs bg-ink border border-cream/20 max-h-[260px] overflow-y-auto z-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
              className="w-full bg-transparent border-b border-cream/20 px-md py-sm text-body font-sans text-cream placeholder:text-cream/40 outline-none"
              autoFocus
            />
            <ul role="listbox" aria-label={t('country_label')}>
              {filtered.map((c) => (
                <li key={c.iso}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.iso === iso}
                    onClick={() => {
                      setIso(c.iso);
                      setSearch('');
                      setOpen(false);
                    }}
                    className="w-full px-md py-sm font-sans text-body text-cream/90 hover:bg-cream/10 text-left transition-colors"
                  >
                    <span className="text-cream/60 mr-sm">{c.dial}</span>
                    {c.name}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-md py-sm font-sans text-caption text-cream/40">
                  {t('no_match')}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Numéro */}
      <div>
        <label className="font-sans text-caption uppercase tracking-[0.05em] text-cream/50 mb-xs block">
          {t('number_label')}
        </label>
        <div className="flex items-center gap-sm border-b border-cream/40 focus-within:border-cream py-md transition-colors">
          <span className="font-sans text-body text-cream/60">{dialCode}</span>
          <input
            type="tel"
            inputMode="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-transparent text-body font-sans text-cream placeholder:text-cream/40 outline-none"
            aria-label={t('number_label')}
          />
        </div>
        {number.length > 0 && !isValid && (
          <p className="font-sans text-caption text-brick mt-xs">
            {t('invalid')}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className="self-center font-sans text-caption uppercase tracking-[0.1em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-sm"
      >
        {t('submit')}
      </button>
    </div>
  );
}
