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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Newsreader:opsz,wght@6..72,500&display=block">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #f6f5f1; font-family: Inter, sans-serif; color: #12161f;
    display: grid; grid-template-columns: 1fr 360px; gap: 64px; padding: 72px 80px; position: relative;
    background-image: repeating-linear-gradient(to right, rgba(196,192,181,.35) 0 1px, transparent 1px 96px); }
  .copy { display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font: 500 20px ui-monospace, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; color: #626a7b; }
  h1 { margin-top: 18px; font: 500 96px/1 Newsreader, Georgia, serif; letter-spacing: -.03em; }
  .role { margin-top: 22px; font: italic 500 34px/1.25 Newsreader, Georgia, serif; color: #2b3240; }
  .tags { display: flex; gap: 12px; margin-top: 40px; flex-wrap: wrap; }
  .tags span { padding: 8px 14px; border: 1px solid #c4c0b5; border-radius: 6px; background: #fff; font: 400 20px ui-monospace, Menlo, monospace; color: #4f5767; }
  .photo { align-self: center; height: 450px; border-radius: 24px; overflow: hidden; border: 1px solid #e2dfd7; }
  .photo img { width: 100%; height: 100%; object-fit: cover; }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #2b54c4; }
</style></head>
<body>
  <div class="copy">
    <p class="eyebrow">Ontario Tech University · Class of 2027</p>
    <h1>Bach Nguyen</h1>
    <p class="role">Machine Learning, Applied AI &amp; Software Engineering</p>
    <div class="tags"><span>Continual learning</span><span>RAG on Azure</span><span>Spark · Delta Lake</span></div>
  </div>
  <div class="photo"><img src="${photoSrc}" alt=""></div>
  <div class="bar"></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const out = fileURLToPath(new URL('public/og.png', root));
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log(`Wrote ${out}`);
