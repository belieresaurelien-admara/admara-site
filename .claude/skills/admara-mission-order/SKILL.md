---
name: admara-mission-order
description: Templates et règles de rédaction des deux documents internes ADMARA — Ordre de Mission (brief structuré pour le photographe sélectionné) et Planche Moodboard (direction artistique préparée). Documents générés depuis le brief Agent B + le Discovery Call avec Alyssia. Strictement internes, jamais affichés sur le site public. L'ordre de mission contient la mention commission interne 10 % ADMARA. Utiliser à chaque création ou refacto de la chaîne brief Agent B → ordre de mission → soumission photographe.
---

# ADMARA Mission Order

## Contexte
ADMARA fonctionne en intermédiaire mondial. Le parcours client est :
1. Visiteur remplit le brief Agent B sur /service.
2. Discovery Call gratuit avec Alyssia.
3. **ADMARA rédige l'ordre de mission + la planche moodboard.**
4. La mission est soumise à la sélection de photographes/vidéastes ADMARA.
5. Le photographe sélectionné accepte la mission, ADMARA pilote coordination + paiement.
6. Livraison + SAV.

Ce skill définit comment produire les documents de l'étape 3.

## Règle de confidentialité (NON NÉGOCIABLE)
- L'ordre de mission et la planche moodboard sont **strictement internes**.
- Ils ne sont **JAMAIS** affichés sur le site public.
- La mention de la commission ADMARA (10 % du montant total facturé client) apparaît dans l'ordre de mission envoyé au photographe, mais **JAMAIS** dans aucun document client public.
- Le client signe un devis ADMARA "tout compris" sans détail de la commission.
- Le photographe signe son contrat ADMARA avec son tarif net (montant total client - 10 %) et la mention de la commission.

## Template — Ordre de Mission ADMARA

```markdown
# ORDRE DE MISSION ADMARA — [REF-XXXX]

**Date de création** : YYYY-MM-DD
**Statut** : draft / signed / en cours / livré

---

## 1. Client
- Nom / structure :
- Contact : nom + email + téléphone (optionnel)
- Type de projet : professionnel / créatif / personnel / autre

## 2. Objectif
Description en 2-4 lignes de l'usage final des contenus.
Exemple : "Campagne lancement marque DTC slow fashion, format pour IG + e-commerce."

## 3. Livrables
- Photo : oui / non
  - Quantité approximative finale (post-tri) : X visuels HD
  - Formats : carré / portrait / paysage
  - Droits d'usage : usage interne / commercial / publicitaire — durée
- Vidéo : oui / non
  - Quantité : X clips
  - Durée par clip : X secondes
  - Formats : 9:16 / 16:9 / 1:1
  - Montage final inclus : oui / non
- Retouches : standard / poussée / brutes seules

## 4. Lieu
- Ville :
- Pays :
- Lieu(x) précis (intérieur, extérieur, studio, privé) :
- Repérages nécessaires : oui / non

## 5. Dates
- Fenêtre cible : YYYY-MM-DD → YYYY-MM-DD
- Flexibilité : stricte / souple +/- N jours
- Date confirmée : à compléter par photographe

## 6. Direction artistique
Voir planche moodboard jointe (REF-XXXX-MOOD).
- Style résumé en 3 mots-clés :
- Palette dominante :
- Lumière souhaitée :
- Mots-clés (champ libre) :

## 7. Casting
- Modèles / participants : oui / non
- Casting à organiser par ADMARA : oui / non
- Profils recherchés :

## 8. Budget global mission (interne ADMARA)
- Montant total client TTC : X €
- Commission ADMARA (10 %) : X €
- **Net photographe** : X €
- Frais inclus (déplacements, location matériel, location lieu) : détail
- Conditions de paiement : 30 % à la confirmation / 70 % à la livraison (ou variante mission)

## 9. Contraintes
- Logistique (transport, hébergement) :
- Légales (autorisations lieu, casting, droit à l'image) :
- Confidentialité (NDA) : oui / non
- Deadline absolue livraison brute :
- Deadline absolue livraison finale :

## 10. Photographe assigné
- Nom :
- Portfolio :
- Email :
- Statut acceptation : pending / accepted / declined
- Date acceptation :

## 11. Validation interne ADMARA
- Brief validé par : Alyssia (date)
- Devis client signé : date
- Ordre de mission envoyé photographe : date
- Acceptation photographe : date
- Acompte versé : date
```

