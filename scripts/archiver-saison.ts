/**
 * Fige les résultats FFVB d'une saison terminée dans `src/data/archives/`.
 *
 * Usage :
 *   npx tsx scripts/archiver-saison.ts 2025/2026 "AMA=Départementale M - Poule principale" "AFC=Départementale F - Poule principale"
 *
 * Puis ajouter la saison à SAISONS_ARCHIVEES (src/lib/saison.ts) et à
 * src/data/archives/index.ts. Voir DOCUMENTATION.md § « Changer de saison ».
 */
import { writeFileSync } from "node:fs";
import { fetchPoule, type SaisonArchivee } from "@/lib/ffvb";

async function main() {
  const [saisonFfvb, ...args] = process.argv.slice(2);
  if (!/^\d{4}\/\d{4}$/.test(saisonFfvb ?? "") || args.length === 0) {
    console.error('Usage : npx tsx scripts/archiver-saison.ts 2025/2026 "CODE=Libellé" ...');
    process.exit(1);
  }

  const poules = [];
  for (const arg of args) {
    const [code, ...label] = arg.split("=");
    const { matches, standings } = await fetchPoule(code, saisonFfvb);
    if (matches.length === 0) throw new Error(`Aucun match GVVB trouvé dans la poule ${code}`);
    console.log(`${code} : ${matches.length} matchs, ${standings.length} équipes classées`);
    poules.push({ code, label: label.join("=") || code, matches, standings });
  }

  const saison = saisonFfvb.replace("/", "-");
  const archive: SaisonArchivee = { saison, saisonFfvb, archiveLe: new Date().toISOString(), poules };
  const fichier = `src/data/archives/${saison}.json`;
  writeFileSync(fichier, JSON.stringify(archive, null, 2) + "\n");
  console.log(`→ ${fichier}`);
}

main();
