# ADMARA Studio — Guide de setup complet (zéro → prod)

Guide pédagogique pas-à-pas. **Lis chaque section AVANT de copier-coller.** À chaque commande il y a une explication. À chaque "PAUSE", tu reviens me dire "fait" pour que je continue.

**Légende :**
- 🧑 **TOI** : action manuelle à faire dans le navigateur ou le terminal
- 🤖 **MOI** : je fais ça automatiquement dès que tu dis "go"
- ⏸ **PAUSE** : arrête-toi, reviens me confirmer avant de continuer

---

## 📋 Décisions à valider AVANT toute action

### 1. ~~Username GitHub effectif~~ ✅ RÉSOLU
Username confirmé = `belieresaurelien-admara`. Tous les repos seront sous cet username.

### 2. Migration des docs vers `_internal/`
Le dossier parent `ADMARA studio/` contient déjà :
- `admara-ops/`
- `PLAN_60J/`
- `Pricing/`
- `brand-assets/`
- `brochure/`
- `CONTENT_TEMPLATES/`

→ Tu veux **tout** migrer dans le nouveau `_internal/` (qui deviendra le repo admara-internal) ? Ou seulement certains dossiers ?

---

## PHASE A — Outils système (15 min — 🧑 TOI)

### A.1 — Installer Homebrew (gestionnaire de paquets macOS)

**Pourquoi :** Homebrew permet d'installer des outils ligne de commande proprement (gh, cloudflared, jq, etc.).

**Comment :**
1. Ouvre le Terminal (Cmd+Espace → tape "Terminal" → Entrée)
2. Colle cette commande et appuie Entrée :
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Le terminal va demander ton mot de passe Mac (celui de ta session). Tape-le (rien ne s'affiche, c'est normal), puis Entrée.
4. L'installation prend 3-5 min. À la fin il te montre **2 commandes "Next steps"** — copie-les et exécute-les pour ajouter brew au PATH. Sur Apple Silicon (M1/M2/M3/M4) ça ressemble à :
   ```bash
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/opt/homebrew/bin/brew shellenv)"
   ```
5. Vérifie :
   ```bash
   brew --version
   ```
   → Doit afficher `Homebrew 4.x.x`.

### A.2 — Installer gh, cloudflared, jq

**Pourquoi :**
- `gh` = GitHub CLI (créer/gérer repos, PAT, secrets en CLI)
- `cloudflared` = client Cloudflare Tunnel (sécuriser n8n derrière Access)
- `jq` = parser JSON (utile pour les réponses API Cloudflare/Supabase)

**Comment :** une seule commande :
```bash
brew install gh cloudflared jq
```
Ça prend 1-2 min.

### A.3 — Login GitHub CLI

```bash
gh auth login
```
Choisis :
- `GitHub.com`
- `HTTPS`
- `Login with a web browser` → copie le code 8 caractères affiché → Entrée → un navigateur s'ouvre → colle le code → autorise.

Vérifie :
```bash
gh auth status
```
→ Doit afficher `Logged in to github.com as <ton-username>`.

⏸ **PAUSE A** — Reviens me dire "Phase A OK" + ton username GitHub effectif.

---

## PHASE B — Création des comptes & clés API (45 min — 🧑 TOI)