## Template — Planche Moodboard

```markdown
# PLANCHE MOODBOARD — [REF-XXXX-MOOD]

**Liée à l'ordre de mission** : [REF-XXXX]
**Date** : YYYY-MM-DD

---

## Synthèse en 3 mots-clés
Trois mots qui résument la direction artistique cible.

Exemple : "Calme. Vintage. Solaire."

## Palette cible
- Couleur dominante (50%) : nom + hex
- Couleur secondaire (25%) : nom + hex
- Couleurs d'accent (15%) : noms + hex
- Couleur à éviter : nom + hex

## Lumière cible
Description précise (naturelle, fenêtre nord, golden hour, flash, ring light, etc.)

## Composition cible
- Cadrage : serré / aéré / mix
- Profondeur de champ : large / serrée
- Symétrie : centrée / asymétrique
- Mouvement : statique / dynamique

## Références visuelles (6 à 12)
Grille d'images avec :
- Source (photographe, marque, magazine, lien)
- Pourquoi cette ref (1 ligne max)

## Do / Don't visuels

### À FAIRE
- [exemple] peau réelle, grain léger
- [exemple] composition aérée, sujet < 60 % du cadre
- [exemple] lumière naturelle

### À NE PAS FAIRE
- [exemple] flash direct
- [exemple] tons saturés bleu / violet
- [exemple] bokeh agressif

## Format de sortie attendu
- Photo : profil colorimétrique sRGB, 300dpi, dimensions X×Y
- Vidéo : Rec.709 ou Rec.2020, frame rate, bitrate
- Naming : `[REF-XXXX]_[YYMMDD]_NN.ext`

## Notes additionnelles
Précisions terrain, ambiance globale, éléments narratifs.
```

## Règles de rédaction

1. **Factuel, exploitable, sans superlatif.** Le photographe doit pouvoir lire l'ordre de mission et savoir exactement quoi shooter, où, quand, comment et pour combien net.
2. **Pas d'emoji** dans les documents internes.
3. **Pas de jargon marketing**, vocabulaire de production : livrables, cadrage, sujet, droits d'usage, brut, profil colorimétrique.
4. **Toujours quantifié** quand possible : nombre de visuels, durée, dimensions, deadline.
5. **Photographe = exécutant senior, pas exécutant junior**. Donner les contraintes, pas les commandements micro.
6. **Mention 10 % visible uniquement dans la section budget interne** (§8 de l'ordre de mission). Ne JAMAIS apparaître dans le devis client.

## Génération depuis le brief Agent B

Le payload Zod retourné par `submit_brief()` alimente automatiquement les sections 1-5, 7 (partiellement), 9 de l'ordre de mission, et la section références + mots-clés de la planche moodboard.

Alyssia complète manuellement à partir du Discovery Call :
- Section 6 (direction artistique précise)
- Section 8 (budget + ventilation commission, hors site)
- Section 10 (photographe assigné)
- Planche moodboard : sélection finale des 6-12 références visuelles et palette précise

Mapping brief Agent B → ordre de mission :
- `project_type` → §1 type de projet
- `objective` → §2 objectif
- `deliverables` → §3 livrables
- `location` → §4 lieu
- `dates_window` → §5 dates
- `vision.style_keywords` → §6 mots-clés
- `vision.references` + `vision.freeform_description` → planche moodboard refs + notes
- `budget_range` → §8 montant total client (à confirmer en Discovery Call)
- `constraints` → §9 contraintes
- `contact` → §1 contact

## Outils prévus (M+1)

- Génération automatique de l'ordre de mission depuis le brief Agent B (script Node + template)
- Génération de la planche moodboard via assemblage Notion ou Figma à partir des refs
- Envoi photographe via lien sécurisé (DocuSign ou similaire) avec signature électronique
- Tracking statut dans Airtable (link table missions ↔ photographes ↔ clients)
