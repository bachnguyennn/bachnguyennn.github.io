# bachnguyennn.github.io

Personal portfolio of Bach Nguyen: projects, thesis research, experience, and a full HTML resume.
Static [Astro](https://astro.build) site, deployed to GitHub Pages. The "Ask Bach" chat widget talks to a
separate FastAPI service ([AskBachBot](https://github.com/bachnguyennn/AskBachBot)); the site works fully without it.

## Commands

```bash
npm ci                # install
npm run dev           # local dev server (http://localhost:4321)
npm run build         # production build to dist/
npm run preview       # serve dist/

npm run check         # astro check (TypeScript + templates)
npm test              # unit tests (node:test) for the experience reconciliation logic
npm run test:links    # every internal link, asset and #anchor in dist/ resolves (run after build)
npm run test:e2e      # build + Playwright smoke tests, desktop and mobile (API calls are mocked)
npm run verify        # all of the above
npm run og            # regenerate public/og.png (social preview image)
```

First Playwright run: `npx playwright install chromium`.

## Where content lives

Edit facts in one place; every page and the HTML resume read from these files.

| What | File |
|---|---|
| Name, email, links, headline, availability | `src/data/profile.ts` |
| Roles (work, research, teaching, leadership) | `src/data/experience.ts` (validated with Zod at build time) |
| Degree, GPA, honours, coursework | `src/data/education.ts` |
| Skills (resume) | `src/data/skills.ts`; homepage tool chips are in `src/pages/index.astro` |
| Thesis summary, milestones, references | `src/data/research.ts` |
| Certifications | `src/data/certifications.ts` |
| Projects (list entry + write-up) | `src/content/projects/<slug>.md`; schema in `src/content.config.ts` |

A project's frontmatter drives its list entry, status, key result and resume bullets (`resume:`);
the Markdown body is the write-up at `/projects/<slug>/`. Projects with `featured: true` appear on the homepage.

**The PDF resume (`public/Resume.pdf`) is a separate file.** Editing the data above does not change it.
Regenerate it separately (it was exported from a browser) and update `resumePdfUpdated` in `profile.ts`.

## Experience API

`/experience/` asks `GET {PUBLIC_CHAT_API_URL}/content/experience` (Cosmos DB) for records not on the page.
The static record is canonical: API records with a known `id` never replace page content, new ids are
validated, de-duplicated and inserted by date, and failures or timeouts change nothing.
See `src/lib/experience-merge.ts`.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PUBLIC_SITE_URL` | `https://bachnguyennn.github.io` | Canonical origin for URLs, sitemap, robots.txt |
| `PUBLIC_BASE_PATH` | `/` | Sub-path deployments |
| `PUBLIC_CHAT_API_URL` | deployed Azure Container App | Ask Bach backend; `.env.development` points dev at `http://127.0.0.1:8000` |

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: type-check, unit tests, build, link check, then deploy
to GitHub Pages. `.github/workflows/ci.yml` runs the Playwright suite separately. An Azure Static Web Apps
workflow also deploys `main`; the chat backend's CORS policy only allows the GitHub Pages origin, so the
chat shows its fallback message there.

See `docs/AUDIT.md` for the 2026-10 redesign audit and open questions.
