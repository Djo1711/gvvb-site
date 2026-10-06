# Documentation — Site GVVB

**Garches Vaucresson Volley-Ball** — site officiel du club  
Domaine cible : `gvvb.fr` · Déployé sur Vercel  
Saison en cours : **2026-2027**

---

## ⚠️ À lire en premier : `src/lib/saison.ts`

Toutes les données de référence du club vivent dans **un seul fichier** :
`src/lib/saison.ts`. Les pages ne font que de la mise en forme.

| Constante | Contenu |
|---|---|
| `SAISON_CLUB` | `"2026-2027"` — inscriptions, tarifs, dossier |
| `SAISON_FFVB` | `"2025/2026"` — scraping et liens FFVB (volontairement distinct) |
| `DOSSIER` | chemin + taille du PDF d'inscription |
| `DATE_LIMITE` | date limite de remise du dossier |
| `CATEGORIES_AGE` | 6 catégories avec années de naissance |
| `CRENEAUX_JEUNES` / `_LOISIR` / `_COMPETITION` | créneaux d'entraînement (`debut`/`fin` en `"HH:MM"`, plus un `type`) |
| `JOURS_SEMAINE` / `LIBELLES_TYPE` | axes et libellés de l'emploi du temps |
| `TARIFS` / `TARIFS_ANNEXES` / `MODALITES_PAIEMENT` | cotisations |
| `PIECES_DOSSIER` | les 7 pièces à fournir |
| `BUREAU` | 4 membres, tél + email |
| `POULES` / `ffvbUrl()` / `CODE_ENTITE_FFVB` | intégration FFVB |
| `EQUIPES_COMPETITION` / `_JEUNES` / `_LOISIR` | les 11 équipes |

### Changer de saison

