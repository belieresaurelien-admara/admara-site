'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

type Props = {
  onSubmit: (text: string) => void;
};

export default function DateRangePicker({onSubmit}: Props) {
  const t = useTranslations('Service.agent.datePicker');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const disabled = !start;

  const handleClick = () => {
    if (!start) return;
    const formatted = end ? `Du ${start} au ${end}` : `Du ${start}`;
    onSubmit(formatted);
  };

  return (
    <div className="flex flex-col gap-md w-full" style={{colorScheme: 'dark'}}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <label className="flex flex-col gap-xs">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-cream/60">
            {t('start')}
          </span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="bg-transparent border-b border-cream/40 focus:border-cream text-cream font-sans text-body py-md px-xs outline-none transition"
            aria-label={t('start_label')}
          />
        </label>
        <label className="flex flex-col gap-xs">
          <span className="font-sans text-caption uppercase tracking-[0.05em] text-cream/60">
            {t('end')}
          </span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            min={start || undefined}
            className="bg-transparent border-b border-cream/40 focus:border-cream text-cream font-sans text-body py-md px-xs outline-none transition"
            aria-label={t('end_label')}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="self-center font-sans text-caption uppercase tracking-[0.1em] border border-cream/60 text-cream px-xl py-md hover:bg-cream hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('submit')}
      </button>

      <style jsx>{`
        input[type='date']::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
