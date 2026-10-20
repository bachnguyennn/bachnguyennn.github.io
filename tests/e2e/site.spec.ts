import { test, expect, type Page } from '@playwright/test';

const API = /ask-bach-api|127\.0\.0\.1:8000/;

/** Make the Ask Bach API unreachable, as if the backend were down. */
async function apiDown(page: Page) {
  await page.route(API, (route) => route.abort('connectionrefused'));
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 821;

async function openNav(page: Page) {
  if (isMobile(page)) await page.getByRole('button', { name: 'Menu' }).click();
}

test.beforeEach(async ({ page }) => {
  await apiDown(page);
});

test('homepage shows identity, featured work and contact', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bach Nguyen/);
  await expect(page.getByRole('heading', { level: 1, name: 'Bach Nguyen' })).toBeVisible();
  await expect(page.getByText('Machine Learning, Applied AI & Software Engineering').first()).toBeVisible();
  for (const name of ['Ask Bach', 'MarketGuard', 'CascadedViT Continual Learning', 'Chest X-Ray Pneumonia Detection']) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await expect(page.locator('a[href^="mailto:vubach.nguyen@ontariotechu.net"]').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bachnguyennn.github.io/');
});

test('primary navigation reaches every section', async ({ page }) => {
  await page.goto('/');
  for (const [label, path, heading] of [
    ['Projects', '/projects/', 'Projects'],
    ['Research', '/research/', 'Continual Learning for Efficient Vision Transformers'],
    ['Experience', '/experience/', 'Research, teaching, and industry'],
    ['Resume', '/resume/', 'Bach Nguyen'],
    ['Contact', '/contact/', 'Get in touch'],
  ] as const) {
    await openNav(page);
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    // The collapsed mobile menu is hidden from role queries, so check the markup directly.
    await expect(page.locator('#primary-nav a[aria-current="page"]')).toHaveText(label);
  }
});

