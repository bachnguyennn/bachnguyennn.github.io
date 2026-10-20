// Reconciles experience records from the Ask Bach content API (GET /content/experience,
// backed by Cosmos DB) with the static entries already rendered into the page.
//
// Policy, chosen so that search engines, no-JS visitors and JS visitors see the same history:
//   1. The static record in src/data/experience.ts is canonical. An API record whose id matches
//      a static entry never replaces it, even if the API copy differs (the API copy is often a
//      shorter summary written for the chatbot). Differences are reported for maintenance.
//   2. API records with a new id are added only if they pass validation, are de-duplicated by
//      id, and are placed by date among the static entries.
//   3. Anything malformed is dropped; a bad or empty response changes nothing.
// No Astro or DOM imports, so this runs in the browser and in `node --test`.

export interface ApiExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
}

export interface StaticEntryRef {
  id: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM or "present"
}

export interface MergePlan {
  /** New records to insert, each with the id of the static entry it should precede (null = append). */
  additions: { record: ApiExperience; before: string | null }[];
  /** Known ids whose API copy differs from the page; the page copy is kept. */
  ignored: string[];
  /** Records rejected by validation. */
  rejected: number;
}

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,80}$/;
const MAX_TEXT = 400;

const cleanText = (v: unknown): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.replace(/\s+/g, ' ').trim();
  return s && s.length <= MAX_TEXT ? s : null;
};

/** Validate one untrusted API record. Returns null if it should not be shown. */
export function validateRecord(input: unknown): ApiExperience | null {
  if (!input || typeof input !== 'object') return null;
  const r = input as Record<string, unknown>;
  const id = typeof r.id === 'string' && ID_PATTERN.test(r.id) ? r.id : null;
  const role = cleanText(r.role);
  const organization = cleanText(r.organization);
  const period = cleanText(r.period);
  if (!id || !role || !organization || !period) return null;
  const highlights = Array.isArray(r.highlights)
    ? r.highlights.map(cleanText).filter((h): h is string => h !== null).slice(0, 8)
    : [];
  return { id, role, organization, period, highlights };
}

/** Extract the records array from an untrusted payload. */
export function parsePayload(payload: unknown): { records: ApiExperience[]; rejected: number } {
  const list = payload && typeof payload === 'object' ? (payload as { experiences?: unknown }).experiences : undefined;
  if (!Array.isArray(list)) return { records: [], rejected: 0 };
  const seen = new Set<string>();
  const records: ApiExperience[] = [];
  let rejected = 0;
  for (const item of list.slice(0, 50)) {
    const rec = validateRecord(item);
    if (!rec) rejected++;
    else if (!seen.has(rec.id)) {
      seen.add(rec.id);
      records.push(rec);
    }
  }
  return { records, rejected };
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
};

/** Best-effort parse of "May 2025 – August 2025" / "Sep 2026 – Present" / "Feb 2024". */
export function parsePeriod(period: string): { start: string; end: string } | null {
  const found = [...period.matchAll(/([A-Za-z]{3,9})\.?\s+(\d{4})/g)]
    .map(([, m, y]) => {
      const month = MONTHS[m.toLowerCase().slice(0, m.toLowerCase().startsWith('sept') ? 4 : 3)];
      return month ? `${y}-${String(month).padStart(2, '0')}` : null;
    })
    .filter((v): v is string => v !== null);
  if (!found.length) return null;
  const start = found[0];
  const end = /present|current|now/i.test(period) ? 'present' : (found[1] ?? start);
  return { start, end };
}

const endKey = (e: string) => (e === 'present' ? '9999-99' : e);
const isNewer = (a: { start: string; end: string }, b: { start: string; end: string }) =>
  endKey(a.end) > endKey(b.end) || (endKey(a.end) === endKey(b.end) && a.start > b.start);

export function planMerge(staticEntries: StaticEntryRef[], payload: unknown): MergePlan {
  const { records, rejected } = parsePayload(payload);
  const known = new Set(staticEntries.map((e) => e.id));
  const plan: MergePlan = { additions: [], ignored: [], rejected };

  for (const record of records) {
    if (known.has(record.id)) {
      plan.ignored.push(record.id);
      continue;
    }
    const range = parsePeriod(record.period);
    const before = range ? (staticEntries.find((e) => isNewer(range, e))?.id ?? null) : null;
    plan.additions.push({ record, before });
  }
  return plan;
}
