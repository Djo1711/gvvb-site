import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CalendrierClient from "@/components/CalendrierClient";
import { fetchPoule } from "@/lib/ffvb";
import { POULES, POULES_A_VENIR, SAISON_FFVB, SAISONS_ARCHIVEES } from "@/lib/saison";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier & Résultats",
  description: "Calendrier et résultats de toutes les équipes du GVVB.",
};

export default async function Calendrier() {
  const results = await Promise.all(POULES.map((p) => fetchPoule(p.code)));
  const pouleData = POULES.map((p, i) => ({ ...p, matches: results[i].matches, standings: results[i].standings }));

  return (
    <>
      <PageHeader
        label="Compétition"
        title="Calendrier & Résultats"
        description={`Saison ${SAISON_FFVB} - Cliquez sur une équipe pour voir ses matchs.`}
        bgImage="/photos/filet-m.jpg"
        objectPosition="20% 30%"
      />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <CalendrierClient pouleData={pouleData} saison={SAISON_FFVB} aVenir={POULES_A_VENIR} />
        <Archives />
      </section>
    </>
  );
}

function Archives() {
  if (SAISONS_ARCHIVEES.length === 0) return null;
  return (
    <div className="mt-12 flex flex-wrap items-center gap-3">
      <span className="font-heading text-xs uppercase tracking-widest text-gray-400">Saisons précédentes</span>
      {SAISONS_ARCHIVEES.map((saison) => (
        <Link
          key={saison}
          href={`/calendrier/archives/${saison}`}
          className="font-heading text-xs uppercase tracking-wider text-gvvb-red border border-gvvb-red px-4 py-2 hover:bg-gvvb-red hover:text-white transition-colors"
        >
          Saison {saison} →
        </Link>
      ))}
    </div>
  );
}
