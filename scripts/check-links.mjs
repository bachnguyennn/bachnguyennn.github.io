// Checks every internal link and asset reference in dist/ (run after `npm run build`).
// Verifies that the target file exists and that any #fragment matches an id on the target page.
// External URLs are not fetched. Usage: node scripts/check-links.mjs [distDir]
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const base = (process.env.PUBLIC_BASE_PATH ?? '/').replace(/\/$/, '');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const exists = async (p) => stat(p).then((s) => s, () => null);

async function resolveTarget(pathname) {
  let p = decodeURIComponent(pathname);
  if (base && p.startsWith(base)) p = p.slice(base.length) || '/';
  const file = join(dist, p);
  const s = await exists(file);
  if (s?.isFile()) return file;
  if (s?.isDirectory()) return (await exists(join(file, 'index.html'))) ? join(file, 'index.html') : null;
  if (await exists(`${file}.html`)) return `${file}.html`;
  return null;
}

const idCache = new Map();
async function idsOf(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

const pages = (await walk(dist)).filter((f) => f.endsWith('.html'));
const problems = [];
let checked = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const pageUrl = new URL(`http://site/${relative(dist, page).replace(/index\.html$/, '')}`);
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  const srcsets = [...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]));

  for (const ref of [...refs, ...srcsets]) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref) || ref.startsWith('//')) continue;
    const url = new URL(ref.replace(/&amp;/g, '&'), pageUrl);
    if (url.host !== 'site') continue;
    checked++;
    const target = url.pathname === pageUrl.pathname && ref.startsWith('#') ? page : await resolveTarget(url.pathname);
    const from = relative(dist, page);
    if (!target) {
      problems.push(`${from}: missing ${ref}`);
      continue;
    }
    const frag = decodeURIComponent(url.hash.slice(1));
    if (frag && target.endsWith('.html') && !(await idsOf(target)).has(frag)) {
      problems.push(`${from}: no #${frag} on ${relative(dist, target)}`);
    }
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} broken internal link(s):\n  ${[...new Set(problems)].join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${checked} internal links and assets across ${pages.length} pages resolve.`);
