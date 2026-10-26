import { test, expect, type Page } from '@playwright/test';

const API = /ask-bach-api|127\.0\.0\.1:8000/;

/** Make the Ask Bach API unreachable, as if the backend were down. */
async function apiDown(page: Page) {
  await page.route(API, (route) => route.abort('connectionrefused'));
}

test.beforeEach(async ({ page }) => {
  await apiDown(page);
});

test('homepage shows identity, featured projects and contact', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Bach Nguyen · Machine Learning & Data Engineering');
  await expect(page.getByRole('heading', { level: 1, name: 'Bach Nguyen' })).toBeVisible();
  const selected = page.locator('main section').filter({ has: page.getByRole('heading', { name: 'Selected projects', exact: true }) });
  await expect(selected.locator('.entries > .entry')).toHaveCount(3);
  await expect(selected.getByRole('heading', { level: 3 })).toHaveText(['Ask Bach', 'MarketGuard', 'CascadedViT Continual Learning']);
  await expect(selected.getByRole('link', { name: 'All projects →', exact: true })).toHaveAttribute('href', '/projects/');
  await expect(page.getByText('Open to new-graduate machine learning engineering and data engineering roles starting after April 2027.', { exact: true })).toBeVisible();
  await expect(page.locator('#contact a[href="mailto:vubach.nguyen@ontariotechu.net"]')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bachnguyennn.github.io/');
});

test('primary navigation reaches every section', async ({ page }) => {
  await page.goto('/');
  for (const [label, path, heading] of [
    ['Research', '/research', 'Continual Learning for CascadedViT'],
    ['Projects', '/projects', 'Projects'],
    ['Experience', '/experience', 'Experience'],
    ['Resume', '/resume', 'Bach Nguyen'],
  ] as const) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${path}/?$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' }).locator('a.active')).toHaveText(label);
  }
});

test('projects page lists every project and opens write-ups at their original URLs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'All projects →', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/?$/);
  await expect(page.locator('main .entries > .entry')).toHaveCount(12);
  await expect(page.locator('main .entries > .entry h3')).toHaveText([
    'Ask Bach', 'MarketGuard', 'CascadedViT Continual Learning',
    'Hospital Readmission Risk Model', 'Electricity Load Forecasting', 'Chest X-Ray Pneumonia Detection',
    'Soccer xG / Value-Betting Engine', 'Nested Learning Architecture', 'FastText Subword Embeddings',
    'AstroLoc-ML', 'Global GDP ETL Pipeline', 'Ontario Infrastructure Analysis',
  ]);
  await page.locator('.entry', { has: page.getByRole('heading', { name: 'Ask Bach', exact: true }) }).getByRole('link', { name: 'Write-up →' }).click();
  await expect(page).toHaveURL(/\/projects\/ask-bach\/?$/);
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
  await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();
  await expect(page.getByText('Results are not public yet', { exact: false }).first()).toBeVisible();
});

test('HTML resume is complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/resume/');
  for (const section of ['Education', 'Experience', 'Research', 'Projects', 'Technical skills', 'Leadership & community', 'Certifications']) {
    await expect(page.getByRole('heading', { level: 2, name: section, exact: true })).toBeVisible();
  }
  for (const role of ['Undergraduate Thesis Researcher', 'Teaching Assistant', 'IT Intern', 'Data Engineering Volunteer', 'Events Coordinator']) {
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

test('chat opens, closes with Escape, and returns focus', async ({ page }) => {
  await page.goto('/');
  const launcher = page.getByRole('button', { name: 'Chat with me' });
  await launcher.click();
  const panel = page.getByRole('dialog', { name: 'Chat with Bach' });
  await expect(panel).toBeVisible();
  await expect(panel.getByText('An AI assistant, not Bach', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();
  await launcher.click();
  await panel.getByRole('button', { name: 'Close chat' }).click();
  await expect(panel).toBeHidden();
});

test('chat failure shows a contact fallback and the page keeps working', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Chat with me' }).click();
  await page.getByRole('button', { name: 'What is Bach researching?' }).click();
  const reply = page.locator('.msg.bot').last();
  await expect(reply).toContainText("couldn't reach the server");
  await expect(reply.getByRole('link')).toHaveAttribute('href', 'mailto:vubach.nguyen@ontariotechu.net');
  await expect(page.getByRole('button', { name: 'Send' })).toBeEnabled();
  await page.keyboard.press('Escape');
  await page.goto('/experience/');
  await expect(page.locator('#cmha-experience')).toBeVisible();
});

test('chat shows answers as plain text with their sources', async ({ page }) => {
  await page.unroute(API);
  await page.route(/\/ask$/, (route) =>
    route.fulfill({
      json: { answer: 'Bach researches continual learning. <img src=x onerror=alert(1)>', sources: [{ source: 'research.txt', chunk_id: 0 }, { source: 'project_market_guard.txt', chunk_id: 2 }] },
    }),
  );
  await page.route(/\/content\/experience$/, (route) => route.fulfill({ json: { experiences: [] } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Chat with me' }).click();
  await page.getByRole('textbox', { name: 'Your question' }).fill('What is Bach researching?');
  await page.getByRole('button', { name: 'Send' }).click();
  const answer = page.locator('.msg.bot').last();
  await expect(answer).toContainText('<img src=x onerror=alert(1)>');
  await expect(answer.locator('img')).toHaveCount(0);
  await expect(answer.locator('small')).toHaveText('Based on: research, project market guard');
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

test('pages have one h1, alt text on images, and no horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/projects/', '/projects/market-guard/', '/research/', '/experience/', '/resume/']) {
    await page.goto(path);
    await expect(page.locator('h1'), path).toHaveCount(1);
    expect(await page.locator('img:not([alt])').count(), `${path} images without alt`).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(0);
  }
});
