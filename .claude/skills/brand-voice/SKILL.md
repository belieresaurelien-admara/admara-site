---
name: brand-voice
description: Stub placeholder — install manuel requis. Skill brand-voice de Insightful Pipe (cadre Voice → Tone → Style en 3 couches). Couvre brand basics, values, existing content audit, voice discovery exercises, style rules, vocabulary guidelines, tone mapping, output format templates, testing methods. Utiliser pour définir/auditer la voix de marque ADMARA en complément de admara-conversion-philosophie.
status: TODO_MANUAL_INSTALL
source_url: https://insightfulpipe.com/marketing-claude-skills/marketing/brand-voice
---

# brand-voice (TODO)

## Statut : install manuel requis

Le SKILL.md complet n'est pas téléchargeable via WebFetch — le site Insightful Pipe nécessite un bouton "Download Skill" interactif.

## Marche à suivre pour finaliser l'install

1. Aller sur https://insightfulpipe.com/marketing-claude-skills/marketing/brand-voice
2. Cliquer **"Download Skill"** (ou copier le contenu du code viewer)
3. Remplacer ce fichier (`/.claude/skills/brand-voice/SKILL.md`) par le SKILL.md téléchargé
4. Vérifier que le frontmatter YAML (`---name: brand-voice ---`) est présent en haut
5. Commit : `git add .claude/skills/brand-voice && git commit -m "feat(skills): install brand-voice from Insightful Pipe"`

## Pourquoi ce skill

Couvre la définition de "voix de marque" en 3 couches (Voice/Tone/Style) avec exercices de découverte. Complémentaire à :
- `admara-brand-guidelines` (visuels — palette, typo)
- `admara-conversion-philosophie` (structure de pages, anti-patterns marketing)
- `admara-ai-agent-persona` (ton strict pour les agents IA)

## Alternative temporaire

En attendant l'install manuel, utiliser `admara-conversion-philosophie` + `admara-brand-guidelines` qui couvrent 70% du même périmètre pour le contexte ADMARA.
