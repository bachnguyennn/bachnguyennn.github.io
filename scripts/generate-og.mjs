// Renders public/og.png (1200×630), the social preview image, from HTML using Playwright.
// Re-run after changing the headline or photo:  npm run og
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const photo = await readFile(new URL('public/profile.jpg', root));
const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=block">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #fafaf9; color: #18181b; font-family: Inter, sans-serif;
    display: flex; align-items: center; gap: 56px; padding: 0 96px; }
  img { width: 220px; height: 220px; border-radius: 50%; object-fit: cover; flex: none; }
  h1 { font-size: 76px; font-weight: 700; letter-spacing: -.02em; }
  p { margin-top: 18px; font-size: 26px; color: #52525b; line-height: 1.35; }
  .site { margin-top: 30px; font-size: 24px; color: #2f5a9e; }
</style></head>
<body>
  <img src="${photoSrc}" alt="">
  <div>
    <h1>Bach Nguyen</h1>
    <p>Machine learning, applied AI &amp; software engineering<br>Mathematics &amp; Computer Science, Ontario Tech University</p>
    <p class="site">bachnguyennn.github.io</p>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const out = fileURLToPath(new URL('public/og.png', root));
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log(`Wrote ${out}`);
