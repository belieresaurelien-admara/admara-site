'use client';

import {useChat} from '@ai-sdk/react';
import {DefaultChatTransport} from 'ai';
import {useState, useMemo, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import AgentFallback from './AgentFallback';

const REDIRECT_DELAY_MS = 2500;

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

export default function AgentB() {
  const t = useTranslations('Service.agent');
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      window.location.href = calUrl;
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
  const currentAgent = [...messagesList]
    .reverse()
    .find((m) => m.role === 'assistant');
  const previous = messagesList.filter((m) => m !== currentAgent);

  const isInitial = messagesList.length === 0;
  const initialPrompt = t('initial_prompt');

  return (
    <div className="w-full max-w-[36rem] mx-auto flex flex-col gap-lg">
      {previous.length > 0 && (
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
        key={currentAgent?.id || 'initial'}
        className="font-sans text-h3 text-cream text-center leading-snug min-h-[5rem] animate-[fadeIn_300ms_ease-out]"
      >
        {isInitial ? initialPrompt : getText(currentAgent || {} as UIMessage)}
      </p>

      {submitted ? (
        <div className="flex flex-col items-center gap-md">
          <p className="font-sans text-body text-cream/90 text-center">
            {t('confirmation')}
          </p>
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-caption uppercase tracking-[0.05em] bg-cream text-ink px-xl py-md text-center hover:bg-olive hover:text-cream transition-colors"
          >
            {t('cta_cal')}
          </a>
        </div>
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
