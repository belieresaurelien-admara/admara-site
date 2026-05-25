'use client';

import {useTranslations} from 'next-intl';
import {BRACKETS, BRACKET_ORDER, type Bracket, type Currency} from '@/lib/ai/currency-map';

type Props = {
  currency: Currency;
  onSubmit: (selection: {bracket: Bracket; currency: Currency; display_label: string}) => void;
};

/**
 * BudgetDropdown — 4 brackets affichés sous la dernière question agent (tour 6).
 *
 * - Le label affiché vient de BRACKETS[currency][bracket] (string déjà formatée).
 * - Le click envoie le label visible comme réponse user dans le chat ET capte
 *   le triplet {bracket, currency, display_label} pour submit_brief.
 * - Pas de saisie libre côté UI ; si l'utilisateur tape un montant libre, c'est
 *   le system prompt qui reformule la question (cf. agent-b-config.ts).
 */
export default function BudgetDropdown({currency, onSubmit}: Props) {
  const t = useTranslations('Service.agent.budgetDropdown');
  const labels = BRACKETS[currency];

  return (
    <div className="w-full max-w-[24rem] mx-auto flex flex-col gap-md">
      <p className="font-sans text-caption text-cream/50 text-center">
        {t('hint', {currency})}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        {BRACKET_ORDER.map((bracket) => {
          const label = labels[bracket];
          return (
            <button
              key={bracket}
              type="button"
              onClick={() =>
                onSubmit({bracket, currency, display_label: label})
              }
              aria-label={t('select_aria', {label})}
              className="font-sans text-body text-cream border border-cream/40 px-md py-md hover:border-olive hover:bg-olive hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/60 transition-colors"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
