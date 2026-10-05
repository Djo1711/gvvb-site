import type { SaisonArchivee } from "@/lib/ffvb";
import saison2025_2026 from "./2025-2026.json";

/** Une entrée par fichier JSON généré par scripts/archiver-saison.ts. */
export const ARCHIVES: Record<string, SaisonArchivee> = {
  "2025-2026": saison2025_2026,
};