1. **Contenu club** (dès réception du nouveau dossier d'inscription) :
   - déposer le PDF dans `public/docs/dossier-inscription-<saison>.pdf`
   - mettre à jour `SAISON_CLUB`, `DOSSIER.taille`, `DATE_LIMITE`
   - décaler `CATEGORIES_AGE` d'un an, réécrire les `CRENEAUX_*` et `TARIFS`
2. **Compétition** (quand la FFVB publie les poules, généralement fin septembre) :
   - **archiver la saison qui se termine** *avant* de toucher à `SAISON_FFVB`,
     en listant les poules de l'ancienne saison (codes et libellés de `POULES`) :
     ```bash
     npx tsx scripts/archiver-saison.ts 2025/2026 "AMA=Départementale M - Poule principale" "AFC=Départementale F - Poule principale"
     ```
     puis importer le JSON généré dans `src/data/archives/index.ts` et ajouter
     la saison en tête de `SAISONS_ARCHIVEES`. Elle apparaît alors sous
     `/calendrier/archives/<saison>` et en lien en bas de `/calendrier`.
   - passer `SAISON_FFVB` à la nouvelle saison
   - mettre à jour les codes de `POULES` — **ils changent chaque saison**
     (ex. `AMA` en 2025/2026, `1MA` en 2026/2027)
   - les équipes engagées dont la poule n'est pas encore publiée vont dans
     `POULES_A_VENIR` (ligne « Inscriptions en cours » sans résultats)
   - mettre à jour les `liens` des équipes dans `EQUIPES_*`
   - vérifier `/calendrier` : en cas d'échec du scraping, la page affiche
     automatiquement des liens directs vers ffvbbeach.org

> Les deux saisons sont séparées volontairement : les inscriptions ouvrent en
> août alors que les poules FFVB n'existent pas encore. Basculer `SAISON_FFVB`
> trop tôt vide la page Calendrier.

⚠️ **Piège JSX** : n'écrivez pas `{UNE_CONSTANTE} mot` en fin de ligne dans du
JSX — la transformation avale l'espace et affiche `2026-2027mot`. Gardez
l'expression et le mot suivant sur la même ligne, ou utilisez `{" "}`.

---

## Stack technique

| Élément | Choix |
|---|---|
| Framework | Next.js (App Router, Server + Client Components) |
| Styles | Tailwind CSS v4 |
| Polices | Oswald (titres, `font-heading`) + Geist Sans (corps) via Google Fonts |
| Images | `next/image` (optimisation automatique, lazy loading) |
| Déploiement | Vercel (CD automatique depuis la branche `main`) |
| Scraping résultats | HTML scraping de `ffvbbeach.org` (pas d'API officielle) |

### Couleurs personnalisées (définie dans `globals.css`)

```css
--color-gvvb-red:        #C8102E
--color-gvvb-red-dark:   #a00e24
--color-gvvb-navy:       #1B2A4A
--color-gvvb-navy-dark:  #0f1a2e
```

---

## Structure du projet

```
site_gvvb/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← layout global (Navbar + Footer)
│   │   ├── globals.css             ← thème Tailwind (couleurs, polices)
│   │   ├── page.tsx                ← page d'accueil
│   │   ├── le-club/page.tsx
│   │   ├── equipes/page.tsx
│   │   ├── entrainements/page.tsx
│   │   ├── calendrier/page.tsx     ← Server Component, fetch FFVB
│   │   ├── inscription/page.tsx    ← tarifs, pièces, dossier PDF
│   │   ├── contact/page.tsx
│   │   └── mentions-legales/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx              ← Client Component (menu burger mobile)
│   │   ├── Footer.tsx
│   │   ├── PageHeader.tsx          ← composant réutilisable pour les en-têtes
│   │   └── CalendrierClient.tsx    ← Client Component (accordion + tableau)
│   └── lib/
│       ├── saison.ts               ← ⚠️ toutes les données du club (voir ci-dessus)
│       └── ffvb.ts                 ← scraping + parsing des données FFVB
└── public/
    ├── logo-gvvb.png               ← logo renard rouge (navbar)
    ├── logo-gvvb-rouge.png         ← logo renard rouge fond transparent
    ├── logo-gvvb-blanc.png         ← logo renard blanc (sections sombres)
    ├── photos/                     ← photos David Adet + ambiance
    ├── equipes/                    ← photos des équipes
    ├── news/                       ← images actualités (maillots)
    ├── sponsors/                   ← logo Librairie L'Écriture
    └── docs/                       ← dossier inscription PDF
```

---

## Pages

### Accueil (`/`)

- **Hero** : photo de fond (`hero-bg.jpg`), gradient rouge/navy, titre GVVB en grand, logo blanc aligné à droite du titre, deux boutons CTA
- **Accès rapide** : 2 tuiles navy — formulaire de contact et `/inscription`
- **Équipes** : aperçu des 5 premières équipes (`TOUTES_EQUIPES.slice(0, 5)`), liens vers `/equipes#ancre`
- **Actualités** : articles dont le lancement de la saison 2026-2027 (octobre 2026, en avant), l'ouverture des inscriptions (août 2026) et les maillots Décathlon Pro (janvier 2026) avec photos
- **Galerie photos** : grille 3 colonnes (photos `celebration-m.jpg`, `action-smash.jpg`, `portrait-f.jpg`)
- **Partenaires** : section dédiée à la Librairie L'Écriture (logo, liens site + Instagram)
- **Dossier d'inscription** : téléchargement du PDF de la saison en cours
- **CTA rejoindre** : section navy avec photo de fond, boutons « S'inscrire » et « Nous contacter »

### Le Club (`/le-club`)

Bureau (lu depuis `BUREAU`), coachs et les 3 gymnases.  
Header : `supporters.jpg`

### Équipes (`/equipes`)

**11 équipes** en 3 blocs, toutes définies dans `saison.ts` :

| Bloc | Équipes | Format |
|---|---|---|
| Compétition Seniors | Départementale M, Départementale F | grand format photo/texte alterné |
| Jeunes | M11, M13/M15 Garçons, M13/M15 Filles, M18 Filles, M18/M21 Mixte | grille de cartes |
| Loisir | Loisir OR, 4×4 Féminine, Loisir Mixte, VSOP | grille de cartes |

Chaque fiche affiche niveau, genre, description, **créneaux**, coachs et liens FFVB.

`Equipe.coachs` est un **tableau** : un groupe peut être encadré à plusieurs (les
M13 / M15 Filles le sont), et le libellé se met au pluriel tout seul. Les coachs
sont désignés par leur **prénom seul**, ici comme sur `/le-club` : c'est plus
convivial et c'est ainsi qu'on les appelle au gymnase.
Les équipes sans photo utilisent le placeholder « Photo à venir ».

> ⚠️ Les `id` servent d'**ancres** (`/equipes#dep-masculine`). L'équipe
> « M13 / M15 Filles » garde volontairement l'id historique `m15-feminine` :
> des liens externes pointent dessus.

Header : `volleyballs.jpg`

### Entraînements (`/entrainements`)

Deux **emplois du temps hebdomadaires** (voir `EmploiDuTemps` ci-dessous) :
jeunes puis adultes. Chaque case affiche la catégorie, l'horaire et le gymnase,
avec le même code couleur par `type` de créneau dans les deux grilles.

La section adultes affiche **deux grilles côte à côte** (empilées sous `lg`) :
la semaine (lundi → vendredi, 20h → 22h30) puis le dimanche (10h30 → 18h). Le
dimanche a sa propre grille parce que ses horaires n'ont rien à voir avec ceux
de la semaine : une grille unique étirée sur douze heures laissait six colonnes
vides sur sept heures. **Sa colonne d'heures, à sa gauche, sert de séparation**
avec la semaine. La légende est rendue une seule fois par la page via
`<Legende>`, les deux grilles omettant alors la prop `legende`.

Suivent les catégories d'âge et un bloc `<details>` « Voir la liste détaillée »
avec les 3 tableaux jour / horaire / ville / gymnase / catégorie / type — c'est
le repli accessible et imprimable de l'information.

Bandeau navy rappelant que les créneaux sont confirmés à la mi-septembre.

Header : `dep-feminine.jpg`

### Inscription (`/inscription`)

Page créée à partir du dossier officiel. Sections :
1. **Téléchargement du dossier** PDF (bandeau rouge)
2. **Tarifs** : tableau Garches/Vaucresson vs autres communes, frais annexes
   (mutation 90 €, tenue 30 €), modalités de paiement
3. **Pièces à fournir** : checklist numérotée des 7 pièces
4. **Date limite** : encadré navy
5. **Catégories d'âge** : rappel par année de naissance
6. **Contacts du bureau** : les 4 membres avec tél + email

Header : `entree-jeu.jpg` · objectPosition : `center 35%`

### Calendrier & Résultats (`/calendrier`)

**Server Component** qui fetch les poules de `POULES` au build (revalidé toutes
les heures). Les codes de poules et la saison FFVB vivent dans `saison.ts`.

Chaque poule est un **accordion dépliable** qui affiche :
1. **Classement** : tableau avec la ligne GVVB surlignée en rouge
2. **Matchs** : date, domicile/extérieur, adversaire, score (vert/rouge), détail des sets
3. **Forme** : badges V/D sur les 5 derniers matchs joués
4. **Lien FFVB** : « Voir la poule sur ffvbbeach.org » en bas de chaque poule
5. **Fallback** : si le scraping échoue, liens directs vers ffvbbeach.org

Les équipes de `POULES_A_VENIR` s'affichent sous les poules avec la mention
« Inscriptions en cours » et un lien vers l'accueil du comité sur ffvbbeach.org.
En bas de page, un lien par saison de `SAISONS_ARCHIVEES`.

### Archives (`/calendrier/archives/[saison]`)

Même affichage que `/calendrier`, mais lu depuis `src/data/archives/<saison>.json`
(résultats figés par `scripts/archiver-saison.ts`, aucun appel à la FFVB).
Seules les saisons de `SAISONS_ARCHIVEES` sont générées (`dynamicParams = false`).

Header : `filet-m.jpg` · objectPosition : `20% 30%`

### Contact (`/contact`)

- Adresse postale + email du club
- **Le bureau** : les 4 membres (lus depuis `BUREAU`), tél + email
- Réseaux sociaux : Instagram, Facebook
- Bloc « Rejoindre le club » : téléchargement du dossier + renvoi vers `/inscription`
- Les 3 gymnases avec liens Google Maps

Header : `banc-gvvb.jpg` · objectPosition : `center 30%`

> **Pas de page `/galerie`** : elle était documentée ici mais n'a jamais été
> créée dans `src/app/`. Les photos de David Adet
> ([@davidadet_photo_video](https://www.instagram.com/davidadet_photo_video/))
> sont présentes dans `public/photos/` et utilisées comme en-têtes de pages et
> dans la grille de l'accueil. À créer si la galerie est souhaitée.

### Mentions légales (`/mentions-legales`)

Page légale obligatoire (loi française) avec :
- Éditeur (à compléter : adresse et email association)
- Hébergeur : Vercel Inc.
- Responsable de publication (à compléter)
- RGPD / données personnelles
- Propriété intellectuelle

---

## Composants

### `PageHeader`

En-tête réutilisé sur toutes les pages intérieures.

```tsx
<PageHeader
  label="Compétition"           // petit texte rouge au-dessus
  title="Calendrier & Résultats"
  description="Saison 2025/2026"
  bgImage="/photos/filet-m.jpg" // optionnel
  objectPosition="20% 30%"      // optionnel (défaut : "center")
>
  {/* children optionnels, affichés sous la description */}
</PageHeader>
```

- Fond rouge GVVB avec photo en overlay (opacity 50%) + surcouche rouge/65
- Logo blanc GVVB en filigrane à droite (desktop uniquement, 180px)
- Hauteur : `py-20 md:py-28`

### `Navbar`

- Logo GVVB rouge (48px) + texte "GVVB / Garches Vaucresson VB"
- 7 liens : Accueil · Le Club · Équipes · Entraînements · Calendrier · Inscription · Contact
- Liens actifs soulignés en rouge
- Bascule menu burger ↔ menu horizontal au breakpoint **`lg`** (et non `md` :
  les 7 liens plus le CTA ne tiennent pas en 768px)
- Bouton "Nous rejoindre" en rouge à droite → `/inscription`
- `sticky top-0 z-50` — reste visible au scroll

### `Footer`

- 3 colonnes : identité club + réseaux · navigation · contact & gymnases
- Gymnases : Yves Bodin (Garches) · Le Rallec (Garches) · Yves du Manoir (Vaucresson)
- Logo blanc GVVB (56px)
- Logo partenaire L'Écriture (filtre CSS `brightness(0) invert(1)` pour le rendre blanc)
- Liens : Instagram `volley_gvvb`, Facebook `gvvb.fr`
- Mentions légales en bas à droite

### `EmploiDuTemps`

Grille hebdomadaire en CSS Grid (Server Component, aucune interactivité).

```tsx
<EmploiDuTemps
  creneaux={CRENEAUX_ADULTES}
  legende={["competition", "loisir"]}
  jours={JOURS_WEEKEND}        // défaut JOURS_SEMAINE (lundi → vendredi)
  fond="bg-gray-50"            // fond de la section hôte (défaut "bg-white")
/>
```

- **Lignes** = tranches de 15 minutes (`ROW_H` px chacune), plage calée
  automatiquement sur les demi-heures encadrant les créneaux fournis
- **Colonnes de largeur égale** (`minmax(0, 1fr)`). Un jour occupe **une largeur
  de colonne par gymnase** (`placerJour`) : le mercredi adultes en a deux, Yves
  Bodin et Le Rallec, tous les autres jours une seule.
- À l'intérieur d'une largeur de colonne, les créneaux qui se chevauchent
  **s'imbriquent** en pourcentage de largeur (`imbriquer`, partitionnement
  glouton d'intervalles). Un créneau s'étale sur les sous-colonnes libres
  pendant sa durée : le M11 du mardi prend toute la largeur du jour, même si le
  créneau suivant se dédouble.
- Deux lignes d'en-tête (`LIGNES_ENTETE`) : le jour, puis le gymnase de chaque
  largeur de colonne — c'est ce qui rend le regroupement par gymnase lisible.
- **Un jour sans créneau** devient une colonne étroite marquée « … »
  (`LARGEUR_VIDE`) : le samedi côté adultes, le lundi et le jeudi côté jeunes.
  Les jours occupés récupèrent la largeur ainsi libérée.
- Lecture des jours : bordures de jour épaisses (`border-l-2`), fond alterné un
  jour sur deux, et séparation pointillée entre deux gymnases d'un même jour.
- **Hauteur de corps identique dans toutes les grilles** (`HAUTEUR_CORPS`,
  330 px). C'est `echelle()` qui s'en charge : chaque grille calcule sa propre
  hauteur de ligne pour arriver à ce total, quel que soit le temps couvert. Le
  tableau du dimanche fait donc exactement la même hauteur que celui de la
  semaine bien qu'il couvre trois fois plus de temps.
  > Contrepartie assumée : l'échelle minutes/pixel diffère d'une grille à
  > l'autre. Une demi-heure ne mesure pas la même chose au dimanche et en
  > semaine. On ne peut pas avoir à la fois des hauteurs égales et une échelle
  > commune quand les plages couvertes diffèrent.
- Le **pas des graduations** est le plus fin qui laisse au moins
  `ECART_MIN_GRADUATION` entre deux libellés, et **les bornes de la plage sont
  arrondies sur ce pas**. Sans cet arrondi, le dimanche (qui démarre à 10h30)
  aurait un dernier intervalle deux fois plus court avec des graduations
  horaires. L'espacement reste donc régulier à l'intérieur de chaque grille.
- Les libellés d'heure sont **centrés sur leur trait** (`-translate-y-1/2`) :
  calés par le haut, le texte pendait sous la ligne et paraissait décalé, ce qui
  se voit d'autant plus depuis le passage en `text-sm`. D'où la **ligne de
  débord** (`LIGNE_DEBORD`) en bas du gabarit, qui laisse dépasser le libellé de
  l'heure de fin.
- `maxWidth` plafonne la largeur : sans lui, une grille à peu de colonnes (le
  week-end) verrait ses `1fr` s'étirer sur toute la page.
- Colonne des heures **`sticky left-0`** — reste lisible pendant le scroll
  horizontal sur mobile ; d'où le paramètre `fond`, qui lui donne un fond opaque
- Chaque bloc porte du texte `sr-only` (jour, ville) pour rester compréhensible
  au lecteur d'écran, une grille CSS n'étant pas un tableau
- La mention « Compétition » s'affiche selon `afficheCompetition()`, pas selon la
  couleur (voir ci-dessous)

Code couleur (`--color-gvvb-*` dans `globals.css`) — **mêmes deux couleurs dans
toutes les grilles**, jeunes comme adultes :

| Type | Couleur |
|---|---|
| `competition` | fond rouge GVVB, texte blanc |
| `loisir` | fond marine GVVB (`--color-gvvb-navy`), texte blanc |

> Le loisir réutilise le marine de la charte, donc **la même couleur que les
> en-têtes de la grille**. C'est pour cela que la ligne des gymnases porte un
> filet blanc de 2 px en bas : sans lui, un bloc loisir qui démarre à la
> première ligne (le M11 du mardi, le jeu libre du dimanche) se fond dans
> l'en-tête juste au-dessus. Ne pas retirer ce filet.

### Mention « Compétition » et couleur sont deux choses distinctes

`type` pilote **la couleur**. Le champ optionnel `mentionCompetition` ajoute la
mention « Compétition » sur un créneau qui **garde la couleur loisir** : le 4×4
Féminine et le Loisir Compétition sont engagés en championnat loisir. Le helper
`afficheCompetition(creneau)` combine les deux — c'est lui qu'il faut utiliser,
pas un test sur `type`.

### `CalendrierClient`

Client Component (interactif) composé de :
- `AccordionSection` : un accordion par poule
- `StandingsTable` : classement compact, ligne GVVB en rouge
- `MatchRow` : une ligne par match
- `FormBadges` : badges V/D des 5 derniers résultats

---

## Intégration FFVB (`src/lib/ffvb.ts`)

Les données (pas d'API officielle) sont récupérées par scraping HTML de `ffvbbeach.org`.

### Fonctionnement

L'URL est construite par `ffvbUrl(poule)` depuis `saison.ts` — plus aucune URL
FFVB n'est codée en dur ailleurs dans le projet :

```
https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php
  ?saison={SAISON_FFVB}&codent={CODE_ENTITE_FFVB}&poule={CODE}
```

Le HTML est encodé en **ISO-8859-1** — décodé avec `TextDecoder("iso-8859-1")`.

La fonction `parseCells(html)` extrait le contenu textuel de toutes les `<td>`.  
Ensuite deux parsers travaillent sur ce tableau de cellules :

**`parseMatches()`** : détecte les lignes de matchs par pattern  
`CODE_MATCH → DATE(DD/MM/YY) → [HEURE] → DOMICILE → EXTÉRIEUR → [SCORE]`  
Ne conserve que les matchs où "GARCHES" apparaît.

Les codes de match sont `AMA001` jusqu'en 2025/2026 et `1MA001` depuis 2026/2027.

**`parseStandings()`** : lit le tableau **ligne par ligne en gardant les cellules
vides** (la FFVB laisse vides les colonnes à zéro : 3-0, 3-1, forfaits… ; les
ignorer décalait les colonnes V/D). Colonnes : `RANG(1.) → ÉQUIPE → PTS → J → V → D`.
Un ex-aequo est noté `.` et reprend le rang précédent.

**`fetchPoule(code, saison?)`** retourne `{ matches: Match[], standings: Standing[] }`  
avec `revalidate: 3600` (cache 1 heure).

### Interfaces TypeScript

```typescript
interface Match {
  code: string;
  date: string;       // "DD/MM/YY"
  time: string | null;
  home: string;
  away: string;
  scoreHome: string | null;
  scoreAway: string | null;
  sets: string | null;
}

interface Standing {
  rank: number;
  team: string;
  pts: number;
  played: number;
  wins: number;
  losses: number;
  isGvvb: boolean;
}
```

---

## Assets médias

### Logos

| Fichier | Usage |
|---|---|
| `logo-gvvb.png` | Navbar (fond blanc) |
| `logo-gvvb-rouge.png` | Réserve (logo rouge fond transparent) |
| `logo-gvvb-blanc.png` | Hero, footers, PageHeader watermark (sections sombres) |

### Photos (© David Adet — @davidadet_photo_video)

| Fichier | Usage principal |
|---|---|
| `photos/hero-bg.jpg` | Hero page d'accueil |
| `photos/celebration-m.jpg` | Galerie header + galerie section "Émotions" |
| `photos/celebration-f.jpg` | CTA "Rejoindre" page d'accueil |
| `photos/action-smash.jpg` | Grille accueil + galerie |
| `photos/portrait-f.jpg` | Grille accueil + galerie |
| `photos/filet-m.jpg` | Header Calendrier |
| `photos/filet-f.jpg` | Galerie |
| `photos/banc-gvvb.jpg` | Header Contact |
| `photos/supporters.jpg` | Header Le Club + galerie |
| `photos/volleyballs.jpg` | Header Équipes + galerie |
| `photos/entree-jeu.jpg` | Galerie |
| `photos/action-f2.jpg` | Galerie |
| `photos/apres-match.jpg` | Galerie |
| `photos/joueur-ballon.jpg` | Galerie |
| `photos/ballon-tattoo.jpg` | Galerie |

### Photos équipes

| Fichier | Équipe |
|---|---|
| `equipes/dep-masculine-2026.jpg` | Départementale Masculine (octobre 2026) + actualité lancement de saison |
| `equipes/dep-feminine-2026.jpg` | Départementale Féminine (octobre 2026) + actualité lancement de saison |
| `equipes/dep-feminine.jpg` | Ancienne photo Départementale Féminine, header Entraînements |
| `equipes/m15-feminine.jpg` | M13 / M15 Filles |
| `equipes/loisir-or.jpg` | Loisir OR |

Équipes **sans photo** (placeholder « Photo à venir ») : M11, M13/M15 Garçons,
M18 Filles, M18/M21 Mixte, 4×4 Féminine, Loisir Mixte, VSOP.

### Autres

| Fichier | Description |
|---|---|
| `news/maillot-rouge.png` | Nouveau maillot rouge (actualité janvier 2026) |
| `news/maillot-bleu.png` | Nouveau maillot bleu libéro |
| `sponsors/logo-lecriture.jpg` | Logo Librairie L'Écriture |
| `docs/dossier-inscription-2026-2027.pdf` | Dossier d'inscription en cours (référencé par `DOSSIER`) |
| `docs/dossier-inscription-2025-2026.pdf` | Dossier de la saison passée, conservé pour ne pas casser d'anciens liens |

---

## Déploiement

Le site est déployé automatiquement sur **Vercel** à chaque `git push` sur `main`.

### Variables d'environnement

Aucune variable d'environnement requise pour le moment (le scraping FFVB est public).

### Mise à jour du contenu

Pour les tarifs, horaires, équipes, catégories, bureau ou dossier
d'inscription : **modifier `src/lib/saison.ts`**, rien d'autre.
Les actualités restent dans le tableau `news` de `src/app/page.tsx`.

1. Modifier `src/lib/saison.ts` (ou `page.tsx` pour une actualité)
2. `npm run build` pour vérifier
3. `git add . && git commit -m "..." && git push`
4. Vercel redéploie automatiquement en ~1 minute

Les données FFVB (résultats, classements) se mettent à jour **automatiquement toutes les heures** sans intervention.

### Nettoyer le cache images en local

Si une image remplacée ne se met pas à jour en développement :
```bash
rm -rf .next/cache/images/
# ou entièrement :
rm -rf .next/
```

---

## Ce qui reste à faire

| Priorité | Tâche |
|---|---|
| Haute | Compléter les mentions légales (adresse association, email, responsable publication) |
| Haute | DNS : pointer `gvvb.fr` vers Vercel |
| Haute | Google Search Console : soumettre le sitemap |
| Haute | Ajouter le Loisir OR (et M15 / M18 si engagées) dans `POULES` dès que la FFVB publie leurs poules 2026/2027 |
| Moyenne | Confirmer le nom du gymnase du 20 rue de Suresnes : le dossier écrit « les Meuries », le site « Yves Bodin » |
| Moyenne | Photos des équipes jeunes et loisir sans visuel (voir § Photos équipes) |
| Moyenne | Vérifier les poules jeunes engagées en championnat (M18 Filles n'a pas encore de lien FFVB) |
| Basse | Page `/galerie` (documentée historiquement mais jamais créée) |
| Basse | Formulaire de contact fonctionnel (actuellement HTML statique) |

---

## Partenaire

**Librairie L'Écriture** — Vaucresson  
Site : [librairie-ecriture.com](https://www.librairie-ecriture.com)  
Instagram : [@librairie_lecriture_vaucresson](https://www.instagram.com/librairie_lecriture_vaucresson/)

Présence sur le site : section dédiée page d'accueil + logo dans le footer.