test('projects directory lists every project and filters by area', async ({ page }) => {
  await page.goto('/projects/');
  const cards = page.locator('.project-card');
  await expect(cards).toHaveCount(12);
  await page.getByRole('button', { name: /^Data engineering/ }).click();
  await expect(page.getByRole('button', { name: /^Data engineering/ })).toHaveAttribute('aria-pressed', 'true');
  const visible = page.locator('.project-card:visible');
  await expect(visible.first()).toBeVisible();
  for (const c of await visible.all()) await expect(c).toHaveAttribute('data-categories', /\bdata\b/);
  await expect(page).toHaveURL(/area=data/);
  await page.getByRole('button', { name: /^All/ }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(12);
});

test('case studies open from the directory and keep their original URLs', async ({ page }) => {
  await page.goto('/projects/');
  await page.getByRole('link', { name: /Read the case study on Ask Bach/ }).click();
  await expect(page).toHaveURL(/\/projects\/ask-bach\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ask Bach');
  await expect(page.getByRole('heading', { name: 'Evaluation' })).toBeVisible();

  for (const slug of ['market-guard', 'hospital-readmission', 'chest-xray-pneumonia', 'energy-demand-forecasting', 'expected-goals', 'astrolok', 'fasttext-embeddings', 'nested-learning']) {
    const res = await page.goto(`/projects/${slug}/`);
    expect(res?.status(), slug).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('research page explains the thesis without claiming results', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.getByText('Dr. Faisal Qureshi').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Progress and my contributions' })).toBeVisible();
  await expect(page.getByText('Results are not public yet', { exact: false }).first()).toBeVisible();
});

test('HTML resume is complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/resume/');
  for (const section of ['Summary', 'Education', 'Experience', 'Research', 'Projects', 'Technical skills', 'Leadership & community', 'Certifications']) {
    await expect(page.getByRole('heading', { level: 2, name: section, exact: true })).toBeVisible();
  }
  for (const role of ['Undergraduate Thesis Researcher', 'Teaching Assistant', 'IT Intern', 'Data Engineer (Volunteer)', 'Events Coordinator']) {
    await expect(page.getByText(role, { exact: false }).first()).toBeVisible();
  }
  await expect(page.getByText('an estimated 5+ hours', { exact: false })).toBeVisible();
  await expect(page.getByText('3.77 / 4.3', { exact: false }).first()).toBeVisible();
  await context.close();
});

test('PDF resume is served', async ({ page, request }) => {
  await page.goto('/resume/');
  const href = await page.getByRole('link', { name: 'Download PDF' }).getAttribute('href');
  const res = await request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('contact page links to email, LinkedIn and GitHub', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('main a[href="mailto:vubach.nguyen@ontariotechu.net"]').first()).toBeVisible();
  await expect(page.locator('main a[href="https://www.linkedin.com/in/bach-nguyen-vu"]').first()).toBeVisible();
  await expect(page.locator('main a[href="https://github.com/bachnguyennn"]').first()).toBeVisible();
});

test('chat opens, closes with Escape, and returns focus', async ({ page }) => {
  await page.goto('/');
  const launcher = page.getByRole('button', { name: /Ask Bach/ });
  await launcher.click();
  const panel = page.getByRole('dialog', { name: /Ask Bach/ });
  await expect(panel).toBeVisible();
  await expect(panel.getByText('It is a bot, not Bach', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();
  await launcher.click();
  await panel.getByRole('button', { name: 'Close chat' }).click();
  await expect(panel).toBeHidden();
});

test('chat failure shows a contact fallback and the page keeps working', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Ask Bach/ }).click();
  await page.getByRole('button', { name: 'What is Bach researching?' }).click();
  const error = page.locator('.msg.error');
  await expect(error).toContainText('isn’t available right now');
  await expect(error.getByRole('link', { name: 'email' })).toHaveAttribute('href', 'mailto:vubach.nguyen@ontariotechu.net');
  await expect(page.getByRole('button', { name: 'Send question' })).toBeEnabled();
  await page.keyboard.press('Escape');
  await page.goto('/experience/');
  await expect(page.locator('#cmha-experience')).toBeVisible();
});

test('chat renders answers as text and lists sources', async ({ page }) => {
  await page.unroute(API);
  await page.route(/\/ask$/, (route) =>
    route.fulfill({
      json: { answer: 'Bach is researching **continual learning**.\n\n<img src=x onerror=alert(1)>', sources: [{ source: 'research.txt', chunk_id: 0 }, { source: 'unknown_doc.txt', chunk_id: 2 }] },
    }),
  );
  await page.route(/\/content\/experience$/, (route) => route.fulfill({ json: { experiences: [] } }));
  await page.goto('/');
  await page.getByRole('button', { name: /Ask Bach/ }).click();
  await page.getByRole('textbox', { name: 'Your question' }).fill('What is Bach researching?');
  await page.getByRole('button', { name: 'Send question' }).click();
  const answer = page.locator('.msg.bot').last();
  await expect(answer.locator('strong')).toHaveText('continual learning');
  await expect(answer.locator('img')).toHaveCount(0);
  await answer.getByText('Based on 2 sources').click();
  await expect(answer.getByRole('link', { name: 'Thesis research' })).toBeVisible();
  await expect(answer.getByText('unknown doc')).toBeVisible();
});

test('experience API cannot replace or duplicate the static record', async ({ page }) => {
  await page.unroute(API);
  await page.route(/\/content\/experience$/, (route) =>
    route.fulfill({
      json: {
        experiences: [
          { id: 'cmha-experience', role: 'IT Intern', organization: 'CMHA', period: 'May 2025 – August 2025', highlights: ['Short summary'] },
          { id: 'new-ml-role', role: 'ML Intern', organization: 'Example Co', period: 'May 2026 – Aug 2026', highlights: ['<b>Escaped</b>'] },
          { id: 'new-ml-role', role: 'Duplicate', organization: 'Example Co', period: 'May 2026 – Aug 2026', highlights: [] },
          { id: 'Bad Id', role: 'x', organization: 'y', period: 'z' },
        ],
      },
    }),
  );
  await page.goto('/experience/');
  const list = page.locator('[data-experience-list][data-api]');
  await expect(list.locator('[data-id="new-ml-role"]')).toHaveCount(1);
  await expect(list.locator('[data-id="cmha-experience"]')).toHaveCount(1);
  await expect(list.locator('#cmha-experience')).toContainText('an estimated 5+ hours');
  await expect(list.locator('[data-id="new-ml-role"]')).toContainText('<b>Escaped</b>');
  // Placed by date: after the ongoing roles, before the 2025 internship.
  const ids = await list.locator(':scope > li').evaluateAll((els) => els.map((e) => e.getAttribute('data-id')));
  expect(ids.indexOf('new-ml-role')).toBe(ids.indexOf('cmha-experience') - 1);
});

test('mobile menu opens, navigates, and closes with Escape', async ({ page }) => {
  test.skip(!isMobile(page), 'mobile only');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research' }).click();
  await expect(page).toHaveURL(/\/research\/$/);
});

test('pages have one h1, alt text on images, and no horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/projects/', '/projects/market-guard/', '/research/', '/experience/', '/resume/', '/contact/']) {
    await page.goto(path);
    await expect(page.locator('h1'), path).toHaveCount(1);
    const missingAlt = await page.locator('img:not([alt])').count();
    expect(missingAlt, `${path} images without alt`).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(0);
  }
});
