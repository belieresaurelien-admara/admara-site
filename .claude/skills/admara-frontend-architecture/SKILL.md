---
name: admara-frontend-architecture
description: Conventions Next.js 14 App Router, structure de dossiers, perf budget, accessibilité, error boundaries, fallbacks pour le site ADMARA. Définit les patterns à respecter pour garder un stack léger, performant et accessible. Utiliser pour toute création de composant, page, route, configuration Tailwind, intégration Vercel.
---

# ADMARA Frontend Architecture

## Stack
- Next.js 14 App Router (TypeScript strict)
- Tailwind CSS v4 + tokens design system custom
- shadcn/ui (primitives uniquement, overridées)
- Vercel AI SDK 6 + AI Elements (pour Agent B)
- next-intl FR/EN
- Supabase JS client (READ-ONLY côté front, writes via Edge Functions)
- Plausible script + Vercel Analytics

## Structure de dossiers

```
admara-site/
├── app/
│   ├── [locale]/                  # next-intl (fr/en)
│   │   ├── page.tsx               # Home neutre
│   │   ├── creators/page.tsx      # Landing creators
│   │   ├── brands/page.tsx        # Landing brands
│   │   ├── pricing/page.tsx       # Pricing (sans Buy buttons)
│   │   ├── about/page.tsx         # About founders
│   │   ├── blog/                  # Articles SEO
│   │   ├── legal/                 # Privacy, terms, imprint
│   │   └── layout.tsx
│   ├── api/
│   │   ├── qualif/route.ts        # POST endpoint form DA
│   │   ├── agent-b/route.ts       # Streaming SSE Agent B
│   │   ├── agent-a/route.ts       # Streaming SSE Agent A (M2)
│   │   └── webhook/               # Webhooks (n8n, Cal.com, Stripe)
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── ai/
│   │   ├── AgentB.tsx             # Form DA conversationnel
│   │   ├── AgentA.tsx             # FAQ chat
│   │   ├── AgentMessage.tsx       # Composant message base
│   │   └── AgentFallback.tsx      # Si LLM down
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Nav.tsx
│   ├── home/
│   │   ├── Hero.tsx               # Hero neutre + split Creator/Brand
│   │   └── SplitChoice.tsx        # Vidéo bg + 2 CTA
│   ├── creators/
│   │   ├── HeroCreators.tsx
│   │   ├── WhyUs.tsx              # Preuve par méthode
│   │   ├── HowItWorks.tsx
│   │   ├── PricingCreators.tsx
│   │   └── CtaForm.tsx
│   ├── brands/
│   │   └── ...                    # Symétrique creators
│   └── shared/
│       ├── CookieBanner.tsx
│       ├── PhotoFrame.tsx         # Wrapper image avec crédit
│       └── VideoBackground.tsx    # Wrapper vidéo lazy + fallback
├── lib/
│   ├── ai/
│   │   ├── agent-b-config.ts      # System prompt, tools, model
│   │   ├── agent-a-config.ts
│   │   ├── rag.ts                 # Query Supabase pgvector
│   │   └── embeddings.ts          # Voyage AI client
│   ├── supabase.ts                # Client read-only
│   ├── analytics.ts               # Plausible + Vercel events
│   └── utils.ts
├── messages/
│   ├── fr.json
│   └── en.json
├── public/
│   ├── images/                    # Photos curées
│   ├── videos/                    # Vidéo hero (1 seule)
│   └── fonts/
├── scripts/
│   ├── index-kb.ts                # Indexation Obsidian → Supabase
│   └── eval-jailbreak.ts          # Eval suite Agent B
├── .claude/
│   └── skills/                    # 5 skills custom + publics
├── .mcp.json                      # MCP config projet
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

## Conventions de code

- **Server Components par défaut.** `'use client'` uniquement quand interactivité requise (Agent B, CookieBanner, A/B test trigger).
- **Pas de useEffect inutile.** Si tu peux faire en Server Component, fais-le.
- **Composition over props soup.** Préfère children passing à 10 props booléennes.
- **Zod côté serveur, types côté client.** `z.infer<typeof schema>` pour partager les types.
- **Tailwind tokens custom**, jamais de classes magiques (`bg-[#726D2D]` interdit, `bg-olive` obligatoire via config).
- **Pas de any TypeScript.** Strict mode activé.

## Perf budget (non-négociable)

- LCP < 2.5s desktop, < 3s mobile
- CLS < 0.05
- INP < 200ms
- Lighthouse ≥ 90 sur les 4 axes (Performance, Accessibility, Best Practices, SEO)
- JS bundle initial < 100kb gzipped (hors AI SDK)
- Polices : font-display: swap, preload des 2 familles uniquement

## Accessibilité (WCAG AA minimum)

- Contraste texte/fond ≥ 4.5:1 partout (olive sur cream OK, mais double-check)
- Toutes les images alt-textées (sauf décoratives = alt="")
- Hiérarchie h1>h2>h3 stricte
- Focus visible sur tous les éléments interactifs (ring olive 2px)
- Keyboard navigation complète (Agent B inclus — Tab pour parcourir messages)
- Skip-to-content link visible au focus

## Fallbacks obligatoires

- **Agent B LLM down** : composant `<AgentFallback />` avec Cal.com direct + email
- **Vidéo bg ne charge pas** : poster image en fallback (PhotoFrame avec crédit)
- **Supabase down** : page error 503 avec contact direct
- **n8n webhook timeout** : lead saved en table `leads_fallback` Supabase + retry queue Vercel cron

## Anti-patterns interdits

- localStorage / sessionStorage (cause Server Component breakage)
- React Context pour le state global (use server state ou Zustand léger si vraiment nécessaire)
- CSS-in-JS runtime (styled-components, emotion) — Tailwind suffit
- npm packages > 50kb sans justification écrite dans un commit message
- Inline styles
- Composants nommés "Wrapper", "Container", "Component"

## A/B test infrastructure (Vercel Edge Config)

```ts
// lib/ab-test.ts
import { get } from '@vercel/edge-config'

export async function getVariant(testName: string, userId: string) {
  const config = await get<{ variants: string[] }>(`ab_${testName}`)
  if (!config) return config?.variants[0]
  const hash = await sha256(userId + testName)
  const index = parseInt(hash.slice(0, 8), 16) % config.variants.length
  return config.variants[index]
}
```

Usage :
```tsx
const variant = await getVariant('signature_price', visitorId)
// variant = '990' | '890' | '1190'
```
