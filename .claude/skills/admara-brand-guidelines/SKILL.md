---
name: admara-brand-guidelines
description: Applique l'identité de marque ADMARA Studio (palette olive/cream/sand/brick/ink, typo Cormorant Garamond + Tenor Sans + Jost Light, ratios 50/25/10/5/4) à tout artefact visuel — pages Next.js, composants, exports d'images, cards email. Utiliser à chaque création/refacto de composant UI, page, document export. Tokens définis dans BRAND_BOOK_v1.md (repo admara-internal, accès Aurélien uniquement).
license: Forked from anthropics/skills/brand-guidelines (MIT). Adapted for ADMARA Studio 2026-05-17.
---

# ADMARA Brand Styling

## Overview

Identité de marque ADMARA Studio : éditorial, sobre, méditerranéen-asiatique, posture prototype assumée. Aucun emoji, aucun superlatif, prose qui respire.

**Keywords**: branding, ADMARA identity, palette, typography, color tokens, brand book v1, post-processing, styling, visual formatting

## Brand Guidelines

### Colors (palette 5 tokens)

**Primary palette** (ratio d'usage indicatif sur tout le site) :

- **Olive** `#726D2D` — 25% : accents, CTA secondaires, traits, focus rings
- **Cream** `#F4EFE6` — 50% : fonds dominants, backgrounds neutres
- **Sand** `#D9CDB6` — 10% : sections de transition, cards secondaires
- **Brick** `#8E3A19` — 5% : rappels rares, hot accents (jamais en CTA principal)
- **Ink** `#0A0A0A` — 4% : texte principal, traits forts

**Règles d'usage** :
- Texte principal : `ink` sur `cream` (contraste ≥ 13:1 — WCAG AAA OK)
- Texte secondaire : `olive` sur `cream` (contraste ≥ 4.5:1 — WCAG AA OK, à double-check selon nuance)
- Hover/focus : olive 2px ring
- JAMAIS de violet, bordeaux, or, chromé, fluo
- JAMAIS de classes magiques Tailwind (`bg-[#726D2D]` interdit) — toujours via tokens du config (`bg-olive`)

### Typography

- **Cormorant Garamond** (serif éditorial) — H1 56-72px, H2 36-48px. Italics pour citations rares.
- **Tenor Sans** (sans fonctionnel) — H3-H6, body, UI, captions. Tailles 13/15/17/19.
- **Jost Light** (rare, optionnel) — micro-typo, labels secondaires, footer mentions

**Fallbacks** :
- Cormorant Garamond → "Garamond, Georgia, serif"
- Tenor Sans → "Helvetica Neue, Arial, sans-serif"
- Jost Light → "Helvetica Light, sans-serif"

**Loading** :
- `font-display: swap` obligatoire
- Preload des 2 familles principales (Cormorant + Tenor Sans), pas Jost
- Pas plus de 2 weights par famille (Regular + Light suffisent)

### Spacing & rhythm

- Section padding : `py-24` (96px) desktop, `py-16` (64px) mobile
- Container max-width : `max-w-6xl` (1152px)
- Letter-spacing :
  - Cormorant (serif) : tracking normal
  - Tenor Sans body : tracking normal
  - Tenor Sans uppercase labels : `tracking-wider` (0.05em)

### Motion

- 3-5 moments d'animation MAX sur tout le site
- 1 vidéo lookbook muette sur split Creator/Brand (Hero)
- Easing : `ease-out` 300ms par défaut
- Pas de scroll-triggered parallax tape-à-l'œil
- Pas de loader spinner — fallback skeleton screens via Tailwind animate-pulse

## Tone

Voir aussi `brand-voice` skill (Insightful Pipe) et `admara-conversion-philosophie` skill. Règles minimales :
- Aucun emoji
- Aucun superlatif (exceptionnel, unique, premium, ultime, parfait, magnifique)
- Phrases courtes. Rythme tenu.
- Posture prototype assumée — pas "agency since 2020"

## Smart Font Application (Tailwind config)

Dans `tailwind.config.ts`, exposer :

```ts
fontFamily: {
  serif: ['var(--font-cormorant)', 'Garamond', 'Georgia', 'serif'],
  sans: ['var(--font-tenor-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
  display: ['var(--font-jost)', 'Helvetica Light', 'sans-serif'],
},
colors: {
  olive: '#726D2D',
  cream: '#F4EFE6',
  sand: '#D9CDB6',
  brick: '#8E3A19',
  ink: '#0A0A0A',
}
```

Usage type :
```tsx
<h1 className="font-serif text-6xl text-ink">Le shoot que tu peux rentabiliser.</h1>
<p className="font-sans text-lg text-ink/80">Photographes locaux. Matchés à ta DA.</p>
<button className="bg-olive text-cream px-6 py-3 font-sans uppercase tracking-wider text-sm">
  Réserver
</button>
```

## Référence canonique

Brand book complet (incluant moodboards, refs photographes, exclusions exhaustives) : `BRAND_BOOK_v1.md` dans repo `admara-internal` (privé, accès Aurélien uniquement).