Tu vas créer plusieurs comptes et collecter des clés. **Mets tout dans 1Password** (ou un fichier `.env.local` que tu mets dans `.gitignore` si tu n'as pas 1Password — on fait ça à la fin de la phase).

### B.1 — Supabase (projet admara-prod)

1. Va sur https://supabase.com → "Start your project" → connecte-toi avec `belieres.aurelien@gmail.com` (créer compte si besoin).
2. "New project" :
   - **Name** : `admara-prod`
   - **Database Password** : clique "Generate a password" → **copie-le immédiatement dans 1Password** sous "Supabase admara-prod — DB password".
   - **Region** : `Europe West (Ireland) — eu-west-1`
   - **Pricing plan** : Free
3. Clique "Create new project". Attends 2 min que le projet soit provisionné.
4. Une fois prêt, va dans **Settings (icône engrenage) → General → Reference ID** → copie le ref (style `abcdefghijklmnop`) → 1Password sous "Supabase admara-prod — project ref".
5. **Settings → API** :
   - Copie `URL` (ex: `https://xxx.supabase.co`) → 1Password sous "Supabase admara-prod — URL"
   - Copie `anon public` key → 1Password sous "Supabase admara-prod — anon key"
   - Copie `service_role` key (clique "Reveal") → 1Password sous "Supabase admara-prod — service_role" **(jamais en client !)**
6. **Settings → Access Tokens** (haut à droite menu profil → Access Tokens) :
   - Clique "Generate new token"
   - Name : `admara-mcp-readonly`
   - Scope : sélectionne uniquement le projet `admara-prod`
   - Copie le token → 1Password sous "Supabase — PAT MCP readonly"

### B.2 — Voyage AI (embeddings pour RAG)

1. Va sur https://www.voyageai.com → Sign up avec `belieres.aurelien@gmail.com`.
2. Une fois loggué → Dashboard → API Keys → Create new key.
3. Name : `admara-prod`. Copie la clé → 1Password sous "Voyage AI — API key".

### B.3 — Anthropic Console (Claude API)

1. Va sur https://console.anthropic.com → Sign up avec `belieres.aurelien@gmail.com`.
2. **Settings → Billing** : ajoute une carte. **Pré-charge 20€ pour démarrer.**
3. **Settings → Plans & billing → Usage limits** : configure un **monthly limit de 30€** (pour M1-M3 selon plan).
4. **Settings → API Keys** → Create Key :
   - Name : `admara-site-prod`
   - Copie la clé `sk-ant-...` → 1Password sous "Anthropic — admara-site-prod".

### B.4 — Cloudflare API token (zone admara-studio.com)

1. Va sur https://dash.cloudflare.com → connecte-toi avec `belieres.aurelien@gmail.com`.
2. **Vérifie** que la zone `admara-studio.com` est bien là (devrait apparaître sur la page d'accueil).
3. Menu profil (haut droite) → **My Profile → API Tokens → Create Token**.
4. Template : "Edit zone DNS" → "Use template".
   - Permissions : Zone → DNS → Edit ; Zone → Zone → Read ; Zone → Workers Routes → Edit
   - Zone Resources : `Include → Specific zone → admara-studio.com`
   - Continue to summary → Create Token
   - Copie le token → 1Password sous "Cloudflare — API token admara-studio.com".
5. **Ajoute-le à ton shell** pour que je puisse l'utiliser :
   ```bash
   echo 'export CLOUDFLARE_API_TOKEN="colle-le-token-ici"' >> ~/.zshrc
   echo 'export CLOUDFLARE_ZONE_ID="8b014e3bcf4dbe6f4e56fd97328265c4"' >> ~/.zshrc
   source ~/.zshrc
   ```

### B.5 — GitHub PAT fine-grained (pour MCP + GitHub Actions)

⚠️ **À faire APRÈS la phase C.2 et C.4** (création des repos `admara-internal` et `admara-kb`), car le PAT scope ces repos par nom.

→ On reviendra dessus à la fin de la phase C.

### B.6 — Vérification finale

Liste tes secrets dans 1Password (devrait y avoir 8 entrées à ce stade) :
- ☐ Supabase — DB password
- ☐ Supabase — project ref
- ☐ Supabase — URL
- ☐ Supabase — anon key
- ☐ Supabase — service_role
- ☐ Supabase — PAT MCP readonly
- ☐ Voyage AI — API key
- ☐ Anthropic — admara-site-prod
- ☐ Cloudflare — API token

⏸ **PAUSE B** — Reviens me dire "Phase B OK" quand tout est dans 1Password. Donne-moi **uniquement le `project ref` Supabase** dans le chat (pas une clé, juste l'identifiant projet).

---

## PHASE C — Repos GitHub + backup auto (15 min — 🤖 MOI)

Quand tu dis "go Phase C", je fais automatiquement :

### C.1 — Aligner le remote du repo `admara-site` (si username GitHub différent)
Selon ta réponse à la décision #1.

### C.2 — Créer `admara-internal` (privé)
```bash
mkdir _internal && cd _internal
git init
# README + structure
gh repo create belieresaurelien-admara/admara-internal --private --source=. --push
```

### C.3 — Migrer les docs business
Selon ta décision #2, je déplace les dossiers choisis depuis le parent vers `_internal/`.

### C.4 — Créer `admara-kb` (privé)
Pour l'instant en local vide. Le contenu viendra après que tu créés le vault Obsidian (phase G).

### C.5 — Launchd backup hourly
Je crée et charge `~/Library/LaunchAgents/com.admara.backup-internal.plist`.

### C.6 — Génération PAT GitHub fine-grained (B.5)

🧑 **Action manuelle** (je ne peux pas créer un PAT à ta place) :
1. https://github.com/settings/personal-access-tokens/new
2. Token name : `admara-mcp-stack`
3. Expiration : 1 year
4. Repository access : "Only select repositories" → sélectionne `admara-site`, `admara-internal`, `admara-kb`
5. Permissions :
   - Contents : Read and write
   - Pull requests : Read and write
   - Issues : Read and write
   - Workflows : Read
   - Secrets : Read and write (pour pouvoir set les secrets via API)
6. Generate token → copie → 1Password sous "GitHub PAT — admara-stack".

⏸ **PAUSE C** — Phase C terminée quand le PAT est créé.

---

## PHASE D — Stack MCP (10 min — 🤖 MOI + 🧑 OAuth)

🤖 Je crée `.mcp.json` à la racine avec les 5 serveurs.

🧑 **OAuth manuel** pour Vercel et GitHub :
- Au prochain lancement de Claude Code dans ce dossier, des URLs OAuth s'ouvriront. Tu cliques "Authorize".

⏸ **PAUSE D** — Confirme connexion OK pour les 5 serveurs.

---

## PHASE E — Skills (10 min — 🤖 MOI)

🤖 J'installe automatiquement (clone, copie, édite) :
- 3 publics : `frontend-design`, `marketingskills` (sélection), `brand-voice`
- 1 fork : `admara-brand-guidelines` (avec swap tokens depuis [project-admara-brand](memory))
- 5 custom : `admara-ai-agent-persona`, `admara-photo-curation`, `admara-data-rgpd`, `admara-conversion-philosophie`, `admara-frontend-architecture` (source : PHASE_4_LIVRABLE_v1.md section 6.3)

⏸ **PAUSE E** — Tu valides un SKILL.md au hasard pour confirmer cohérence.

---

## PHASE F — Site Next.js (3-4h de dev — 🤖 MOI étape par étape)

Étape par étape selon PHASE_4_LIVRABLE_v1.md :
- **F.1** Tailwind config + design tokens
- **F.2** Home + split Creator/Brand + vidéo BG
- **F.3** Pages pricing + about + legal
- **F.4** Supabase schema + pgvector + Edge Functions
- **F.5** Agent B (form DA conversationnel, règle "1 question à la fois")
- **F.6** Pipeline RAG Obsidian → Supabase

À chaque étape je te montre le résultat et tu valides avant la suivante.

---

## PHASE G — Knowledge base Obsidian (30 min — 🧑 TOI)

### G.1 — Installer Obsidian
- Va sur https://obsidian.md → Download for Mac → install.
- Au premier lancement → Create new vault :
  - Name : `admara-vault`
  - Location : `~/Documents/Obsidian/admara-vault`
- Dans le vault, crée le dossier `marketing-kb/`.

### G.2 — Plugin obsidian-git
- Settings (engrenage en bas gauche) → Community plugins → "Turn on community plugins" → Browse → "Obsidian Git" → Install → Enable.
- Options du plugin :
  - Vault backup interval : `10`
  - Auto push interval : `10`
  - Pull on startup : OFF
  - Commit message : `kb update {{date}}`

### G.3 — Lier le sous-dossier au repo admara-kb
🤖 Je m'occupe de la partie git du `marketing-kb/` (init + remote + push initial). Tu n'as qu'à créer le vault et installer obsidian-git.

⏸ **PAUSE G** — Reviens quand vault créé + plugin actif.

---

## PHASE H — Sécurité n8n + Cloudflare (30 min — 🧑 TOI surtout)

**PRÉREQUIS** : VPS Hetzner avec n8n déjà installé. Si pas le cas, dis-le moi, on reporte.

### H.1 — Tunnel Cloudflare devant n8n
🧑 Sur dash.cloudflare.com → Zero Trust → Tunnels → Create → name `admara-n8n` → copie le token.
🧑 SSH sur ton VPS Hetzner :
```bash
ssh root@<ton-IP-VPS>
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
dpkg -i cloudflared.deb
cloudflared service install <TOKEN>
```
🧑 Sur Cloudflare dashboard → Tunnel → Public hostname → Add :
- Subdomain : `n8n` / Domain : `admara-studio.com` / Type : `HTTP` / URL : `localhost:5678`

### H.2 — Access policy (auth obligatoire)
🧑 Cloudflare → Zero Trust → Access → Applications → Add :
- Type : Self-hosted
- Name : `n8n Admara` / Subdomain `n8n` / Domain `admara-studio.com`
- Identity providers : Email OTP
- Policy "Founders only" : emails `belieres.aurelien@gmail.com` + `alyssia@admara-studio.com` ; session 8h ; require MFA

### H.3 — Désactive IP publique n8n
🧑 SSH VPS → édite `/opt/admara/docker-compose.yml` : `ports: ['0.0.0.0:5678:5678']` → `['127.0.0.1:5678:5678']` → `docker-compose down && docker-compose up -d`.

### H.4 — Cloudflare WAF
🧑 Cloudflare → admara-studio.com → Security → WAF :
- Managed Rules (OWASP) : ON
- Bot Fight Mode : ON
- Leaked Credentials Check : ON
- Custom rules :
  - `rate-limit-qualif` : path `/api/qualif` → 4 req/min/IP → Managed Challenge
  - `rate-limit-api` : path `/api/*` → 30 req/min/IP → Managed Challenge

---

## PHASE I — Tracking + cookie banner + tests + déploiement (🤖 MOI)

- I.1 Cookie banner RGPD
- I.2 Lighthouse + e2e Playwright
- I.3 Vercel domain custom `admara-studio.com`
- I.4 DNS Cloudflare → Vercel
- I.5 Smoke test prod
- I.6 Tag release v1.0.0

---

## 🚨 Règles d'or à NE JAMAIS oublier

1. **service_role Supabase** = SERVEUR UNIQUEMENT. Si tu le vois dans `/components/*` ou un `'use client'`, ALERTE.
2. **admara-internal repo PRIVÉ** = jamais de push public. Margins, coûts photographes, plan maître restent dedans.
3. **MCP Supabase** = TOUJOURS `--read-only`. Pour écrire, on passe par les Edge Functions avec service_role serveur.
4. **n8n** = derrière Cloudflare Tunnel + Access, **JAMAIS** d'IP publique.
5. **Aucun emoji** dans le copy du site (brand voice strict).
6. **Aucune image AI-générative** sur le site (risque légal droit à l'image).
7. **Agent B** : règle UNE question à la fois. Si le test détecte 2 "?" dans une réponse → FAIL.

---

## 🆘 Si quelque chose foire

Reviens me dire **textuellement** :
- Quelle phase / étape
- La commande exacte que tu as lancée
- Le message d'erreur complet

**Ne tente pas de fix toi-même.** On débugge ensemble.
