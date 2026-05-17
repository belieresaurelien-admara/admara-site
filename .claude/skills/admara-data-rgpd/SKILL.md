---
name: admara-data-rgpd
description: Tracking, événements analytics, schéma cookie consent, pipeline data post-form, schéma Airtable Leads, conformité RGPD européenne pour ADMARA Studio. Définit ce qu'on capte, comment, où ça va, comment on respecte le RGPD. Utiliser pour toute implémentation tracking, formulaire, intégration tierce (Plausible, Vercel Analytics, Airtable, n8n).
---

# ADMARA Data & RGPD

## Stack analytics

- **Plausible Analytics** (9€/mois, plausible.io) : pageviews + events custom, RGPD-safe par défaut, dashboard simple
- **Vercel Analytics** (gratuit inclus) : A/B test edge + Core Web Vitals
- **Pas de Google Analytics**, jamais. Cookie-heavy, RGPD-complexe.
- **PostHog self-host** : seulement en M+6 si besoin session replay sur form DA

## Événements à capter

### Pageviews automatiques (Plausible)
- Toutes les pages

### Events custom (Plausible custom goals)
```js
plausible('Scroll Depth', { props: { depth: '50%' } })
plausible('CTA Click', { props: { label: 'Book Discovery Call', page: '/creators' } })
plausible('Form DA Started', { props: { source: '/creators' } })
plausible('Form DA Turn Completed', { props: { turn: 3, niche: 'wellness' } })
plausible('Form DA Submitted', { props: { score: 85 } })
plausible('Form DA Abandoned', { props: { turn: 4 } })
plausible('Cal.com Booking Confirmed', { props: { pack: 'Signature' } })
plausible('Pricing Variant Viewed', { props: { variant: '990' | '890' | '1190' } })
```

### A/B test Vercel (edge config)
- Variant assignation cookie-less (par hash IP)
- 3 variantes Signature pricing : 990€ / 890€ / 1190€
- Trigger A/B uniquement à partir de M3 (50 leads min/variante avant analyse)

### Core Web Vitals (Vercel auto)
- LCP < 2.5s
- CLS < 0.05
- INP < 200ms

## Cookie consent

**Tool** : Klaro (open source) ou CookieYes (free tier)

**Catégories** :
1. **Strictement nécessaires** (toujours actif) : session, CSRF, langue
2. **Analytics** (opt-in) : Plausible, Vercel Analytics — anonymisés par défaut donc OK même sans consent en EU stricte, mais on demande consent par prudence
3. **Marketing** (opt-in) : ConvertKit pixel (M+6 only)

**Bannière** :
- Apparition sur 1er visit, posée bas-droite, fond cream, bordure olive 1px
- 3 boutons : "Tout accepter" / "Refuser" / "Personnaliser"
- Tenor Sans 13px, ton ADMARA strict (pas de "nous utilisons des cookies pour améliorer votre expérience")
- Texte exact : "Quelques cookies pour comprendre comment tu utilises le site. Aucun tracking publicitaire."

## Schéma Airtable Leads (alimenté par n8n Agent 1)

| Champ | Type | Source |
|---|---|---|
| Lead ID | Auto | Airtable |
| Created at | DateTime | n8n insertion |
| Niche | Select (P1.1/1.2/1.3/Brand) | Agent B |
| Segment | Select (Creator / Brand) | Agent B |
| IG handle | String | Agent B |
| Refs (3 max) | Long text | Agent B |
| Budget range | Select | Agent B |
| Dates window | DateRange | Agent B |
| City | Select | Agent B |
| Source | Select (Organic/DM/Referral/Event/Other) | Tracking UTM |
| Score | Number 0-100 | Agent 1 scoring (Claude) |
| Status | Select (Lead/Qualified/Call/Quote/Won/Lost) | Workflow |
| Conversation transcript | Long text | Agent B |
| Discovery call date | DateTime | Cal.com webhook |
| Pack interested | Select (Discover/Signature/Editorial/Recurring/Brand_*) | Discovery call |
| Owner | User (Alyssia) | Default |
| Notes | Long text | Manual |

## Pipeline data flow

```
Form DA Agent B
  → POST /api/qualif (Zod validation + rate-limit + filter emoji)
  → Webhook n8n.admara-studio.com/qualif
  → Agent 1 — Lead Qualif Router
    → Claude API node : score 0-100 (niche fit, budget, refs quality)
    → Airtable Insert "Leads"
    → WhatsApp Alyssia (CallMeBot free ou Twilio 1c/msg)
    → Response 200 + Cal.com URL booking
  → Front : redirect to Cal.com avec data prefill
```

## Right to delete

Email contact@admara-studio.com → SOP manuel Alyssia (J60 SOP) :
1. Identifier le lead dans Airtable (par email/IG)
2. Soft-delete (status = "Deleted", purge fields PII)
3. Hard-delete via Agent n8n purge 30j après soft-delete
4. Réponse au demandeur sous 30j (obligation RGPD)

## Data retention

- Leads non convertis : 24 mois max → purge automatique Agent n8n
- Clients actifs : conservés tant qu'actifs + 5 ans après dernier shoot
- Conversation transcripts Agent B : anonymisés après 90j (PII strip)
- Logs serveur : 30j max
