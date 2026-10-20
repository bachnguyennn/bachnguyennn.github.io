// Date formatting for experience and education entries. Months are stored as "YYYY-MM"
// so entries sort correctly; this turns them into "Sep 2026 – Present" style labels.
// Kept free of Astro imports so the unit tests can load it directly.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type YearMonth = `${number}-${number}`;

function parse(ym: string): { year: number; month: number } {
  const [year, month] = ym.split('-').map(Number);
  return { year, month };
}

export function formatMonth(ym: string): string {
  const { year, month } = parse(ym);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Sep 2026 – Present", "May – Aug 2025", "Feb 2024". */
export function formatRange(start: string, end: string | 'present'): string {
  if (end === 'present') return `${formatMonth(start)} – Present`;
  if (start === end) return formatMonth(start);
  const s = parse(start);
  const e = parse(end);
  if (s.year === e.year) return `${MONTHS[s.month - 1]} – ${MONTHS[e.month - 1]} ${e.year}`;
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

/** Sort key: ongoing roles first, then by most recent end, then most recent start. */
export function compareRanges(
  a: { start: string; end: string | 'present' },
  b: { start: string; end: string | 'present' },
): number {
  const endKey = (e: string) => (e === 'present' ? '9999-99' : e);
  return endKey(b.end).localeCompare(endKey(a.end)) || b.start.localeCompare(a.start);
}
