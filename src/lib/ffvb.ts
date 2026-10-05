import { ffvbUrl } from "@/lib/saison";

export interface Match {
  code: string;
  date: string;   // DD/MM/YY
  time: string | null;
  home: string;
  away: string;
  scoreHome: string | null;
  scoreAway: string | null;
  sets: string | null;
}

export interface Standing {
  rank: number;
  team: string;
  pts: number;
  played: number;
  wins: number;
  losses: number;
  isGvvb: boolean;
}

const CLUB = "GARCHES";

function cleanCell(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCells(html: string): string[] {
  const cells: string[] = [];
  const re = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = cleanCell(m[1]);
    if (text) cells.push(text);
  }
  return cells;
}

/**
 * Cellules ligne par ligne, cellules vides comprises : le classement FFVB
 * laisse vides les colonnes à zéro (3-0, 3-1, forfaits…), les ignorer
 * décalerait les colonnes.
 */
function parseRows(html: string): string[][] {
  const rows: string[][] = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let r: RegExpExecArray | null;
  while ((r = rowRe.exec(html)) !== null) {
    const cells: string[] = [];
    const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let c: RegExpExecArray | null;
    while ((c = cellRe.exec(r[1])) !== null) cells.push(cleanCell(c[1]));
    rows.push(cells);
  }
  return rows;
}

export function parseMatches(html: string): Match[] {
  const cells = parseCells(html);
  // "AMA001" jusqu'en 2025/2026, "1MA001" depuis 2026/2027.
  const codeRe = /^[A-Z0-9]{2,4}\d{3}$/;
  const dateRe = /^\d{2}\/\d{2}\/\d{2}$/;
  const timeRe = /^\d{2}:\d{2}$/;
  const scoreRe = /^\d$/;

  const matches: Match[] = [];

  for (let i = 0; i < cells.length - 3; i++) {
    if (!codeRe.test(cells[i])) continue;
    if (!dateRe.test(cells[i + 1])) continue;

    // Deux formats possibles: avec heure (standard) ou sans heure (2e match de journée M15)
    const hasTime = timeRe.test(cells[i + 2]);
    const offset = hasTime ? 0 : -1; // décale les index si pas d'heure

    const time = hasTime ? cells[i + 2] : null;
    const home = cells[i + 3 + offset] ?? "";
    let away = cells[i + 4 + offset] ?? "";
    let scoreHome: string | null = null;
    let scoreAway: string | null = null;
    let sets: string | null = null;

    // Sans heure, vérifier que home ressemble à un nom d'équipe (pas un code match ou date)
    if (!hasTime && (codeRe.test(home) || dateRe.test(home) || timeRe.test(home))) continue;

    if (away === "xxxxx") {
      away = "";
    } else if (cells[i + 5 + offset] && scoreRe.test(cells[i + 5 + offset])) {
      scoreHome = cells[i + 5 + offset];
      scoreAway = cells[i + 6 + offset] ?? null;
      sets = cells[i + 7 + offset] ?? null;
    }

    matches.push({ code: cells[i], date: cells[i + 1], time, home, away, scoreHome, scoreAway, sets });
  }

  return matches.filter((m) => m.home.includes(CLUB) || m.away.includes(CLUB));
}

export function parseStandings(html: string): Standing[] {
  // Colonnes : rang | équipe | points | joués | gagnés | perdus | …
  // Un ex-aequo est noté "." au lieu du rang : il reprend celui de la ligne précédente.
  const rankRe = /^(\d{1,2})?\.$/;
  const num = (v: string | undefined) => (v && /^\d+$/.test(v) ? parseInt(v) : 0);
  const standings: Standing[] = [];

  for (const cells of parseRows(html)) {
    const rankMatch = rankRe.exec(cells[0] ?? "");
    const team = cells[1] ?? "";
    if (!rankMatch || !team) continue;
    // Une équipe qui n'a pas encore joué a des colonnes vides : on garde la ligne.
    if (cells[2] && !/^\d+$/.test(cells[2])) continue;
    const rank = rankMatch[1] ? parseInt(rankMatch[1]) : standings.at(-1)?.rank ?? 1;
    standings.push({
      rank,
      team,
      pts: num(cells[2]),
      played: num(cells[3]),
      wins: num(cells[4]),
      losses: num(cells[5]),
      isGvvb: team.includes(CLUB),
    });
  }

  return standings;
}

export interface PouleData {
  code: string;
  label: string;
  matches: Match[];
  standings: Standing[];
}

/** Saison figée, lue depuis `src/data/archives/<saison>.json`. */
export interface SaisonArchivee {
  /** "2025-2026" */
  saison: string;
  /** "2025/2026" - pour les liens ffvbbeach.org */
  saisonFfvb: string;
  /** Date de la capture, ISO. */
  archiveLe: string;
  poules: PouleData[];
}

export async function fetchPoule(
  poule: string,
  saison?: string,
): Promise<{ matches: Match[]; standings: Standing[] }> {
  const url = ffvbUrl(poule, saison);
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    const buf = await res.arrayBuffer();
    const html = new TextDecoder("iso-8859-1").decode(buf);
    return { matches: parseMatches(html), standings: parseStandings(html) };
  } catch {
    return { matches: [], standings: [] };
  }
}

export function formatDate(ddmmyy: string): string {
  const [d, m, y] = ddmmyy.split("/");
  const months = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} 20${y}`;
}

export function matchResult(match: Match): { gvvbScore: string; opponentScore: string; win: boolean } | null {
  if (match.scoreHome === null) return null;
  const gvvbHome = match.home.includes(CLUB);
  const gvvbScore = gvvbHome ? match.scoreHome! : match.scoreAway!;
  const oppScore = gvvbHome ? match.scoreAway! : match.scoreHome!;
  return { gvvbScore, opponentScore: oppScore, win: parseInt(gvvbScore) > parseInt(oppScore) };
}

export function opponentName(match: Match): string {
  return match.home.includes(CLUB) ? match.away : match.home;
}
