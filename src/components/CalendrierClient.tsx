"use client";

import { useState, type ReactNode } from "react";
import { formatDate, matchResult, opponentName, type Match, type PouleData, type Standing } from "@/lib/ffvb";
import { ffvbComiteUrl, ffvbUrl } from "@/lib/saison";

/** Équipe engagée dont la poule n'est pas encore publiée par la FFVB. */
interface PouleAVenir {
  label: string;
  statut: string;
}

function dateToNum(ddmmyy: string): number {
  const [d, m, y] = ddmmyy.split("/");
  return parseInt(`20${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`);
}

function getLast5(matches: Match[]) {
  return matches
    .filter((m) => matchResult(m) !== null)
    .sort((a, b) => dateToNum(a.date) - dateToNum(b.date))
    .slice(-5)
    .map((m) => ({ win: matchResult(m)!.win === true, code: m.code }));
}

function FormBadges({ matches }: { matches: Match[] }) {
  const last5 = getLast5(matches);
  if (last5.length === 0) return null;
  return (
    <div className="flex items-center gap-1">
      {last5.map((r) => (
        <span
          key={r.code}
          className={`font-heading font-bold text-xs w-6 h-6 flex items-center justify-center ${
            r.win ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {r.win ? "V" : "D"}
        </span>
      ))}
    </div>
  );
}

function MatchRow({ match }: { match: Match }) {
  const result = matchResult(match);
  const opponent = opponentName(match);
  const isHome = match.home.includes("GARCHES");

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
        {formatDate(match.date)}
        <span className="block text-xs text-gray-400">{match.time}</span>
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-block font-heading text-xs uppercase tracking-wide px-2 py-0.5 ${
            isHome ? "bg-gvvb-red text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {isHome ? "Dom." : "Ext."}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700 font-medium">
        {opponent || <span className="text-gray-400 italic">À déterminer</span>}
      </td>
      <td className="py-3 px-4">
        {result ? (
          <div className="flex items-center justify-end gap-3">
            {match.sets && (
              <span className="text-xs text-gray-400 text-right leading-tight hidden sm:block">
                {match.sets}
              </span>
            )}
            <span
              className={`font-heading font-bold text-sm px-3 py-1 whitespace-nowrap flex-shrink-0 ${
                result.win ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {result.gvvbScore} - {result.opponentScore}
            </span>
          </div>
        ) : (
          <div className="flex justify-end">
            <span className="text-gray-300 text-xs italic">À jouer</span>
          </div>
        )}
      </td>
    </tr>
  );
}

function StandingsTable({ standings }: { standings: Standing[] }) {
  if (standings.length === 0) return null;
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left font-heading text-xs uppercase tracking-wide text-gray-400 w-8">#</th>
              <th className="py-2 px-4 text-left font-heading text-xs uppercase tracking-wide text-gray-400">Équipe</th>
              <th className="py-2 px-3 text-center font-heading text-xs uppercase tracking-wide text-gray-400">Pts</th>
              <th className="py-2 px-3 text-center font-heading text-xs uppercase tracking-wide text-gray-400 hidden sm:table-cell">J</th>
              <th className="py-2 px-3 text-center font-heading text-xs uppercase tracking-wide text-gray-400 hidden sm:table-cell">V</th>
              <th className="py-2 px-3 text-center font-heading text-xs uppercase tracking-wide text-gray-400 hidden sm:table-cell">D</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr
                key={s.rank}
                className={`border-b border-gray-100 ${s.isGvvb ? "bg-gvvb-red text-white font-bold" : "hover:bg-white"}`}
              >
                <td className={`py-2 px-4 font-heading font-bold text-center ${s.isGvvb ? "text-white" : "text-gray-400"}`}>
                  {s.rank}
                </td>
                <td className={`py-2 px-4 ${s.isGvvb ? "text-white" : "text-gray-700"}`}>
                  {s.isGvvb ? "GVVB" : s.team}
                </td>
                <td className={`py-2 px-3 text-center font-heading font-bold ${s.isGvvb ? "text-white" : "text-gvvb-navy"}`}>
                  {s.pts}
                </td>
                <td className={`py-2 px-3 text-center hidden sm:table-cell ${s.isGvvb ? "text-red-100" : "text-gray-500"}`}>
                  {s.played}
                </td>
                <td className={`py-2 px-3 text-center hidden sm:table-cell ${s.isGvvb ? "text-red-100" : "text-gray-500"}`}>
                  {s.wins}
                </td>
                <td className={`py-2 px-3 text-center hidden sm:table-cell ${s.isGvvb ? "text-red-100" : "text-gray-500"}`}>
                  {s.losses}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FfvbLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-heading text-xs uppercase tracking-wider text-gvvb-red hover:text-gvvb-red-dark transition-colors"
    >
      {children} ↗
    </a>
  );
}

function AccordionSection({
  label,
  matches,
  standings,
  href,
}: {
  label: string;
  matches: Match[];
  standings: Standing[];
  href: string;
}) {
  const [open, setOpen] = useState(false);

  if (matches.length === 0) return null;

  const played = matches.filter((m) => matchResult(m) !== null);
  const wins = played.filter((m) => matchResult(m)?.win).length;
  const sorted = [...matches].sort((a, b) => dateToNum(a.date) - dateToNum(b.date));

  return (
    <div className="border border-gray-200 overflow-hidden">
      {/* Header cliquable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <svg
            className={`w-4 h-4 text-gvvb-red flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-heading font-bold text-gvvb-navy text-base truncate">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <FormBadges matches={matches} />
          {played.length > 0 && (
            <span className="font-heading text-xs text-gray-400 hidden sm:block whitespace-nowrap">
              {wins}V · {played.length - wins}D
            </span>
          )}
          <span className="font-heading text-xs text-gray-300 hidden md:block whitespace-nowrap">
            {matches.length} matchs
          </span>
        </div>
      </button>

      {/* Contenu déroulant */}
      {open && (
        <div className="border-t border-gray-200">
          <StandingsTable standings={standings} />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 px-4 text-left font-heading text-xs uppercase tracking-wide text-gray-400">
                    Date
                  </th>
                  <th className="py-2 px-4 text-left font-heading text-xs uppercase tracking-wide text-gray-400">
                    Lieu
                  </th>
                  <th className="py-2 px-4 text-left font-heading text-xs uppercase tracking-wide text-gray-400">
                    Adversaire
                  </th>
                  <th className="py-2 px-4 text-center font-heading text-xs uppercase tracking-wide text-gray-400">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <MatchRow key={m.code} match={m} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-right border-t border-gray-100">
            <FfvbLink href={href}>Voir la poule sur ffvbbeach.org</FfvbLink>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionAVenir({ label, statut, href }: PouleAVenir & { href: string }) {
  return (
    <div className="border border-gray-200 flex flex-wrap items-center justify-between px-5 py-4 bg-white gap-x-4 gap-y-2">
      <div className="flex items-center gap-4 min-w-0">
        <span className="w-4 h-4 flex-shrink-0" aria-hidden />
        <span className="font-heading font-bold text-gvvb-navy text-base truncate">{label}</span>
        <span className="font-heading text-xs uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 whitespace-nowrap">
          {statut}
        </span>
      </div>
      <FfvbLink href={href}>ffvbbeach.org</FfvbLink>
    </div>
  );
}

export default function CalendrierClient({
  pouleData,
  saison,
  aVenir = [],
}: {
  pouleData: PouleData[];
  /** Saison FFVB des liens externes, ex. "2026/2027". */
  saison: string;
  aVenir?: readonly PouleAVenir[];
}) {
  const hasData = pouleData.some((p) => p.matches.length > 0 || p.standings.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Impossible de charger les données FFVB.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {pouleData.map((p) => (
            <a
              key={p.code}
              href={ffvbUrl(p.code, saison)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xs uppercase tracking-wider text-gvvb-red border border-gvvb-red px-4 py-2 hover:bg-gvvb-red hover:text-white transition-colors"
            >
              {p.label} ↗
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pouleData.map((p) => (
        <AccordionSection
          key={p.code}
          label={p.label}
          matches={p.matches}
          standings={p.standings}
          href={ffvbUrl(p.code, saison)}
        />
      ))}
      {aVenir.map((p) => (
        <SectionAVenir key={p.label} {...p} href={ffvbComiteUrl(saison)} />
      ))}
    </div>
  );
}
