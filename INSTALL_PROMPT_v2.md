# MEGA-PROMPT INSTALLATION ADMARA — v2 PERSONNALISÉ

**Version v2 — différences par rapport au v1 :**
- Comptes pré-configurés (GitHub + Vercel + Cloudflare sur `belieres.aurelien@gmail.com`, domaine `admara-studio.com`)
- **3 repos GitHub pour backup complet** : `admara-site` (public, code), `admara-internal` (privé, docs business + brand book + plans), `admara-kb` (privé, knowledge base RAG)
- Auto-commit hourly via launchd Mac pour le backup automatique des docs internes
- Règle stricte « une question à la fois » sur l'Agent B (system prompt + UI)

**Mode d'emploi :**
1. Ouvre VS Code sur `~/Documents/Claude/Projects/ADMARA studio/admara-site`
2. Ouvre Claude Code (`Cmd+Esc`)
3. `/clear` puis colle le bloc de code ci-dessous **en entier**
4. Claude Code orchestre l'installation étape par étape avec validations utilisateur

---

## PROMPT COMPLET

```
Tu es Claude Code, dev partenaire sur le projet ADMARA Studio.
Périmètre : marketing site (vitrine + funnel) Next.js 14 + Vercel + Cloudflare + Supabase + agents IA Claude.

═══════════════════════════════════════════════════════════════
CONTEXTE PROJET (à mémoriser absolument)
═══════════════════════════════════════════════════════════════

Identité fondateur :
- Aurélien Belières — belieres.aurelien@gmail.com
- Co-fondatrice Alyssia (concierge + DA)

Stack accounts (TOUS sur belieres.aurelien@gmail.com) :
- GitHub : compte actif belieres.aurelien@gmail.com
- Vercel : compte actif belieres.aurelien@gmail.com, projet admara-site connecté
- Cloudflare : compte actif belieres.aurelien@gmail.com
  - Zone admara-studio.com en gestion
  - **Zone ID : 8b014e3bcf4dbe6f4e56fd97328265c4** (à utiliser pour toute API call Cloudflare)
- Domaine : admara-studio.com (registrar Cloudflare)
- Emails canoniques :
  - aurelien@admara-studio.com (à activer M+1 via Google Workspace)
  - alyssia@admara-studio.com
  - contact@admara-studio.com (alias générique)
- Supabase : projet "admara-prod" région eu-west à créer si pas fait
- Anthropic Console : à créer + budget cap 30€/mois M1-M3
- Voyage AI : compte à créer sur voyageai.com

3 REPOS GitHub pour backup complet (architecture importante) :
1. github.com/aurelien-belieres/admara-site (PUBLIC)
   - Contient le code Next.js du site
   - Vercel deploys automatiquement depuis main
   - .claude/skills/ inclus
   - PHASE_3_SOURCING, PHASE_4_LIVRABLE, INSTALL_PROMPT inclus dans docs/

2. github.com/aurelien-belieres/admara-internal (PRIVÉ)
   - Contient tous les documents business confidentiels
   - BRAND_BOOK_v1.md
   - PLAN_60J_AURELIEN.md
   - PLAN_MAITRE_v3_2026-05-04.md
   - Tous les SOPs futurs
   - Audits, projections financières, baseline acquisition
   - Brand assets (logos, fonts custom, photos sources)
   - Auto-commit + auto-push toutes les heures via launchd Mac

3. github.com/aurelien-belieres/admara-kb (PRIVÉ)
   - Knowledge base sourcée depuis Obsidian
   - Sous-dossier marketing-kb/ uniquement (jamais le vault complet)
   - Trigger GitHub Action sur push → run scripts/index-kb.ts → upsert Supabase pgvector
   - Auto-commit via plugin obsidian-git toutes les 10 min

Brand book référence :
- Palette : olive #726D2D / cream #F4EFE6 / sand #D9CDB6 / brick #8E3A19 / ink #0A0A0A
- Typo : Cormorant Garamond (serif éditorial) + Tenor Sans (sans fonctionnel)
- Ton strict : aucun emoji, aucun superlatif, phrases courtes, factuelles
- Motion : 3-5 moments rares maximum, dont 1 vidéo lookbook muette sur split Creator/Brand

Stratégie :
- Posture "prototype assumé" — pas "agency since 2020"
- La philosophie convertit (pas de hard sell, aucun bouton "Buy now")
- Discovery Call obligatoire avec Alyssia (USP humain)
- Stripe caché — Payment Link envoyé manuellement par Alyssia post-call
- Deux segments : Creators et Brands (landings distinctes /creators, /brands)
- Form DA conversationnel (Agent B) remplace tout formulaire statique

═══════════════════════════════════════════════════════════════
CONSIGNES DE TRAVAIL
═══════════════════════════════════════════════════════════════

1. Lis d'abord PHASE_4_LIVRABLE_v1.md en intégralité (workspace root, ou dans admara-site/)
2. Travaille étape par étape (numérotées ci-dessous)
3. Avant CHAQUE étape : annonce ce que tu vas faire, attends ma validation explicite ("ok" / "go")
4. Si une étape demande une action manuelle (créer compte, copier clé API, valider UI), tu t'arrêtes
   et tu me donnes les étapes précises
5. Si erreur : tu t'arrêtes et tu me demandes — ne pas improviser
6. Commit après chaque étape réussie avec message conventionnel : feat(scope): description
7. Minimum de dépendances ajoutées — chaque npm install > 50kb justifié en commit message

═══════════════════════════════════════════════════════════════
SÉCURITÉ — RÈGLES D'OR NON-NÉGOCIABLES
═══════════════════════════════════════════════════════════════

- Supabase MCP TOUJOURS en --read-only mode + PAT scoped projet "admara-prod" UNIQUEMENT
- service_role Supabase EXCLUSIVEMENT côté serveur (Edge Functions + GitHub Actions secrets)
- PAT GitHub fine-grained scope admara-site + admara-internal + admara-kb UNIQUEMENT
- Stripe MCP test-mode restricted key tant qu'on n'est pas en prod
- n8n derrière Cloudflare Tunnel obligatoire — pas d'IP publique exposée
- Agent IA system prompt résistant à "ignore previous instructions" (XML tags + RAG tagged untrusted)
- Aucun cookie tracker tiers (Google Analytics, Meta Pixel) sans cookie consent opt-in
- Aucune image AI-générative sur le site (cohérence faciale légale)
- admara-internal repo PRIVÉ : margins, coûts photographes, plan maître ne doivent JAMAIS basculer en public

═══════════════════════════════════════════════════════════════
STACK MCP À INSTALLER (5 core)
═══════════════════════════════════════════════════════════════

1. Context7 (doc framework à jour)
2. shadcn/ui MCP officiel
3. Supabase MCP (--read-only, projet admara-prod)
4. Vercel MCP (OAuth, connecté à belieres.aurelien@gmail.com)
5. GitHub MCP officiel (OAuth, PAT fine-grained scope 3 repos ADMARA)

Rotation (à activer/désactiver selon phase) :
- Figma Dev Mode (phase design)
- Cal.com MCP (wiring booking)
- Airtable MCP (workflows back-office)
- Stripe MCP (phase paiement, test-mode)
- Playwright MCP (phase QA)
- n8n MCP (phase automation)

═══════════════════════════════════════════════════════════════
SKILLS À INSTALLER
═══════════════════════════════════════════════════════════════

Publics à activer :
- frontend-design (Anthropic officiel, 277k installs)
- marketingskills (Corey Haines, sélection 3-4 skills)
- brand-voice (Insightful Pipe)

Fork à adapter :
- admara-brand-guidelines (fork Anthropic brand-guidelines, swap tokens)

Custom (déjà rédigés dans PHASE_4_LIVRABLE_v1.md section 6.3) :
- admara-ai-agent-persona (avec règle "une question à la fois" stricte)
- admara-photo-curation
- admara-data-rgpd
- admara-conversion-philosophie
- admara-frontend-architecture

═══════════════════════════════════════════════════════════════
ÉTAPE 0 — VÉRIFICATION SETUP EXISTANT
═══════════════════════════════════════════════════════════════

Avant tout, vérifie l'état actuel.

0.1 Vérifie que tu es bien dans le bon dossier :
    ```
    pwd
    # doit retourner: /Users/aurelienbelieres/Documents/Claude/Projects/ADMARA studio/admara-site
    ```

0.2 Vérifie GitHub :
    ```
    gh auth status
    # doit montrer auth OK avec belieres.aurelien@gmail.com
    
    gh repo list aurelien-belieres --limit 20
    # liste les repos existants — note ceux qui existent déjà parmi: admara-site, admara-internal, admara-kb
    ```

0.3 Vérifie git remote du projet courant :
    ```
    git remote -v
    # doit pointer vers github.com/aurelien-belieres/admara-site
    ```

0.4 Vérifie Vercel CLI :
    ```
    npx vercel --version
    npx vercel ls
    # liste les projets — confirme que "admara-site" est présent
    ```

0.5 Vérifie Cloudflare zone admara-studio.com (Zone ID 8b014e3bcf4dbe6f4e56fd97328265c4) :
    Demande-moi de checker manuellement sur dash.cloudflare.com :
    - Zone admara-studio.com active et propagée
    - DNS records actuels (pour ne pas casser ce qui marche)
    - Tunnels existants (si n8n.admara-studio.com déjà setup)
    - Si tu as un Cloudflare API token avec Zone:Read permission, tu peux aussi check via :
      ```
      curl -X GET "https://api.cloudflare.com/client/v4/zones/8b014e3bcf4dbe6f4e56fd97328265c4" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json"
      ```

0.6 Rapport :
    Donne-moi un résumé de l'état :
    - ✅ GitHub auth + repos existants
    - ✅ Vercel project admara-site
    - ✅ Cloudflare zone admara-studio.com
    - ⚠️ Ce qui manque (à créer aux étapes suivantes)

ATTENDS MA VALIDATION AVANT DE PASSER À L'ÉTAPE 1.

═══════════════════════════════════════════════════════════════
ÉTAPE 1 — INSTALLATION MCP STACK CORE
═══════════════════════════════════════════════════════════════

Objectif : 5 serveurs MCP configurés en mode projet (.mcp.json versionné dans admara-site).

1.1 Crée le fichier `.mcp.json` à la racine du projet via commandes Claude :
    ```
    cd ~/Documents/Claude/Projects/ADMARA\ studio/admara-site
    claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp@2.2.5
    claude mcp add --scope project shadcn --transport http -- https://ui.shadcn.com/mcp
    ```

1.2 Vercel MCP via OAuth (nécessite action utilisateur) :
    ```
    claude mcp add --scope project vercel --transport http -- https://mcp.vercel.com
    ```
    PAUSE : URL d'auth Vercel s'ouvre dans le navigateur. Je me logue avec belieres.aurelien@gmail.com,
    j'autorise Claude Code, je reviens te confirmer.

1.3 GitHub MCP via OAuth :
    ```
    claude mcp add --scope project github --transport http -- https://api.githubcopilot.com/mcp/
    ```
    PAUSE : autorisation OAuth GitHub (avec belieres.aurelien@gmail.com).
    Ensuite : génère un PAT fine-grained sur GitHub Settings → Developer Settings → PAT (fine-grained)
    avec scope = repository selected : admara-site + admara-internal + admara-kb (les 2 derniers seront
    créés à l'étape 1.5 si pas encore créés).
    Permissions : Contents (RW), Pull requests (RW), Issues (RW), Workflows (R).
    Stocke dans 1Password sous "GitHub PAT — admara-stack".

1.4 Supabase MCP (nécessite project_ref) :
    Si projet admara-prod existe déjà : récupère project_ref depuis Supabase dashboard
    (Settings → General → Reference ID).
    Si pas encore créé :
    PAUSE : va sur supabase.com → New project → name "admara-prod" → region "Europe West (Ireland)" eu-west-1
    → password généré stocké dans 1Password → wait provisioning ~2 min.
    Récupère le Reference ID.
    Puis :
    ```
    claude mcp add --scope project supabase -- npx -y @supabase/mcp-server-supabase@latest --read-only --project-ref=<PROJECT_REF>
    ```
    Génère un Personal Access Token (Supabase → Settings → Access Tokens, scoped au projet),
    stocke dans 1Password.
    Export dans ton shell : `export SUPABASE_ACCESS_TOKEN=<le_PAT>`

1.5 Validation :
    ```
    claude mcp list
    ```
    Attendu : 5 servers connectés (context7, shadcn, vercel, github, supabase).

1.6 Commit `.mcp.json` :
    ```
    git add .mcp.json
    git commit -m "feat(mcp): install 5 core servers (context7, shadcn, vercel, github, supabase read-only)"
    git push origin main
    ```

ATTENDS MA VALIDATION AVANT DE PASSER À L'ÉTAPE 1.5.

═══════════════════════════════════════════════════════════════
ÉTAPE 1.5 — SETUP 3 REPOS GITHUB POUR BACKUP COMPLET
═══════════════════════════════════════════════════════════════

Objectif : architecture 3 repos pour backup automatique et séparation public/privé.

1.5.1 Vérifie/crée le repo admara-site (PUBLIC, code Next.js) :
    Si déjà existant (vérifié étape 0.2) : skip création.
    Sinon :
    ```
    cd ~/Documents/Claude/Projects/ADMARA\ studio/admara-site
    gh repo create aurelien-belieres/admara-site --public --source=. --push --description "ADMARA Studio — site marketing Next.js"
    ```
    Active branch protection sur main (Settings → Branches → Protect main → require PR before merge).

1.5.2 Crée le repo admara-internal (PRIVÉ, docs business) :
    ```
    mkdir -p ~/Documents/Claude/Projects/ADMARA\ studio/_internal
    cd ~/Documents/Claude/Projects/ADMARA\ studio/_internal
    git init
    ```
    Crée un README.md :
    ```markdown
    # ADMARA Internal — Backup confidentiel
    
    Repo privé pour tous les documents business sensibles.
    JAMAIS pousser ce repo en public.
    
    Contenu :
    - BRAND_BOOK_v1.md
    - PLAN_60J_AURELIEN.md
    - PLAN_MAITRE_v3_2026-05-04.md
    - PHASE_*.md (synthèses stratégiques)
    - SOPs/ (procédures opérationnelles)
    - brand-assets/ (logos, fonts custom, photos sources)
    
    Auto-commit toutes les heures via launchd (com.admara.backup-internal).
    ```
    Crée le repo distant :
    ```
    gh repo create aurelien-belieres/admara-internal --private --source=. --push --description "ADMARA Studio — docs business confidentiels"
    ```

1.5.3 Synchronise les docs existants vers _internal :
    Crée des symlinks ou copie les fichiers depuis le parent folder :
    ```
    cd ~/Documents/Claude/Projects/ADMARA\ studio/_internal
    cp ../BRAND_BOOK_v1.md .
    cp ../PLAN_60J_AURELIEN.md .
    cp ../PLAN_MAITRE_v3_2026-05-04.md .
    mkdir -p brand-assets
    cp -r ../brand-assets/* brand-assets/ 2>/dev/null || true
    git add .
    git commit -m "chore: initial backup of business docs"
    git push origin main
    ```

1.5.4 Configure auto-commit hourly via launchd Mac :
    Crée le fichier `~/Library/LaunchAgents/com.admara.backup-internal.plist` :
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
      <key>Label</key>
      <string>com.admara.backup-internal</string>
      <key>ProgramArguments</key>
      <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>cd "/Users/aurelienbelieres/Documents/Claude/Projects/ADMARA studio/_internal" && git add -A && git diff-index --quiet HEAD || (git commit -m "auto: hourly backup $(date '+%Y-%m-%d %H:%M')" && git push origin main)</string>
      </array>
      <key>StartInterval</key>
      <integer>3600</integer>
      <key>StandardErrorPath</key>
      <string>/tmp/admara-backup.log</string>
      <key>StandardOutPath</key>
      <string>/tmp/admara-backup.log</string>
    </dict>
    </plist>
    ```
    Charge le job :
    ```
    launchctl load ~/Library/LaunchAgents/com.admara.backup-internal.plist
    launchctl start com.admara.backup-internal
    ```
    Vérifie : `tail -f /tmp/admara-backup.log` (premier run dans l'heure).

1.5.5 Crée le repo admara-kb (PRIVÉ, knowledge base RAG) :
    PAUSE : action manuelle Obsidian.
    Dans Obsidian → vault → crée un sous-dossier `marketing-kb/` s'il n'existe pas.
    Init repo séparé :
    ```
    cd ~/Documents/Obsidian/admara-vault/marketing-kb
    git init
    gh repo create aurelien-belieres/admara-kb --private --source=. --push --description "ADMARA Studio — Knowledge base RAG (synced from Obsidian)"
    ```
    Le plugin obsidian-git auto-commit + auto-push sera configuré à l'étape 9.
    
    Note : si tu n'as pas encore créé le vault Obsidian admara-vault, fais-le manuellement maintenant :
    Obsidian → Create new vault → name "admara-vault" → location ~/Documents/Obsidian/admara-vault.

1.5.6 Validation :
    ```
    gh repo list aurelien-belieres --limit 20
    # doit montrer les 3 repos : admara-site, admara-internal, admara-kb
    
    launchctl list | grep admara
    # doit montrer com.admara.backup-internal actif
    ```

1.5.7 Update gitignore admara-site pour éviter de pousser docs internes par erreur :
    Ajoute dans `.gitignore` racine d'admara-site :
    ```
    # Internal docs (vivent dans admara-internal repo)
    BRAND_BOOK_*.md
    PLAN_*.md
    AUDIT_*.md
    !PHASE_3_SOURCING_v1.md
    !PHASE_4_LIVRABLE_v1.md
    !INSTALL_PROMPT_*.md
    ```
    (On garde les PHASE_* et INSTALL_PROMPT dans admara-site car ils sont tied au code.)

ATTENDS MA VALIDATION AVANT DE PASSER À L'ÉTAPE 2.

═══════════════════════════════════════════════════════════════
ÉTAPE 2 — HARDENING N8N + CLOUDFLARE WAF
═══════════════════════════════════════════════════════════════

PRÉREQUIS : VPS Hetzner avec n8n self-host installé (mission 1.11 plan 60j original).
Si pas encore fait : je te le dis, on revient à cette étape plus tard.

2.1 Cloudflare Tunnel devant n8n :
    Sur dash.cloudflare.com (compte belieres.aurelien@gmail.com) → Zero Trust → Networks → Tunnels
    → Create a tunnel → name "admara-n8n" → Save
    Token généré : copie-le.
    Sur le VPS Hetzner :
    ```
    ssh root@<IP_VPS>
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
    dpkg -i cloudflared.deb
    cloudflared service install <TOKEN_COPIED>
    ```
    Sur Cloudflare dashboard, Tunnel → Public hostname → Add :
    - Subdomain: n8n
    - Domain: admara-studio.com
    - Type: HTTP
    - URL: localhost:5678

2.2 Cloudflare Access policy (auth obligatoire pour accéder à n8n.admara-studio.com) :
    Zero Trust → Access → Applications → Add application
    Type : Self-hosted
    Application name: "n8n Admara"
    Subdomain: n8n
    Domain: admara-studio.com
    Identity providers: Email OTP (par défaut)
    Policy "Founders only":
      - Include: emails belieres.aurelien@gmail.com, alyssia@admara-studio.com (si compte existe)
      - Session duration: 8h
      - Require: MFA

2.3 Désactive l'IP publique n8n sur Hetzner :
    SSH sur le VPS, édite `/opt/admara/docker-compose.yml` :
    Change `ports: ['0.0.0.0:5678:5678']` → `ports: ['127.0.0.1:5678:5678']`
    Restart :
    ```
    cd /opt/admara && docker-compose down && docker-compose up -d
    ```
    Vérifie : `curl http://<IP_VPS>:5678` doit échouer (connection refused).

2.4 Test :
    Visite https://n8n.admara-studio.com sans être loggué Cloudflare → page Access Cloudflare login.
    Logge-toi avec belieres.aurelien@gmail.com → accès OK à n8n UI.

2.5 Cloudflare WAF pour la zone admara-studio.com :
    Cloudflare dashboard → admara-studio.com → Security :
    - WAF → Managed Rules → Cloudflare Managed Ruleset (OWASP) : ON
    - Bot Fight Mode : ON
    - Leaked Credentials Check : ON (gratuit Free plan)
    - WAF → Custom rules → Create :
      Rule "rate-limit-qualif" :
        Expression: (http.request.uri.path eq "/api/qualif")
        Action: Rate Limiting → 4 requests / 1 min per IP → Managed Challenge
      Rule "rate-limit-api" :
        Expression: (starts_with(http.request.uri.path, "/api/"))
        Action: Rate Limiting → 30 requests / 1 min per IP → Managed Challenge

ATTENDS MA VALIDATION AVANT DE PASSER À L'ÉTAPE 3.

═══════════════════════════════════════════════════════════════
ÉTAPE 3 — INSTALLATION SKILLS (PUBLICS + CUSTOM)
═══════════════════════════════════════════════════════════════

3.1 Crée la structure dossiers :
    ```
    cd ~/Documents/Claude/Projects/ADMARA\ studio/admara-site
    mkdir -p .claude/skills
    ```

3.2 Install frontend-design (Anthropic, 277k installs) :
    ```
    /plugin install frontend-design
    ```
    Si la commande plugin ne fonctionne pas (pas encore en marketplace officiel) :
    ```
    git clone https://github.com/anthropics/claude-code.git /tmp/claude-code
    cp -r /tmp/claude-code/plugins/frontend-design/skills/frontend-design .claude/skills/
    ```

3.3 Install marketingskills (Corey Haines) :
    ```
    git clone https://github.com/coreyhaines31/marketingskills.git /tmp/marketingskills
    cp -r /tmp/marketingskills/conversion-copywriting .claude/skills/ 2>/dev/null || echo "Vérifie le nom du dossier dans le repo cloné"
    cp -r /tmp/marketingskills/seo-optimization .claude/skills/ 2>/dev/null
    cp -r /tmp/marketingskills/analytics-instrumentation .claude/skills/ 2>/dev/null
    ```
    Si les noms diffèrent, liste le contenu : `ls /tmp/marketingskills/skills/` et sélectionne 3-4 pertinents.

3.4 Install brand-voice (Insightful Pipe) :
    Va sur https://insightfulpipe.com/marketing-claude-skills/marketing/brand-voice
    Copie le contenu SKILL.md → colle dans `.claude/skills/brand-voice/SKILL.md`.

3.5 Fork admara-brand-guidelines :
    ```
    cp -r /tmp/claude-code/plugins/brand-guidelines/skills/brand-guidelines .claude/skills/admara-brand-guidelines
    ```
    Édite `.claude/skills/admara-brand-guidelines/SKILL.md` :
    - Change name: → name: admara-brand-guidelines
    - Remplace les tokens Anthropic par : palette olive/cream/sand/brick/ink, typo Cormorant+Tenor Sans+Jost Light, ratios 50/25/10/5/4 brand book v1
    - Référence : "Tokens définis dans /BRAND_BOOK_v1.md (repo admara-internal, accès Aurélien)"

3.6 Crée les 5 skills custom depuis PHASE_4_LIVRABLE_v1.md section 6.3 :
    ```
    mkdir -p .claude/skills/admara-ai-agent-persona
    mkdir -p .claude/skills/admara-photo-curation
    mkdir -p .claude/skills/admara-data-rgpd
    mkdir -p .claude/skills/admara-conversion-philosophie
    mkdir -p .claude/skills/admara-frontend-architecture
    ```
    Pour chacun, lis PHASE_4_LIVRABLE_v1.md section 6.3 et crée le SKILL.md complet.

    IMPORTANT — RÈGLE STRICTE À AJOUTER dans admara-ai-agent-persona/SKILL.md
    (à insérer dans la section <rules> après la règle 5) :
    
    ```
    6. UNE QUESTION À LA FOIS — RÈGLE STRICTE :
       - Tu ne poses JAMAIS plus d'UNE question par tour.
       - Si tu as besoin de plus d'infos, tu attends le tour suivant.
       - Chaque question est COURTE : moins de 25 mots, claire, sans préambule.
       - Format type : 1 phrase courte d'acknowledgment (max 15 mots) + 1 question (max 25 mots).
       - Pas de "Plusieurs questions pour moi :" ni de listes numérotées de questions.
       - Pas de "et" qui joint deux questions ("Quel est ton budget et tes dates ?" → INTERDIT).
    
    Exemples :
    ❌ "Super, peux-tu me dire ton budget, tes dates et ta ville cible ?"
    ✅ "Compris. Quel budget tu vises ?"
    
    ❌ "OK noté. Et niche-wise, c'est wellness, travel ou autre ? Et tu vas où ?"
    ✅ "Noté. Quelle niche : wellness, travel, fitness, ou autre ?"
    ```

3.7 Validation :
    ```
    ls .claude/skills/
    ```
    Attendu : 9 dossiers (3 publics + 1 fork + 5 custom), chacun avec SKILL.md valide.
    
    Vérifie un SKILL.md au hasard :
    ```
    head -20 .claude/skills/admara-ai-agent-persona/SKILL.md
    ```
    Doit avoir le frontmatter YAML avec name + description.

3.8 Commit :
    ```
    git add .claude/skills
    git commit -m "feat(skills): 9 skills installed (3 publics + 1 fork + 5 custom ADMARA)"
    git push origin main
    ```

ATTENDS MA VALIDATION AVANT DE PASSER À L'ÉTAPE 4.

═══════════════════════════════════════════════════════════════
ÉTAPE 4 — TAILWIND CONFIG + DESIGN TOKENS ADMARA
═══════════════════════════════════════════════════════════════

Active skills : admara-brand-guidelines + admara-frontend-architecture + frontend-design.

[Reprend Étape 4 du v1, identique — pas de changement de personnalisation à cette étape]

═══════════════════════════════════════════════════════════════
ÉTAPE 5 — HOME + SPLIT CREATOR/BRAND + VIDÉO BG
═══════════════════════════════════════════════════════════════

[Reprend Étape 5 du v1, identique — wording strict applique skill admara-conversion-philosophie + brand-voice]

═══════════════════════════════════════════════════════════════
ÉTAPE 6 — PAGES PRICING + ABOUT + LEGAL
═══════════════════════════════════════════════════════════════

[Reprend Étape 6 du v1, identique]

═══════════════════════════════════════════════════════════════
ÉTAPE 7 — SETUP SUPABASE + PGVECTOR + EDGE FUNCTIONS
═══════════════════════════════════════════════════════════════

[Reprend Étape 7 du v1, avec project_ref de admara-prod]

═══════════════════════════════════════════════════════════════
ÉTAPE 8 — AGENT B FORM DA CONVERSATIONNEL
═══════════════════════════════════════════════════════════════

Active skills : admara-ai-agent-persona + admara-frontend-architecture + admara-conversion-philosophie + Context7 MCP.

RÈGLE CARDINALE UI POUR L'AGENT B (à implémenter dans le composant) :
═══════════════════════════════════════════════════════════════
1. UNE seule question affichée prominente à l'écran à la fois.
2. L'historique des échanges précédents est replié au-dessus, cliquable pour expand.
3. Quand l'agent envoie son nouveau message, le précédent slide vers le haut et s'estompe à 40% opacity.
4. La nouvelle question apparaît en grande typo (Tenor Sans 22-26px) au centre.
5. Input utilisateur en bas, ample, Tenor Sans 18px, placeholder gris-olive.
6. Pas de scroll automatique vers le bas — le focus est sur la question courante.
7. Animation entry fade + slide-up 300ms ease-out.
8. Au tour final (submit_qualification), CTA "Réserver mon créneau" remplace l'input → ouvre Cal.com en modale.
═══════════════════════════════════════════════════════════════

8.1 Install Vercel AI SDK 6 + AI Elements :
    ```
    npm install ai @ai-sdk/anthropic zod voyageai
    npx ai-elements@latest init
    ```

8.2 Crée `/lib/ai/agent-b-config.ts` :
    - System prompt complet (depuis skill admara-ai-agent-persona, AVEC la règle 6 "une question à la fois")
    - Wrap les rules en XML tags <rules>...</rules>
    - Tool schemas Zod :
      ```ts
      import { tool } from 'ai'
      import { z } from 'zod'

      export const submitQualificationTool = tool({
        description: 'Submit the qualification form when ALL info collected (segment, niche, ig, refs, budget, dates, city). Call ONLY at the final turn.',
        parameters: z.object({
          segment: z.enum(['creator', 'brand']),
          niche: z.enum(['wellness_expat', 'travel_nomade', 'fitness_model', 'brand_dtc', 'brand_agency', 'other']),
          ig_handle: z.string(),
          refs: z.array(z.string()).max(3),
          budget_range: z.enum(['<500', '500-1000', '1000-2000', '>2000', 'recurring']),
          dates_window: z.object({ start: z.string(), end: z.string() }),
          city: z.enum(['BKK', 'PP', 'HCM', 'Hanoi', 'Bali', 'other']),
          conversation_transcript: z.array(z.object({ role: z.string(), content: z.string() })),
        }),
        execute: async (payload) => {
          const res = await fetch('/api/qualif', { method: 'POST', body: JSON.stringify(payload) })
          return await res.json()
        }
      })

      export const handoffToHumanTool = tool({
        description: 'Redirect user to Alyssia when out of scope (OFM, wedding, particulier) or strong friction. Provide reason.',
        parameters: z.object({ reason: z.string() }),
        execute: async ({ reason }) => ({
          calComUrl: 'https://cal.com/admara/discovery-call',
          reason,
          message: "Je vais te laisser en discuter directement avec Alyssia. Voici le lien pour réserver."
        })
      })
      ```

8.3 Crée `/lib/ai/rag.ts` (idem v1).

8.4 Crée `/app/api/agent-b/route.ts` (idem v1).

8.5 Crée `/components/ai/AgentB.tsx` avec UI "une question à la fois" :
    ```tsx
    'use client'
    import { useChat } from 'ai/react'
    import { useState } from 'react'
    import { motion, AnimatePresence } from 'framer-motion' // OU CSS pur — préfère CSS si possible
    
    export default function AgentB({ locale, segment }: { locale: 'fr' | 'en', segment: 'creator' | 'brand' }) {
      const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/agent-b',
        body: { locale, segment },
      })
      const [showHistory, setShowHistory] = useState(false)
      
      // Trouve le dernier message agent (current question)
      const currentAgentMessage = [...messages].reverse().find(m => m.role === 'assistant')
      const previousMessages = messages.filter(m => m !== currentAgentMessage)
      
      return (
        <div className="max-w-[640px] mx-auto bg-cream p-8 min-h-[480px] flex flex-col">
          {/* History collapsed */}
          {previousMessages.length > 0 && (
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-ink/50 text-xs uppercase tracking-wider mb-4 hover:text-olive transition"
            >
              {showHistory ? '— Hide history' : `+ Show previous (${previousMessages.length})`}
            </button>
          )}
          {showHistory && (
            <div className="space-y-3 mb-6 opacity-60 text-sm">
              {previousMessages.map((m, i) => (
                <div key={i}>
                  <span className="text-olive">{m.role === 'user' ? 'Toi' : 'ADMARA'}:</span> {m.content}
                </div>
              ))}
            </div>
          )}
          
          {/* Current question — prominent */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAgentMessage?.id || 'initial'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 flex items-center justify-center"
            >
              <p className="font-sans text-2xl text-ink text-center leading-snug">
                {currentAgentMessage?.content || 'Bonjour. Je suis le concierge digital d\'ADMARA. Quelques questions pour matcher ta DA. Tu es créatrice ou marque ?'}
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Ta réponse"
              className="flex-1 bg-transparent border-b-2 border-ink/30 focus:border-olive py-3 px-1 text-lg font-sans text-ink placeholder:text-ink/40 outline-none transition"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-olive text-cream px-6 py-3 text-sm uppercase tracking-wider hover:bg-olive-dark transition disabled:opacity-30"
            >
              {isLoading ? '...' : 'Envoyer'}
            </button>
          </form>
        </div>
      )
    }
    ```
    
    Note : si tu veux éviter framer-motion (dépendance), remplace par CSS transitions pures avec un état React local (key sur la div force le remount).

8.6 Crée `/components/ai/AgentFallback.tsx` (idem v1).

8.7 Ajoute AgentB.tsx dans /creators et /brands pages, section CTA fin :
    ```tsx
    <section id="form" className="py-24 bg-sand">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-4xl mb-4 text-center">Prêt à matcher ta DA ?</h2>
        <p className="text-center mb-12 text-ink/70">6 questions, 3 minutes, puis tu réserves.</p>
        <AgentB locale="fr" segment="creator" />
      </div>
    </section>
    ```

8.8 Crée `/app/api/qualif/route.ts` (idem v1).

8.9 Crée `/scripts/test-agent-b.ts` (idem v1) + ajoute test spécifique :
    Test n°6 : "agent demande 2 questions en 1 tour" — le test envoie message utilisateur vague,
    vérifie que la réponse de l'agent contient EXACTEMENT 1 question (compte les "?"). Si > 1 "?",
    test FAIL.

8.10 Commit :
    ```
    git add .
    git commit -m "feat(agent-b): form DA conversationnel — UI 1 question à la fois + RAG + fallback"
    git push origin main
    ```

ATTENDS MA VALIDATION (test manuel conversationnel) AVANT DE PASSER À L'ÉTAPE 9.

═══════════════════════════════════════════════════════════════
ÉTAPE 9 — PIPELINE OBSIDIAN → VECTOR STORE
═══════════════════════════════════════════════════════════════

9.1 Plugin obsidian-git :
    PAUSE manuelle dans Obsidian (admara-vault) :
    - Settings → Community plugins → Browse → "Obsidian Git" → Install + Enable
    - Settings du plugin :
      - Vault backup interval (minutes) : 10
      - Auto push interval : 10
      - Pull on startup : OFF (on n'utilise pas Obsidian comme synchroniseur)
      - Commit message : "kb update {{date}}"
    - Le plugin pousse vers le remote du repo initialisé à l'étape 1.5.5 (admara-kb).

9.2 Crée `/scripts/index-kb.ts` dans admara-site :
    [Code identique au v1]
    Le KB_PATH par défaut pointe vers ~/Documents/Obsidian/admara-vault/marketing-kb.

9.3 Crée `.github/workflows/index-kb.yml` dans le repo admara-kb :
    PAUSE manuelle : il faut créer le workflow dans le REPO admara-kb (séparé d'admara-site).
    
    Sur ta machine :
    ```
    cd ~/Documents/Obsidian/admara-vault/marketing-kb
    mkdir -p .github/workflows
    ```
    Crée `.github/workflows/index-kb.yml` :
    ```yaml
    name: Index KB to Supabase pgvector
    on:
      push:
        branches: [main]
      workflow_dispatch:
    jobs:
      index:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout admara-kb
            uses: actions/checkout@v4
          - name: Checkout admara-site (for script)
            uses: actions/checkout@v4
            with:
              repository: aurelien-belieres/admara-site
              token: ${{ secrets.PAT_ADMARA_SITE }}
              path: admara-site
          - uses: pnpm/action-setup@v2
            with: { version: 8 }
          - uses: actions/setup-node@v4
            with: { node-version: 20 }
          - run: cd admara-site && pnpm install
          - name: Run indexing
            run: cd admara-site && pnpm tsx scripts/index-kb.ts
            env:
              KB_PATH: ${{ github.workspace }}
              VOYAGE_API_KEY: ${{ secrets.VOYAGE_API_KEY }}
              SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
              SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    ```
    
    Ajoute les secrets dans GitHub repo admara-kb (Settings → Secrets → Actions) :
    - PAT_ADMARA_SITE (PAT généré étape 1.3 avec accès admara-site read)
    - VOYAGE_API_KEY
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE_KEY

9.4 Test pipeline complet :
    Crée 3 fichiers .md dans `marketing-kb/` :
    - `philosophie.md` (extrait BRAND_BOOK + posture prototype)
    - `pricing-public.md` (4 packs créateurs + 4 brand)
    - `faq.md` (8 questions/réponses)
    Plugin obsidian-git auto-commit dans les 10 min ET auto-push.
    GitHub Action index-kb.yml run automatiquement.
    Vérifie Supabase : `SELECT count(*) FROM documents;` → doit avoir des lignes.

9.5 Test RAG dans Agent B :
    Démarre conversation : "C'est quoi votre méthode de matching ?"
    L'agent doit citer la méthode depuis le KB.

9.6 Commit côté admara-site :
    ```
    git add scripts/index-kb.ts
    git commit -m "feat(rag): obsidian → supabase pgvector indexing script"
    git push origin main
    ```

ATTENDS MA VALIDATION AVANT DE PASSER À L'ÉTAPE 10.

═══════════════════════════════════════════════════════════════
ÉTAPE 10 — TRACKING + COOKIE BANNER
═══════════════════════════════════════════════════════════════

[Reprend Étape 10 du v1, identique]

═══════════════════════════════════════════════════════════════
ÉTAPE 11 — TESTS LIGHTHOUSE + E2E
═══════════════════════════════════════════════════════════════

[Reprend Étape 11 du v1, identique]

═══════════════════════════════════════════════════════════════
ÉTAPE 12 — MISE EN LIGNE PROD ADMARA.STUDIO
═══════════════════════════════════════════════════════════════

12.1 Via Vercel MCP, vérifie connexion projet admara-site au repo GitHub aurelien-belieres/admara-site.

12.2 Configure le domain custom admara-studio.com dans Vercel :
    Vercel dashboard → projet admara-site → Settings → Domains → Add :
    - admara-studio.com
    - www.admara-studio.com (alias)
    Vercel donne 2 DNS records à ajouter.

12.3 Cloudflare DNS pour admara-studio.com :
    dash.cloudflare.com → admara-studio.com → DNS → Records :
    - A @ → 76.76.21.21 (Vercel) [ou CNAME si Vercel le demande]
    - CNAME www → cname.vercel-dns.com
    - Proxy status : OFF pour ces records (sinon conflict avec Vercel SSL)
    Wait propagation 5-30 min.

12.4 Vérifie https://admara-studio.com charge avec cadenas vert.

12.5 Smoke test complet :
    [Voir v1 — identique]

12.6 Tag release :
    ```
    cd ~/Documents/Claude/Projects/ADMARA\ studio/admara-site
    git tag v1.0.0
    git push origin --tags
    ```

12.7 Update PHASE_4_LIVRABLE_v1.md statut :
    Ajoute en haut : "Statut : Site V3 LIVE depuis [date]. Étapes 1-12 terminées."
    Push vers admara-internal :
    ```
    cd ~/Documents/Claude/Projects/ADMARA\ studio/_internal
    # le PHASE_4 sera auto-committed par launchd
    ```

ATTENDS MA VALIDATION (visite manuelle production) AVANT DE PASSER À L'ÉTAPE 13.

═══════════════════════════════════════════════════════════════
ÉTAPES 13-15 — EVAL + SEO + ITÉRATIONS
═══════════════════════════════════════════════════════════════

[Voir v1 — identique]

═══════════════════════════════════════════════════════════════
RÈGLES DE COMMUNICATION
═══════════════════════════════════════════════════════════════

- Avant chaque étape : "Je vais [action]. Ok pour démarrer ?"
- Action manuelle requise : "Action manuelle : [étapes précises]. Préviens-moi quand c'est fait."
- Erreur : "Erreur : [détail]. Comment veux-tu procéder ?"
- Étape réussie : "Étape X terminée. Validation suivante : [ce que je dois vérifier]."
- Tous les commits suivent le format conventionnel : feat(scope): | fix(scope): | chore: | docs:

═══════════════════════════════════════════════════════════════

COMMENCE PAR L'ÉTAPE 0. Vérifie l'état du setup existant et donne-moi le rapport
des comptes/repos déjà configurés vs ce qui manque.
```

