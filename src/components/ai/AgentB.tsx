'use client';

import {useChat} from '@ai-sdk/react';
import {DefaultChatTransport} from 'ai';
import {useState, useMemo, useEffect, useRef} from 'react';
import {useTranslations} from 'next-intl';
import AgentFallback from './AgentFallback';
import DateRangePicker from './DateRangePicker';
import BudgetDropdown from './BudgetDropdown';
import PhoneInput from './PhoneInput';
import {
  currencyFromCountry,
  bracketFromUsdAmount,
  type Currency,
  type Bracket
} from '@/lib/ai/currency-map';

const REDIRECT_DELAY_MS = 3500;
const TOTAL_STEPS = 11;
const DATE_PATTERN = /\bdate|fenêtre|quand|période|when|dates\b/i;
const BUDGET_PATTERN = /\bbudget|fourchette|envisages?-?tu|prestation totale|how much|spend\b/i;
const PHONE_PATTERN = /\bt[éee]l[éee]phone|num[ée]ro\b|phone number|reach you|joindre\b/i;
const LOCATION_PATTERN = /\bvilles?|pays|location|country|where.*shoot|lieu\b/i;

type UIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: Array<{type: string; text?: string}>;
};

function getText(message: UIMessage): string {
  if (!message.parts) return '';
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text || '')
    .join('');
}

/**
 * Heuristique : extrait un pays plausible depuis une réponse user à Q5.
 * Le user peut écrire "Paris, France" ou juste "Thaïlande" ou "Bangkok".
 * On prend le dernier segment après une virgule, sinon la string entière.
 */
function extractCountry(raw: string): string {
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || raw.trim();
}

/**
 * Mappe un montant texte libre (ex: "1200 euros", "$ 2000") vers un bracket USD-équivalent.
 * Conversion approximative : si pas de devise détectée, on suppose USD.
 */
function freeAmountToBracket(text: string): Bracket | null {
  const numMatch = text.replace(/[   ,]/g, '').match(/(\d{2,7})/);
  if (!numMatch) return null;
  const value = parseInt(numMatch[1], 10);
  // Conversion grossière vers USD selon devise détectée
  let usd = value;
  if (/€|euros?|eur/i.test(text)) usd = value / 0.92;
  else if (/฿|baht|thb/i.test(text)) usd = value / 36;
  else if (/£|pounds?|gbp/i.test(text)) usd = value / 0.79;
  else if (/aed|dirham/i.test(text)) usd = value / 3.67;
  else if (/¥|yuan|cny/i.test(text)) usd = value / 7.2;
  return bracketFromUsdAmount(usd);
}

