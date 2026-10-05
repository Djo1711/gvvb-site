import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { DATE_LIMITE, DOSSIER, SAISON_CLUB, TOUTES_EQUIPES } from "@/lib/saison";

export const metadata: Metadata = {
  title: "GVVB - Club de Volley-Ball à Garches et Vaucresson (92)",
  description:
    "Rejoignez le GVVB, club de volley-ball en Hauts-de-Seine ! Équipes compétition, loisir et jeunes à Garches et Vaucresson. Inscriptions ouvertes pour la saison 2026-2027.",
};

/** Aperçu sur l'accueil : les 5 premières équipes, la page Équipes affiche tout. */
const teams = TOUTES_EQUIPES.slice(0, 5).map((e) => ({
  name: e.nom,
  level: e.niveau,
  gender: e.genre,
  href: `/equipes#${e.id}`,
}));

const news = [
  {
    date: "Octobre 2026",
    title: "La nouvelle saison est lancée !!",
    excerpt:
      "Premier week-end de championnat pour nos deux équipes départementales. Samedi soir, la Départementale Masculine a parfaitement lancé sa saison en s'imposant 3-0 sur le terrain du Sporting Club Châtillonnais (25-16, 25-21, 25-22) et pointe déjà à la 2ᵉ place. Dimanche, la Départementale Féminine s'est inclinée 3-0 à Bourg-la-Reine (19-25, 12-25, 17-25) pour son premier match : la saison ne fait que commencer ! Rendez-vous dimanche 11 octobre au gymnase Yves Bodin pour le premier match à domicile des deux équipes : les filles reçoivent LSO Colombes à 13h, les garçons l'ACBB à 15h. Venez nombreux les encourager ! Tous les résultats et le calendrier sont sur la page Calendrier.",
    featured: true,
  },
  {
    date: "Août 2026",
    title: `Inscriptions ${SAISON_CLUB} ouvertes`,
    excerpt:
      `Le dossier d'inscription ${SAISON_CLUB} est en ligne. Les cotisations vont de 135 € (Loisir dimanche matin) à 195 € (Départementale), avec une remise de 15 € dès le 2ᵉ membre d'une même famille et la possibilité de régler en plusieurs fois. Les dossiers complets sont à remettre avant ${DATE_LIMITE} : retrouvez les tarifs, les pièces à fournir et le PDF à télécharger sur la page Inscription.`,
  },
  {
    date: "Juin 2026",
    title: "Recrutement : nous cherchons des joueurs pour nos équipes départementales",
    excerpt:
      "Le GVVB recrute pour renforcer ses deux équipes compétition. La Départementale Féminine recherche une passeuse et une centrale. La Départementale Masculine recherche un passeur, un central et un pointu. Tous niveaux bienvenus. Pour toute question, contactez-nous au 06 52 18 41 42 ou sur Instagram @volley_gvvb.",
  },
  {
    date: "Juin 2026",
    title: "Nous recrutons un coach pour la Départementale Masculine",
    excerpt:
      "Le GVVB est à la recherche d'un coach pour encadrer son équipe Départementale Masculine. Nous avons une bonne base et souhaitons nous renforcer pour viser la montée en régional. Si vous êtes intéressé(e), contactez-nous au 06 52 18 41 42 ou sur Instagram @volley_gvvb.",
  },
  {
    date: "Avril 2026",
    title: "Nouveau site en ligne !",
    excerpt:
      "Le site du GVVB fait peau neuve. Restez connectés pour toutes les actualités du club.",
  },
  {
    date: "Janvier 2026",
    title: "Nouveaux maillots et nouveau logo !",
    excerpt:
      "Le GVVB dévoile sa nouvelle identité visuelle pour la saison 2025-2026. Les maillots Décathlon Pro sont arrivés début janvier : rouge pour les joueurs de champ, marine pour le libéro, arborant fièrement notre nouveau logo.",
    images: ["/news/maillot-rouge.png", "/news/maillot-bleu.png"],
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gvvb-navy overflow-hidden">
        <Image
          src="/photos/hero-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gvvb-navy/80 to-gvvb-red/60" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 flex flex-col gap-6 items-start">
          <span className="font-heading text-xs uppercase tracking-widest text-white/70">
            Garches · Vaucresson · Hauts-de-Seine
          </span>
          <div className="flex flex-row gap-12 w-full" style={{ alignItems: "center" }}>
            <h1 className="font-heading font-bold text-4xl sm:text-6xl md:text-7xl text-white leading-tight flex-1">
              GARCHES
              <br />
              VAUCRESSON
              <br />
              VOLLEY-BALL
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gvvb-blanc.png" alt="" className="hidden lg:block flex-shrink-0 pointer-events-none select-none" style={{ height: "15rem", width: "auto", alignSelf: "center" }} />
          </div>
          <p className="text-gray-300 text-lg max-w-lg">
            Rejoignez un club passionné dans les Hauts-de-Seine. Loisir,
            compétition, jeunes - il y a une équipe pour vous.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/inscription"
              className="bg-white text-gvvb-red font-heading font-semibold px-8 py-3 uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Nous rejoindre
            </Link>
            <Link
              href="/calendrier"
              className="border-2 border-white text-white font-heading font-semibold px-8 py-3 uppercase tracking-wider hover:bg-white hover:text-gvvb-red transition-colors"
            >
              Calendrier
            </Link>
          </div>
        </div>
      </section>

      {/* Accès rapide */}
      <section className="bg-gvvb-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <Link
            href="/contact"
            className="flex items-center gap-4 py-5 px-4 hover:bg-white/5 transition-colors group"
          >
            <div className="w-10 h-10 bg-gvvb-red flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-heading text-xs uppercase tracking-widest text-gray-400">Nous contacter</p>
              <p className="font-heading font-bold text-white group-hover:text-gvvb-red transition-colors">Formulaire de contact</p>
            </div>
            <svg className="w-4 h-4 text-gray-500 group-hover:text-gvvb-red transition-colors ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/inscription"
            className="flex items-center gap-4 py-5 px-4 hover:bg-white/5 transition-colors group"
          >
            <div className="w-10 h-10 bg-gvvb-red flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 9v4.5l1.5-1.5 1.06 1.06L13 17.62l-2.56-2.56L11.5 14l1.5 1.5V11h1zm1-7 5 5h-5V4z"/>
              </svg>
            </div>
            <div>
              <p className="font-heading text-xs uppercase tracking-widest text-gray-400">Inscription</p>
              <p className="font-heading font-bold text-white group-hover:text-gvvb-red transition-colors">Tarifs & dossier {SAISON_CLUB}</p>
            </div>
            <svg className="w-4 h-4 text-gray-500 group-hover:text-gvvb-red transition-colors ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Équipes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <span className="font-heading text-xs uppercase tracking-widest text-gvvb-red">
                Le club
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gvvb-navy mt-1">
                Nos équipes
              </h2>
            </div>
            <Link
              href="/equipes"
              className="font-heading text-sm uppercase tracking-wider text-gvvb-navy hover:text-gvvb-red transition-colors"
            >
              Voir toutes les équipes →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Link
                key={team.name}
                href={team.href}
                className="border border-gray-200 p-6 hover:border-gvvb-red hover:shadow-md transition-all group"
              >
                <span className="font-heading text-xs uppercase tracking-widest text-gray-400">
                  {team.level} · {team.gender}
                </span>
                <h3 className="font-heading font-bold text-xl text-gvvb-navy mt-1 group-hover:text-gvvb-red transition-colors">
                  {team.name}
                </h3>
              </Link>
            ))}
            <div className="border-2 border-dashed border-gray-200 p-6 flex items-center justify-center">
              <Link
                href="/equipes"
                className="font-heading text-sm text-gray-400 hover:text-gvvb-red transition-colors"
              >
                + Voir toutes les équipes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <span className="font-heading text-xs uppercase tracking-widest text-gvvb-red">
              Actualités
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gvvb-navy mt-1">
              Dernières nouvelles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <article
                key={item.title}
                className={`bg-white p-8 border-l-4 border-gvvb-red shadow-sm hover:shadow-md transition-shadow ${"featured" in item && item.featured ? "md:col-span-2" : ""}`}
              >
                <time className="font-heading text-xs uppercase tracking-widest text-gray-400">
                  {item.date}
                </time>
                <h3 className="font-heading font-bold text-xl text-gvvb-navy mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.excerpt}
                </p>
                {"images" in item && item.images && (
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    {item.images.map((src: string) => (
                      <div key={src} className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                        <Image src={src} alt="Nouveau maillot GVVB" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-0">
        {[
          { src: "/photos/celebration-m.jpg", alt: "L'équipe masculine célèbre" },
          { src: "/photos/action-smash.jpg",  alt: "Action en match féminin" },
          { src: "/photos/portrait-f.jpg",    alt: "Concentration avant le match" },
        ].map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover object-center hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </section>

      {/* Partenaires */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-heading text-xs uppercase tracking-widest text-gvvb-red">Partenaires</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 border border-gray-200 p-8">
            <a
              href="https://www.librairie-ecriture.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Librairie L'Écriture"
            >
              <Image
                src="/sponsors/logo-lecriture.jpg"
                alt="Librairie L'Écriture"
                width={160}
                height={160}
                className="object-contain"
              />
            </a>
            <div className="text-center sm:text-left">
              <p className="font-heading font-bold text-gvvb-navy text-xl mb-1">Librairie L&apos;Écriture</p>
              <p className="text-gray-500 text-sm mb-4">Partenaire du GVVB · Vaucresson</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <a
                  href="https://www.librairie-ecriture.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xs uppercase tracking-wider text-gvvb-red border border-gvvb-red px-4 py-2 hover:bg-gvvb-red hover:text-white transition-colors"
                >
                  librairie-ecriture.com
                </a>
                <a
                  href="https://www.instagram.com/librairie_lecriture_vaucresson/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xs uppercase tracking-wider text-gray-500 border border-gray-300 px-4 py-2 hover:border-gvvb-red hover:text-gvvb-red transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dossier inscription */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <a
            href={DOSSIER.href}
            download
            className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 border border-gray-200 hover:border-gvvb-red p-6 transition-colors group"
          >
            <div className="w-14 h-14 bg-gvvb-red flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 9v4.5l1.5-1.5 1.06 1.06L13 17.62l-2.56-2.56L11.5 14l1.5 1.5V11h1zm1-7 5 5h-5V4z"/>
              </svg>
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="font-heading font-bold text-gvvb-navy text-lg group-hover:text-gvvb-red transition-colors">
                Dossier d&apos;inscription {SAISON_CLUB}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Téléchargez et complétez le dossier, puis transmettez-le à notre trésorier avant {DATE_LIMITE}.
              </p>
            </div>
            <span className="font-heading text-sm uppercase tracking-wider text-gvvb-red border border-gvvb-red px-5 py-2 flex-shrink-0 flex items-center gap-2 group-hover:bg-gvvb-red group-hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Télécharger
            </span>
          </a>
        </div>
      </section>

      {/* CTA rejoindre */}
      <section className="relative py-20 overflow-hidden bg-gvvb-navy">
        <Image src="/photos/celebration-f.jpg" alt="" fill className="object-cover object-top opacity-30" />
        <div className="absolute inset-0 bg-gvvb-navy/75" />
        <div className="absolute right-0 bottom-0 pointer-events-none select-none hidden lg:block">
          <Image src="/logo-gvvb-blanc.png" alt="" width={320} height={320} className="" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white">
            PRÊT À REJOINDRE L&apos;ÉQUIPE ?
          </h2>
          <p className="text-gray-300 max-w-md">
            Débutant ou confirmé, il y a une place pour vous au GVVB.
            Les inscriptions {SAISON_CLUB} sont ouvertes jusqu&apos;à {DATE_LIMITE}.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/inscription"
              className="bg-gvvb-red text-white font-heading font-bold px-10 py-4 uppercase tracking-wider hover:bg-gvvb-red-dark transition-colors"
            >
              S&apos;inscrire
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-heading font-bold px-10 py-4 uppercase tracking-wider hover:bg-white hover:text-gvvb-navy transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
