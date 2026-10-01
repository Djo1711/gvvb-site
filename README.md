# Site GVVB — Garches Vaucresson Volley-Ball

Site officiel du club de volley-ball de Garches et Vaucresson.

**🌐 [gvvb-zeta.vercel.app](https://gvvb-zeta.vercel.app)**

## Ce qu'on y trouve

- **Le club** : présentation, bureau, contacts
- **Équipes** : les 11 équipes (compétition, jeunes, loisir)
- **Entraînements** : emploi du temps de la semaine par catégorie
- **Inscription** : tarifs, pièces à fournir, dossier PDF à télécharger
- **Calendrier** : matchs, résultats et classements récupérés automatiquement sur le site de la FFVB (scraping HTML, sans API officielle), avec liens directs de secours si la récupération échoue

## Stack

- [Next.js](https://nextjs.org) (App Router) · React · TypeScript
- Tailwind CSS v4
- Déployé sur Vercel, mise en production automatique depuis `main`

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Mettre à jour la saison

Toutes les données du club (saison, créneaux, tarifs, équipes, poules FFVB…) sont regroupées dans **`src/lib/saison.ts`** ; les pages ne font que la mise en forme.
La procédure complète de changement de saison est décrite dans [`DOCUMENTATION.md`](DOCUMENTATION.md).
