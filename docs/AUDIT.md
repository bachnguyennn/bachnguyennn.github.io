# Portfolio audit and redesign record (October 2026)

Sources checked: this repository, `public/Resume.pdf` (Sep 2026), the public GitHub repositories, the live
Ask Bach API (`/openapi.json`, `/content/experience`, one `/ask` request), and the Ask Bach knowledge-base
documents in `AskBachBot/app/data/documents/`.

## What was kept

- Astro + TypeScript, static output, GitHub Pages workflow, project content collection.
- Every existing URL: `/`, `/projects/`, `/research/`, `/experience/`, and all eight case-study slugs.
- The Ask Bach integration and API contract (`POST /ask` → `{answer, sources}`, `GET /content/experience`).
- Brand mark, logo lockup, favicons, profile photo, and all existing project figures.

## Findings and fixes

| # | Finding | Fix |
|---|---|---|
| 1 | `astro.config.mjs` fell back to `https://example.github.io`. Local builds and the Azure Static Web Apps build emitted canonical URLs and a sitemap on `example.github.io`. | Fallback is now the production origin; `robots.txt` is generated from the same config. Verified for root and sub-path builds. |
| 2 | Experience API reconciliation: any API record replaced the static entry with the same id. The live API returns a shorter CMHA record that drops two bullets and rewords "an estimated 5+ hours" as "saved over five staff hours", so JS visitors saw a less complete and less accurate history than search engines. New records were always appended at the end; no timeout or validation. | `src/lib/experience-merge.ts`: static record wins for known ids, new ids are validated, de-duplicated and placed by date, 6 s timeout, text-only rendering. Unit and browser tests cover the live payload. IDs were present and stable; they are now also validated as unique at build time. |
| 3 | Facts duplicated in the homepage, `/experience/`, `courses.ts` and project write-ups, and out of sync with the PDF (a missing CMHA bullet, no CPG/SEMA detail). | Typed data modules in `src/data/`; projects carry structured frontmatter used by cards, filters and the HTML resume. |
| 4 | No HTML resume; the nav "Resume" link opened the PDF in a new tab. | `/resume/`: complete semantic resume, no JS required, print stylesheet, print and PDF actions. |
| 5 | Google Fonts loaded via CSS `@import` (render-blocking chain); no Open Graph image; generic structured data. | `<link>` with preconnect; generated `public/og.png`; Person/ProfilePage/CreativeWork JSON-LD; unique titles and descriptions. |
| 6 | Chat: no timeout (a hung request spun forever), no AI disclosure, no starters, no keyboard-safe mobile layout. | Rebuilt widget: disclosure, starters, 45 s timeout with a "waking up" notice, safe Markdown-lite rendering, email/LinkedIn fallback, collapsible sources mapped to site pages, iOS keyboard handling. |
| 7 | Print in dark mode: dark-theme selectors outranked print overrides. | Print overrides now match the dark selectors' specificity. |
| 8 | Unused `blog` collection, `design_handoff_field_notes/` and `public/tools/*.svg`. | Left in place (not routed or referenced); safe to delete. |

## Content corrections (claims made more precise)

- **Hospital readmission.** The split sorts by `encounter_id`; the dataset has no admission dates. It is now
  described as an ordered hold-out, not a verified chronological or "leakage-free" validation. AUPRC is shown
  against the ~0.09 no-skill baseline.
- **Electricity forecasting.** The write-up said "a day ahead"; the models use the previous hour's load, so the
  0.81% MAPE is a one-hour-ahead result. Added the missing persistence baseline as a limitation.
- **Ask Bach.** Recall@3 is now reported as 10/10 on 5 questions + 5 paraphrases, BM25 ties hybrid on recall,
  MRR was added post hoc, and the Cosmos DB parity check applies to dense retrieval.
- **MarketGuard.** Separates the deployed collector, the local/CI Kafka-Spark path, manually published
  snapshots, and the synthetic fallback. The demo link is labeled "Dashboard", not "Live demo".
- **Nested Learning.** The base reproduction was imported from `kmccleary3301/nested_learning` (Apache-2.0).
  The page now credits it and lists only Bach's commits (FLA kernels, multi-head FLA, slot memory,
  fast-weight dropout, a config bug fix, the refinement-block ablation). The "+2.1 perplexity from the memory
  vault" headline was removed because no result in the repository supports it.
- **Chest X-ray.** Added specificity (79.5%) and precision next to the 96.9% recall.
- **Statistics Without Borders.** Uses "sample Azure data pipelines", matching the knowledge base.
- **Global GDP ETL.** "Multi-source records … longitudinal analysis" replaced with what the repository does
  (one scraped table → CSV + SQLite, queried with SQL, logged).

## Open questions for Bach

1. **CPG results are already public.** `github.com/bachnguyennn/CPG_vclab` is public and the chatbot document
   `project_cpg_cascadedvit.txt` quotes detailed results (e.g. 80.07% CViT-S@128). The research page does not
   repeat them. Confirm with Dr. Qureshi whether they may be published; if not, consider making the repository
   private and removing that document from the knowledge base.
2. **Nested Learning attribution.** The KB says "Bach built a mechanism-level reproduction of HOPE", and the
   repository README is the upstream README. Recommend fixing both. Where does "+2.1 perplexity" come from?
3. **Is the MarketGuard collector still running** on Azure Container Apps? The page says "was deployed".
4. **Dean's List count.** The PDF says "Dean's List" with no count; the site and KB say 2×.
5. **Orientation Leader & Peer Mentor (Fall 2024)** was added from the KB. Confirm. Customer-service roles
   (Chatime, Shaker) from the KB were not added.
6. **Hack Hive hackathon** (Azure and AI challenges) is in the KB but not on the site; date and outcome unknown.
7. **PDF updates needed** to match the site: "chronological … leakage-free" wording for the readmission
   project, "sample" Azure pipelines, the GDP ETL bullets, and the Dean's List count.
8. **GDP ETL year.** The resume says 2025; the KB says 2024–2025; the last commit is December 2024.
