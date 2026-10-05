import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CalendrierClient from "@/components/CalendrierClient";
import { ARCHIVES } from "@/data/archives";
import { SAISONS_ARCHIVEES } from "@/lib/saison";
import type { Metadata } from "next";

/** Seules les saisons figées dans src/data/archives existent. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SAISONS_ARCHIVEES.map((saison) => ({ saison }));
}

export async function generateMetadata({ params }: { params: Promise<{ saison: string }> }): Promise<Metadata> {
  const { saison } = await params;
  return {
    title: `Résultats ${saison}`,
    description: `Classements et résultats des équipes du GVVB pour la saison ${saison}.`,
  };
}

export default async function ArchiveSaison({ params }: { params: Promise<{ saison: string }> }) {
  const { saison } = await params;
  const archive = ARCHIVES[saison];
  if (!archive) notFound();

  return (
    <>
      <PageHeader
        label="Archives"
        title={`Saison ${archive.saison}`}
        description="Classements finaux et résultats - Cliquez sur une équipe pour voir ses matchs."
        bgImage="/photos/filet-m.jpg"
        objectPosition="20% 30%"
      />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <CalendrierClient pouleData={archive.poules} saison={archive.saisonFfvb} />
        <div className="mt-12">
          <Link
            href="/calendrier"
            className="font-heading text-xs uppercase tracking-wider text-gvvb-red border border-gvvb-red px-4 py-2 hover:bg-gvvb-red hover:text-white transition-colors"
          >
            ← Saison en cours
          </Link>
        </div>
      </section>
    </>
  );
}
