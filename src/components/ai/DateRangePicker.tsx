'use client';

import {useState, useMemo} from 'react';
import {useTranslations, useLocale} from 'next-intl';

type Props = {
  onSubmit: (text: string) => void;
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return d;
}

function buildMonthGrid(viewMonth: Date): Array<Date | null> {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // Monday=0, Sunday=6
  const offset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function DateRangePicker({onSubmit}: Props) {
  const t = useTranslations('Service.agent.datePicker');
  const locale = useLocale();
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(today);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(viewMonth);
  }, [locale, viewMonth]);

  const weekdayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, {weekday: 'short'});
    // ISO week starts Monday
    const monday = new Date(2024, 0, 1);
    const labels: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      labels.push(fmt.format(d).replace('.', ''));
    }
    return labels;
  }, [locale]);

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);

  const handlePick = (date: Date) => {
    if (date < today) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      return;
    }
    if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
      return;
    }
    setEndDate(date);
  };

  const handleConfirm = () => {
    if (!startDate) return;
    const text = endDate
      ? `${t('range_from')} ${formatDate(startDate)} ${t('range_to')} ${formatDate(endDate)}`
      : `${t('departure')} : ${formatDate(startDate)}`;
    onSubmit(text);
  };

  const cells = buildMonthGrid(viewMonth);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInRange = (d: Date) =>
    startDate && endDate && d > startDate && d < endDate;

  const summary = endDate
    ? `${t('range_from')} ${formatDate(startDate!)} ${t('range_to')} ${formatDate(endDate)}`
    : startDate
      ? `${t('departure')} : ${formatDate(startDate)}`
      : t('hint');

  return (
    <div className="w-full max-w-[20rem] mx-auto select-none flex flex-col gap-md">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          aria-label={t('prev_month')}
          className="w-8 h-8 flex items-center justify-center text-cream/70 hover:text-cream hover:bg-cream/10 rounded-sm transition"
        >
          ‹
        </button>
        <span className="font-serif text-h3 text-cream capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          aria-label={t('next_month')}
          className="w-8 h-8 flex items-center justify-center text-cream/70 hover:text-cream hover:bg-cream/10 rounded-sm transition"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[2px]">
        {weekdayLabels.map((label) => (
          <span
            key={label}
            className="font-sans text-caption text-cream/40 uppercase text-center py-xs"
          >
            {label}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (!cell) {
            return <span key={`empty-${i}`} className="aspect-square" />;
          }
          const past = cell < today;
          const isStart = startDate && isSameDay(cell, startDate);
          const isEnd = endDate && isSameDay(cell, endDate);
          const inRange = isInRange(cell);
          const selected = isStart || isEnd;
          const baseCls = 'aspect-square flex items-center justify-center text-body font-sans transition';
          const stateCls = past
            ? 'text-cream/25 cursor-not-allowed'
            : selected
              ? 'bg-brick text-cream rounded-sm font-medium cursor-pointer'
              : inRange
                ? 'bg-cream/10 text-cream cursor-pointer'
                : 'text-cream/80 hover:bg-cream/10 rounded-sm cursor-pointer';
          return (
            <button
              key={cell.toISOString()}
              type="button"
              onClick={() => handlePick(cell)}
              disabled={past}
              className={`${baseCls} ${stateCls}`}
            >
              {cell.getDate()}
            </button>
          );
        })}
      </div>

      <p className="font-sans text-caption text-cream/50 text-center min-h-[1.5em]">
        {summary}
      </p>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!startDate}
        className="self-center font-sans text-caption uppercase tracking-[0.1em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('submit')}
      </button>
    </div>
  );
}
