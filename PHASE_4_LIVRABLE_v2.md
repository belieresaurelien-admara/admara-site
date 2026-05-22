# PHASE 4 — LIVRABLE v2

**Pivot du modèle économique — 2026-05-15.**
Annule et remplace `PHASE_4_LIVRABLE_v1_legacy.md` (modèle packages SEA).
Compagnon : `PIVOT_BRIEF_v1.md` (dans le repo privé `admara-internal`).

---

## 1. Vision

ADMARA est un **intermédiaire concierge mondial** qui met en relation des clients ayant un projet créatif, professionnel ou personnel avec des photographes ou vidéastes sélectionnés. ADMARA prend en charge **toute la logistique** (recherche talent, ordre de mission, planche moodboard, coordination, paiement, SAV) en échange d'une **commission interne de 10 % sur le montant total facturé client**.

### Règles strictes du site public

- **Aucun prix, aucun tarif, aucun pourcentage, aucune mention de commission** n'apparaît jamais sur le site public.
- Le levier de conversion repose entièrement sur la gratuité du Discovery Call et la gratuité de la rédaction de l'ordre de mission + moodboard.
- ADMARA opère **partout dans le monde**. Aucune mention géographique restrictive ("Currently in Bangkok", "Tournée SEA", etc.).
- Cible large : projet professionnel (marque, agence, indépendant), créatif (créatrice, marque personnelle, éditorial) ou personnel (mariage, événement, portrait structuré).

### Posture éditoriale (inchangée v1)

- Brand book v1 : palette olive/cream/sand/brick/ink, Cormorant Garamond + Tenor Sans.
- Ton strict : aucun emoji, aucun superlatif, phrases courtes.
- Posture "prototype assumé" — on démarre, on est deux, on construit en transparence.
- Stripe caché : paiement géré par ADMARA, jamais de bouton "Buy now" public.

---

## 2. Architecture du site (3 pages)

| Route | Statut | Contenu |
|---|---|---|
| `/` | ✅ existante, conservée | Home hero vidéo (`video-landing-page-{desktop,phone}.mp4`), H1 + sub + 1 CTA vers `/service` |
| `/service` | ✅ créée (commit 7cab3b7) | Hero / Audiences / HowItWorks (5 étapes) / WhyUs (4 piliers) / Agent B embarqué |
| `/admara` | ✅ créée (commit 2581c34) | Hero / Why / Team (2 fondateurs) / Method (4 piliers) / CTA vers `/service` |

Navigation header : **Accueil (/) · Le Service (/service) · ADMARA (/admara)**
Footer : 3 liens legal + contact (`alyssia@admara-studio.com`, `@admara.studio`).

Pages **supprimées** lors du pivot : `/creators`, `/brands`, `/pricing` (et toute leur composantique).

---

## 3. Stack MCP (inchangé)

Cf. `INSTALL_PROMPT_v2.md` et `SETUP_GUIDE.md`. Les 5 serveurs MCP du projet :

