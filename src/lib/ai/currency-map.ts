/**
 * Mapping pays → devise et fourchettes de budget pour Agent B.
 *
 * Seules 6 devises sont gérées (USD, EUR, THB, GBP, AED, CNY).
 * Tous les autres pays retombent sur USD (référence).
 *
 * Taux indicatifs utilisés (figés ici, à recalculer manuellement si besoin) :
 *   1 USD ≈ 0,92 EUR ≈ 36 THB ≈ 0,79 GBP ≈ 3,67 AED ≈ 7,2 CNY
 *
 * Les montants des fourchettes sont arrondis pour la lisibilité, sans
 * séparateur de milliers (pas de virgule, pas d'espace fin).
 */

export type Currency = 'USD' | 'EUR' | 'THB' | 'GBP' | 'AED' | 'CNY';
export type Bracket = 'low' | 'mid' | 'high' | 'premium';

const COUNTRY_CURRENCY: Record<string, Currency> = {
  // EUR — zone euro uniquement
  france: 'EUR',
  belgique: 'EUR',
  allemagne: 'EUR',
  italie: 'EUR',
  espagne: 'EUR',
  'pays-bas': 'EUR',
  portugal: 'EUR',
  autriche: 'EUR',
  irlande: 'EUR',
  luxembourg: 'EUR',
  grece: 'EUR',
  finlande: 'EUR',
  // THB
  thailande: 'THB',
  thailand: 'THB',
  // GBP
  'royaume-uni': 'GBP',
  uk: 'GBP',
  angleterre: 'GBP',
  ecosse: 'GBP',
  // AED
  emirats: 'AED',
  'emirats arabes unis': 'AED',
  dubai: 'AED',
  'abu dhabi': 'AED',
  uae: 'AED',
  // CNY
  chine: 'CNY',
  china: 'CNY'
  // fallback USD pour tous les autres pays
};

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

/**
 * Retourne la devise associée à un pays. USD par défaut.
 * Tolère les variantes courantes (avec/sans accents, anglais/français).
 */
export function currencyFromCountry(raw: string): Currency {
  return COUNTRY_CURRENCY[normalize(raw)] ?? 'USD';
}

export const BRACKETS: Record<Currency, Record<Bracket, string>> = {
  USD: {
    low: '150 – 450 $',
    mid: '500 – 900 $',
    high: '1000 – 1500 $',
    premium: '1500 $ et plus'
  },
  EUR: {
    low: '140 – 410 €',
    mid: '460 – 830 €',
    high: '920 – 1380 €',
    premium: '1380 € et plus'
  },
  THB: {
    low: '5400 – 16000 ฿',
    mid: '18000 – 32000 ฿',
    high: '36000 – 54000 ฿',
    premium: '54000 ฿ et plus'
  },
  GBP: {
    low: '120 – 360 £',
    mid: '400 – 710 £',
    high: '790 – 1190 £',
    premium: '1190 £ et plus'
  },
  AED: {
    low: '550 – 1650 AED',
    mid: '1830 – 3300 AED',
    high: '3670 – 5500 AED',
    premium: '5500 AED et plus'
  },
  CNY: {
    low: '1080 – 3240 ¥',
    mid: '3600 – 6480 ¥',
    high: '7200 – 10800 ¥',
    premium: '10800 ¥ et plus'
  }
};

export const BRACKET_ORDER: Bracket[] = ['low', 'mid', 'high', 'premium'];

/**
 * Mappe un montant USD-équivalent saisi librement vers le bracket le plus proche.
 * Utilisé en fallback si l'utilisateur insiste avec une saisie libre.
 *
 * Bornes USD (centres des fourchettes) :
 *   low ≤ 450 USD
 *   mid ≤ 900 USD
 *   high ≤ 1500 USD
 *   premium > 1500 USD
 */
export function bracketFromUsdAmount(usd: number): Bracket {
  if (usd <= 450) return 'low';
  if (usd <= 900) return 'mid';
  if (usd <= 1500) return 'high';
  return 'premium';
}