export default function AgentB() {
  const t = useTranslations('Service.agent');
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [datePicked, setDatePicked] = useState(false);
  const [budgetPicked, setBudgetPicked] = useState(false);
  const [phonePicked, setPhonePicked] = useState(false);

  // Captures structurées pour submit_brief
  const captureRef = useRef<{
    country?: string;
    currency?: Currency;
    budget?: {bracket: Bracket; currency: Currency; display_label: string};
    phone?: {phone_country_code: string; phone_number: string; e164: string};
  }>({});

  const transport = useMemo(
    () => new DefaultChatTransport({api: '/api/agent-b'}),
    []
  );

  const {messages, sendMessage, status, error} = useChat({
    transport,
    onFinish: ({message}) => {
      const text = getText(message as UIMessage);
      const briefSubmitted =
        text.includes('Brief transmis') || text.includes('brief transmitted');
      if (briefSubmitted) setSubmitted(true);
    }
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const calUrl =
    process.env.NEXT_PUBLIC_CAL_URL || 'https://cal.com/admara/discovery-call';

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      window.open(calUrl, '_blank');
    }, REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [submitted, calUrl]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || isLoading) return;
    sendMessage({text: value});
    setInput('');
  };

  if (error) {
    return <AgentFallback />;
  }

  const messagesList = messages as UIMessage[];
  const assistantMessages = messagesList.filter((m) => m.role === 'assistant');
  const userMessages = messagesList.filter((m) => m.role === 'user');
  const currentAgent = assistantMessages[assistantMessages.length - 1];
  const previousAgent = assistantMessages[assistantMessages.length - 2];
  const previous = messagesList.filter((m) => m !== currentAgent);

  useEffect(() => {
    setDatePicked(false);
    setBudgetPicked(false);
    setPhonePicked(false);
  }, [currentAgent?.id]);

  // Détecter la réponse Q5 (pays) dans le dernier message user, juste après une
  // question agent qui parle de lieu.
  useEffect(() => {
    if (previousAgent && LOCATION_PATTERN.test(getText(previousAgent))) {
      const lastUser = userMessages[userMessages.length - 1];
      if (lastUser) {
        const country = extractCountry(getText(lastUser));
        captureRef.current.country = country;
        captureRef.current.currency = currencyFromCountry(country);
      }
    }
  }, [previousAgent, userMessages]);

  const isInitial = messagesList.length === 0;
  const initialPrompt = t('initial_prompt');

  const rawStep = Math.min(assistantMessages.length, TOTAL_STEPS - 1);
  const progress = submitted ? 100 : (rawStep / TOTAL_STEPS) * 100;

  const currentAgentText = currentAgent ? getText(currentAgent) : '';

  const showDatePicker =
    !submitted &&
    !isInitial &&
    !datePicked &&
    !isLoading &&
    DATE_PATTERN.test(currentAgentText);

  const showBudgetDropdown =
    !submitted &&
    !isInitial &&
    !budgetPicked &&
    !isLoading &&
    BUDGET_PATTERN.test(currentAgentText);

  const showPhoneInput =
    !submitted &&
    !isInitial &&
    !phonePicked &&
    !isLoading &&
    PHONE_PATTERN.test(currentAgentText);

  const handleDateSubmit = (text: string) => {
    setDatePicked(true);
    sendMessage({text});
    setInput('');
  };

  const handleBudgetSubmit = (sel: {
    bracket: Bracket;
    currency: Currency;
    display_label: string;
  }) => {
    captureRef.current.budget = sel;
    setBudgetPicked(true);
    sendMessage({text: sel.display_label});
    setInput('');
  };

  const handlePhoneSubmit = (p: {
    phone_country_code: string;
    phone_number: string;
    e164: string;
  }) => {
    captureRef.current.phone = p;
    setPhonePicked(true);
    sendMessage({text: p.e164});
    setInput('');
  };

  // Fallback : si user tape un montant libre quand on attend un bracket,
  // on capture en arrière-plan le bracket le plus proche.
  useEffect(() => {
    if (budgetPicked) return;
    if (!previousAgent || !BUDGET_PATTERN.test(getText(previousAgent))) return;
    const lastUser = userMessages[userMessages.length - 1];
    if (!lastUser) return;
    const text = getText(lastUser);
    const bracket = freeAmountToBracket(text);
    if (bracket) {
      const currency = captureRef.current.currency ?? 'USD';
      captureRef.current.budget = {
        bracket,
        currency,
        display_label: text.trim()
      };
      setBudgetPicked(true);
    }
  }, [previousAgent, userMessages, budgetPicked]);

  const displayMessage = submitted
    ? t('confirmation')
    : isInitial
      ? initialPrompt
      : currentAgentText;

  const detectedCurrency: Currency = captureRef.current.currency ?? 'USD';
  const detectedCountry = captureRef.current.country;

  return (
    <div className="w-full max-w-[36rem] mx-auto flex flex-col gap-lg">
      {(rawStep > 0 || submitted) && (
        <div className="w-full h-[2px] bg-cream/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-cream"
            style={{
              width: `${progress}%`,
              boxShadow: submitted
                ? '0 0 12px rgba(142, 58, 25, 0.5)'
                : '0 0 8px rgba(244, 239, 230, 0.3)',
              backgroundColor: submitted ? 'var(--color-brick)' : undefined,
              transition: submitted
                ? 'width 1000ms ease, background-color 400ms ease, box-shadow 400ms ease'
                : 'width 700ms ease-out'
            }}
          />
        </div>
      )}

      {previous.length > 0 && !submitted && (
        <details className="text-cream/60 text-xs">
          <summary className="cursor-pointer uppercase tracking-[0.05em] font-sans hover:text-cream">
            {t('history', {count: previous.length})}
          </summary>
          <div className="mt-md space-y-sm opacity-80 font-sans text-caption">
            {previous.map((m, i) => (
              <p key={i}>
                <span className="text-olive">
                  {m.role === 'user' ? t('you') : 'ADMARA'}:
                </span>{' '}
                {getText(m)}
              </p>
            ))}
          </div>
        </details>
      )}

      <p
        key={submitted ? 'confirm' : currentAgent?.id || 'initial'}
        className="font-sans text-h3 text-cream text-center leading-snug min-h-[5rem] animate-[fadeIn_300ms_ease-out]"
      >
        {displayMessage}
      </p>

      {submitted ? (
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-center font-sans text-caption uppercase tracking-[0.1em] border border-cream/60 text-cream px-xl py-md text-center hover:bg-cream hover:text-ink transition-colors mt-md"
        >
          {t('cta_cal')}
        </a>
      ) : showDatePicker ? (
        <DateRangePicker onSubmit={handleDateSubmit} />
      ) : showBudgetDropdown ? (
        <BudgetDropdown currency={detectedCurrency} onSubmit={handleBudgetSubmit} />
      ) : showPhoneInput ? (
        <PhoneInput defaultCountryRaw={detectedCountry} onSubmit={handlePhoneSubmit} />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={t('placeholder')}
            className="bg-transparent border-b border-cream/40 focus:border-cream py-md px-xs text-body font-sans text-cream placeholder:text-cream/40 outline-none transition disabled:opacity-40"
            autoFocus
            aria-label={t('input_label')}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="self-center font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md hover:bg-olive hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? t('sending') : t('send')}
          </button>
        </form>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