---

## Comment l'utiliser

1. **Copie tout le bloc de code ci-dessus** (entre les triple-backtick), depuis `Tu es Claude Code...` jusqu'à `COMMENCE PAR L'ÉTAPE 0...`.
2. **Ouvre VS Code** sur `~/Documents/Claude/Projects/ADMARA studio/admara-site`.
3. **Démarre Claude Code** dans VS Code (`Cmd+Esc`).
4. **Nouvelle session** (`/clear`).
5. **Colle le prompt** en entier dans le chat.
6. Claude Code commence par l'étape 0 (vérification setup existant) puis enchaîne.

À chaque étape, tu valides ou tu redirige. Pas d'auto-pilote total — c'est volontaire pour garder le contrôle sur la sécurité (MCP install, Supabase keys, Cloudflare config) et sur les coûts (Anthropic API budget cap).

**Durée estimée totale (étapes 0-12) :** 6-8 jours full-time ou 12-15 jours à 4h/jour pour atteindre la mise en ligne.

---

## Changements clés v2 vs v1

| Section | v1 | v2 |
|---|---|---|
| Comptes | Génériques | belieres.aurelien@gmail.com partout |
| Domaine | `<domain>` placeholder | admara-studio.com hardcoded |
| Repos GitHub | 1 repo admara-site | **3 repos** : admara-site (public), admara-internal (privé docs), admara-kb (privé RAG) |
| Backup docs business | Non géré | **launchd Mac hourly** auto-commit + push admara-internal |
| Agent B UI | "Conversational" générique | **Une question à la fois** explicite : règle 6 system prompt + composant React avec history repliée |
| Étape 0 nouvelle | — | Vérification setup existant (gh, vercel, cloudflare) avant d'attaquer |
| Étape 1.5 nouvelle | — | Setup 3 repos GitHub + launchd auto-commit |
| Test Agent B | 5 tests | 6 tests (ajout test "1 question max par tour") |