1. **context7** — doc framework à jour
2. **shadcn** — désactivé (pas d'endpoint MCP officiel)
3. **vercel** — OAuth (deploy / runtime logs)
4. **github** — npm `@modelcontextprotocol/server-github` + PAT fine-grained
5. **supabase** — `--read-only`, project ref `uxuiqipaqaczjkzkfjnk`

État au commit `dd7c82a` : 3/5 MCPs actifs (context7, vercel, supabase). github en attente fix doc.

---

## 4. Agents IA

### Agent B — collecteur de brief (sur `/service`)

Mission : collecter un brief projet en 6 à 9 tours de conversation pour le transmettre à Alyssia.

Output : tool call `submit_brief(payload)` avec schema Zod (cf. `src/lib/ai/agent-b-config.ts`) :

```ts
{
  project_type: 'professional' | 'creative' | 'personal' | 'other',
  objective: string,
  deliverables: { photo, video, approximate_quantity },
  location: { city, country },
  dates_window: { start, end, flexibility },
  budget_range: string,
  vision: { references[], style_keywords[], freeform_description },
  constraints: string,
  contact: { name, email }
}
```

Garde-fous (cf. skill `admara-ai-agent-persona`) :
- Aucune mention de commission, de prix, de pourcentage. Refus poli + redirection Cal.com.
- Une question à la fois, max 25 mots par question.
- Résistance aux injections de prompt.

Stack technique : `ai@6` (Vercel AI SDK) + `@ai-sdk/anthropic` + `@ai-sdk/react useChat` + `claude-haiku-4-5-20251001` (coût optimisé).

### Agent A — FAQ (futur, M2)

Pas inclus dans le pivot. Skill `admara-ai-agent-persona` couvre déjà le système prompt commun.

---

## 5. Pipeline data

### Aujourd'hui (commit 7cab3b7)

```
Visiteur sur /service
  → Agent B (streaming SSE depuis /api/agent-b)
  → submit_brief(payload) via tool call
  → POST /api/brief
    → Zod validation
    → console.log structured brief (MVP — pas de DB encore)
  → Front : message "Brief transmis" + bouton Cal.com
```

### Cible (post Phase G — RAG + Supabase)

```
/api/brief
  → Insert Supabase `briefs` (RLS strict)
  → Forward webhook n8n `/qualif`
    → Agent 1 (Claude) scoring 0-100
    → Insert Airtable `Missions` (Alyssia)
    → Notification WhatsApp Alyssia
    → Email auto au client (Resend / SMTP) avec lien Cal.com
  → Front : redirect Cal.com avec data prefill
```

### À configurer côté infra (Phase suivante)

- `.env.local` (gitignored) : `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_CAL_URL`, `BRIEF_RECIPIENT_EMAIL`
- Cal.com workspace ADMARA + event `discovery-call` 30 min
- Email transactionnel : Resend (sender `alyssia@admara-studio.com`)
- Plus tard : Supabase tables `briefs` + `missions` + `photographers` + RLS

---

## 6. Skills

`.claude/skills/` au commit `dd7c82a` (12 skills) :

| Skill | Type | Statut pivot |
|---|---|---|
| `admara-brand-guidelines` | Fork Anthropic | inchangé |
| `admara-frontend-architecture` | Custom | inchangé |
| `admara-photo-curation` | Custom | inchangé |
| `admara-data-rgpd` | Custom | inchangé |
| `admara-conversion-philosophie` | Custom | **réécrit** — pivot (plus de pricing/packages) |
| `admara-ai-agent-persona` | Custom | **réécrit** — Agent B = collecteur de brief, tool `submit_brief` |
| `admara-mission-order` | Custom | **nouveau** — templates ordre de mission + moodboard |
| `brand-voice` | Insightful Pipe | inchangé — adaptation au ton ADMARA en attente |
| `frontend-design` | Anthropic public | inchangé |
| `conversion-copywriting` | Corey Haines | inchangé |
| `cro-optimization` | Corey Haines | inchangé |
| `ai-seo` | Corey Haines | inchangé |
| `marketing-analytics` | Corey Haines | inchangé |

---

## 7. Plan d'exécution (post-pivot)

### Accompli (sessions 2026-05-15 → 2026-05-18)

- [x] Phases A-E du setup initial (outils, comptes, repos, MCP, skills) — cf. SETUP_GUIDE.md
- [x] F.1 Tailwind tokens v4 + globals.css (palette + typo)
- [x] F.2 Layout components (Header + Footer + LanguageSwitcher)
- [x] F.3 Home avec hero vidéo + 1 CTA
- [x] Pivot — suppression Creators/Brands, simplification nav (commit `ef8e9a0`)
- [x] Pivot — skills réécriture + admara-mission-order (commit `dd7c82a`)
- [x] Pivot — page `/admara` 5 sections (commit `2581c34`)
- [x] Pivot — page `/service` 5 sections + Agent B full implementation (commit `7cab3b7`)

### À faire (prochaines sessions)

- [ ] `.env.local` : ajouter `ANTHROPIC_API_KEY` (utilisateur — depuis 1Password)
- [ ] Cal.com : créer event `discovery-call` 30 min + configurer `NEXT_PUBLIC_CAL_URL`
- [ ] Test conversationnel complet Agent B + audit jailbreak (skill `admara-ai-agent-persona` section "Eval jailbreak suite")
- [ ] Pages legal : `/legal/privacy`, `/legal/terms`, `/legal/imprint`
- [ ] Supabase schema + tables `briefs`, `missions`, `photographers` + RLS
- [ ] Email transactionnel : intégrer Resend pour forward du brief vers Alyssia
- [ ] Cookie banner RGPD (Klaro ou CookieYes) + tracking Plausible
- [ ] Knowledge base Obsidian sync + indexation Voyage AI → Supabase pgvector
- [ ] Cloudflare WAF + rate-limit `/api/agent-b` + `/api/brief`
- [ ] Lighthouse + Playwright e2e
- [ ] Mise en ligne `admara-studio.com` via Vercel + DNS Cloudflare

---

## 8. Décisions et arbitrages (pivot 2026-05-15)

| Décision | Choix |
|---|---|
| Segmentation | UN seul flux unique (plus de Creators/Brands) |
| Prix sur le site | Aucun (commission interne 10 %, jamais affichée) |
| Périmètre géographique | Monde entier (pas de tournée SEA) |
| Page Home `/` | Conservée telle quelle (hero vidéo) |
| Pages supprimées | `/creators`, `/brands`, `/pricing` |
| Pages créées | `/service` (avec Agent B), `/admara` (présentation) |
| Agent B output | `submit_brief(payload)` au lieu de `submit_qualification` |
| Modèle Claude | `claude-haiku-4-5-20251001` (coût + perf) |
| Conversion site → Agent | Sur `/service` uniquement |
| Tutoiement / vouvoiement | Tutoiement par défaut, vouvoiement sur `/admara` |

---

## 9. Liens utiles

- `PIVOT_BRIEF_v1.md` (repo privé admara-internal) — brief du pivot et arbitrages stratégiques
- `SETUP_GUIDE.md` — setup système et infra
- `INSTALL_PROMPT_v2.md` — prompt setup canonique (archive référence)
- `PHASE_4_LIVRABLE_v1_legacy.md` — ancien plan (archive)
- `brand-assets/admara-ton-universel.md` — charte de ton rédigée par Aurélien
- `.claude/skills/admara-mission-order/SKILL.md` — templates ordre de mission + moodboard
