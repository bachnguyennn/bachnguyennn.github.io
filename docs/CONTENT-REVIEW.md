# Portfolio content review — October 26, 2026

Local copy and data changes only. No commit, push, deployment, PDF edit or AskBachBot write.
The existing CSS, components, fonts, colours and page structure are preserved. `src/data/skills.ts`,
all `toolGroups` declarations/chips, experience ids, project slugs and URLs are unchanged.

## Before / after: every site copy change

Rows are source fields, so a shared field covers every page that renders it. HTML entities are decoded,
line wrapping is collapsed, and the existing research link is shown as plain text. Shared profile
expressions show their rendered values. Original facts and numbers are retained.

| Source / field | Before | After |
| --- | --- | --- |
| `src/data/profile.ts` — profile: headline | Machine Learning, Applied AI & Software Engineering | Machine Learning & Data Engineering |
| `src/data/profile.ts` — profile: shortBio / Person JSON-LD description | Mathematics and Computer Science student at Ontario Tech University. I research continual learning for efficient vision transformers and build software that connects machine learning, data infrastructure, and the cloud. | I build machine learning systems and the data pipelines behind them. I'm a Mathematics and Computer Science student at Ontario Tech University researching how small vision models can keep learning new tasks. |
| `src/data/profile.ts` — profile: availability / homepage availability | Open to new-graduate Machine Learning, Applied AI, and Software Engineering roles starting after April 2027. | Open to new-graduate machine learning engineering and data engineering roles starting after April 2027. |
| `src/pages/index.astro` — homepage: browser / social title | Bach Nguyen · Machine Learning & Software Engineering | Bach Nguyen · Machine Learning & Data Engineering |
| `src/pages/index.astro` — homepage: meta / social description | Bach Nguyen is a Mathematics and Computer Science student at Ontario Tech University researching continual learning for efficient vision transformers and building ML, data, and cloud software. Graduating April 2027. | Bach Nguyen builds machine learning systems and data pipelines and researches continual learning for efficient vision models at Ontario Tech University. Open to new-graduate ML engineering and data engineering roles after April 2027. |
| `src/pages/index.astro` — homepage: role line | Mathematics & Computer Science, Ontario Tech University · graduating April 2027 | Machine Learning & Data Engineering · Ontario Tech University · graduating April 2027 |
| `src/pages/index.astro` — homepage: lead (research link retained) | I work on machine learning, applied AI, and software engineering. I'm doing undergraduate thesis research on continual learning for efficient vision transformers in the Visual Computing Lab, and I build software that connects ML with data infrastructure and the cloud. | I build machine learning systems and the data pipelines behind them. My undergraduate thesis in the Visual Computing Lab studies how small, efficient vision models can keep learning new tasks without forgetting earlier ones. |
| `src/pages/index.astro` — homepage: availability (now reads shared profile data) | I'm looking for new-graduate roles in machine learning, applied AI, and software engineering starting after April 2027. | Open to new-graduate machine learning engineering and data engineering roles starting after April 2027. |
| `src/pages/index.astro` — homepage: About, work paragraph | I like problems that sit between software, data, and mathematics. I've automated scheduling and supported IT systems at the Canadian Mental Health Association, designed Azure data pipelines with Statistics Without Borders, and I'm now doing undergraduate research in continual learning and computer vision. I also TA a first-year engineering math course and help run the CS Club's hackathon. | At the Canadian Mental Health Association, I automated scheduling and supported IT systems. In a short Statistics Without Borders project, I designed sample Azure data pipelines. I now research continual learning and computer vision, TA first-year engineering math, and help run the CS Club's hackathon. |
| `src/layouts/BaseLayout.astro` — all pages: default OG / Twitter image alt | Bach Nguyen — Machine Learning, Applied AI & Software Engineering | Bach Nguyen — Machine Learning & Data Engineering |
| `scripts/generate-og.mjs` — social image: headline (also regenerated public/og.png) | Machine learning, applied AI & software engineering | Machine Learning & Data Engineering |
| `src/pages/projects/index.astro` — projects: meta / social description | Machine learning, applied AI, computer vision, and data engineering projects by Bach Nguyen, with write-ups covering design, evaluation, and limitations. | Machine learning and data engineering projects by Bach Nguyen, with write-ups covering design, evaluation, and limitations. |
| `src/pages/resume.astro` — HTML resume: meta / social description | Resume of Bach Nguyen: BSc Integrated Mathematics and Computer Science at Ontario Tech University (April 2027), thesis research in continual learning, ML and data engineering projects, and industry experience. | Bach Nguyen's resume for new-graduate machine learning engineering and data engineering roles after April 2027: Ontario Tech University, continual learning thesis, projects, and IT internship. |
| `src/content/projects/ask-bach.md` — ask-bach: summary | A retrieval-augmented chatbot that answers questions about my work from a curated knowledge base, served by FastAPI on Azure Container Apps and built into this site. | A chatbot that answers questions about my work using notes I wrote and lists its sources. Try it with the chat button on this page. |
| `src/content/projects/market-guard.md` — market-guard: summary | A medallion-architecture pipeline that archives live Coinbase trades in Azure, builds one-minute market metrics with Spark and Delta Lake, and flags statistical volume and price anomalies. | A pipeline that turns a live crypto trade feed into per-minute market metrics and anomaly alerts, designed to avoid double-counting during replays and restarts. The dashboard shows manually refreshed snapshots. |
| `src/content/projects/cascadedvit-research.md` — cascadedvit-research: summary | Undergraduate thesis in the Visual Computing Lab: helping an efficient vision transformer learn new tasks without forgetting old ones, while staying small and cheap to run. | My undergraduate thesis studies how small, cheap-to-run vision models can learn new tasks without forgetting earlier ones. The work is ongoing; results are not public yet. |
| `src/content/projects/cascadedvit-research.md` — cascadedvit-research: label | parameter CascadedViT variant under CPG | parameter vision model implemented |
| `src/content/projects/cascadedvit-research.md` — cascadedvit-research: context | Implemented; experiments ongoing with the lab. | Thesis experiments ongoing; results are not public yet. |
| `src/content/projects/expected-goals.md` — expected-goals: value | No edge | 0.085 |
| `src/content/projects/expected-goals.md` — expected-goals: label | against the closing line | Brier score vs StatsBomb's 0.079 on an unseen tournament |
| `src/content/projects/expected-goals.md` — expected-goals: context | +5.7% yield over 1,379 bets, but the 95% bootstrap interval [−3.2%, +15.0%] includes zero (p = 0.11). | No evidence of an edge against the closing line: +5.7% yield over 1,379 bets, but the 95% bootstrap interval [−3.2%, +15.0%] includes zero (p = 0.11). |
| `src/content/projects/astrolok.md` — astrolok: value | 65.6° | Classical solver |
| `src/content/projects/astrolok.md` — astrolok: label | best mean angular error | succeeds in a comparison with a CNN |
| `src/content/projects/astrolok.md` — astrolok: context | A random guess on the sphere averages about 90°. The classical triangle-hash solver succeeds. | The CNN's best mean angular error was 65.6°, versus about 90° for a random guess. The CNN was not a reliable replacement. |
| `src/content/projects/market-guard.md` — MarketGuard: overview (jargon moved to body) | MarketGuard takes trades from Coinbase's public WebSocket feed and turns them into one-minute market metrics and statistical alerts for BTC-USD and ETH-USD. The interesting part is not the detectors; it is making every step safe to run twice. Exchange feeds repeat messages, send malformed records, and go quiet. Duplicates must not inflate volume, gaps must not create fake signals, and the dashboard must never mix two half-published snapshots. | MarketGuard takes trades from Coinbase's public WebSocket feed and turns them into one-minute market metrics and statistical alerts for BTC-USD and ETH-USD. Its medallion architecture separates raw trades (Bronze), cleaned trades (Silver), and market metrics (Gold). The interesting part is not the detectors; it is making every step safe to run twice. Exchange feeds repeat messages, send malformed records, and go quiet. Duplicates must not inflate volume, gaps must not create fake signals, and the dashboard must never mix two half-published snapshots. |
| `src/data/experience.ts` — vcl-research-experience: summary | Continual learning for CascadedViT, the lab’s efficient vision transformer. | Studying how small vision models can keep learning without forgetting earlier tasks. |
| `src/data/experience.ts` — vcl-research-experience: bullet 1 | Exploring continual learning methods for parameter-efficient vision transformers, building on the lab’s CascadedViT architecture. | Study continual learning for parameter-efficient vision transformers built on the lab’s CascadedViT architecture. |
| `src/data/experience.ts` — math-ta-experience: bullet 1 | Lead weekly tutorials for a first-year engineering mathematics course, explaining concepts to students with a wide range of mathematical preparation. | Lead weekly first-year engineering math tutorials for students with varied mathematical preparation. |
| `src/data/experience.ts` — cs-club-experience: summary | Co-organize the club’s annual 250+ participant hackathon. | Co-organize the club’s annual hackathon for 250+ participants. |
| `src/data/experience.ts` — cs-club-experience: bullet 1 | Co-organize the club’s annual hackathon with 250+ participants, leading logistics, sponsor relations, and event-day operations. | Lead logistics, sponsor relations, and event-day operations for the club’s annual hackathon with 250+ participants. |
| `src/data/experience.ts` — cs-club-experience: bullet 2 | Organize smaller student events of 20–30 participants focused on collaboration and peer networking. | Organize events for 20–30 students to collaborate and meet peers. |
| `src/data/experience.ts` — cmha-experience: bullet 1 | Built and deployed automated booking workflows with Power Apps and Power Automate, eliminating recurring double-booking errors and saving staff an estimated 5+ hours of manual scheduling per week. | Saved staff an estimated 5+ hours of manual scheduling per week with Power Apps and Power Automate booking workflows. Built and deployed the workflows, eliminating recurring double-booking errors. |
| `src/data/experience.ts` — cmha-experience: bullet 2 | Validated workflow outputs and data accuracy through structured testing before deployment. | Tested workflow outputs and data accuracy before deployment. |
| `src/data/experience.ts` — cmha-experience: bullet 3 | Managed employee data and company files in SharePoint, and consolidated staff records into Excel workbooks with lookup formulas and pivot tables for manager reporting. | Managed employee data and files in SharePoint. Consolidated staff records in Excel with lookup formulas and pivot tables for manager reporting. |
| `src/data/experience.ts` — cmha-experience: bullet 4 | Modernized legacy internal tools, gathering requirements from non-technical staff and documenting the handoff for ongoing IT support. | Modernized legacy internal tools from non-technical staff requirements and documented the IT support handoff. |
| `src/data/experience.ts` — cmha-experience: bullet 5 | Maintained servers and resolved tier-1/tier-2 IT issues for 100+ staff, keeping clinical software available for client services. | Kept clinical software available for client services by maintaining servers and resolving tier-1/tier-2 IT issues for 100+ staff. |
| `src/data/experience.ts` — orientation-leader-experience: bullet 1 | Mentored 20 first-year students through their academic transition and coordinated logistics for orientation events. | Mentored 20 first-year students and coordinated orientation event logistics. |
| `src/data/experience.ts` — swb-experience: role | Data Engineer (Volunteer) | Data Engineering Volunteer |
| `src/data/experience.ts` — swb-experience: summary | Designed Azure data pipelines for a biodiversity research organization. | Short volunteer project for IPÊ: reviewed dataset storage and designed sample Azure pipelines. |
| `src/data/experience.ts` — swb-experience: bullet 1 | Reviewed how IPÊ stored large environmental datasets across consumer file-sharing tools and documented the problems this caused for querying and scaling. | Reviewed IPÊ’s environmental datasets in consumer file-sharing tools and documented querying and scaling problems. |
| `src/data/experience.ts` — swb-experience: bullet 2 | Designed sample Azure data pipelines to organize large-scale biodiversity datasets for a cross-disciplinary team of statisticians and scientists. | Designed sample Azure pipelines to organize large-scale biodiversity datasets for statisticians and scientists. |
| `src/data/experience.ts` — swb-experience: bullet 3 | Audited cloud storage practices and designed a data-organization strategy to reduce query times and storage costs. | Audited cloud storage and designed a data-organization strategy aimed at reducing query times and storage costs. |
| `src/data/certifications.ts` — certifications (homepage, experience, HTML resume) | Microsoft Office Specialist (Word) | Removed; both IBM entries retained. |

## Project data and ordering

The homepage keeps its existing “All projects →” link below the three cards. `/projects/` now uses
`getProjects()` directly; its redundant year-first sort previously overrode the content ranking.
No card markup or layout changed. The HTML resume also inherits the new project order.

| Project | Previous order | New order | Featured |
| --- | ---: | ---: | --- |
| ask-bach | 1 | 1 | true (unchanged) |
| market-guard | 2 | 2 | true (unchanged) |
| cascadedvit-research | 0 | 3 | true (unchanged) |
| hospital-readmission | 6 | 4 | false (unchanged) |
| energy-demand-forecasting | 5 | 5 | false (unchanged) |
| chest-xray-pneumonia | 3 | 6 | true → false |
| expected-goals | 7 | 7 | false (unchanged) |
| nested-learning | 4 | 8 | false (unchanged) |
| fasttext-embeddings | 8 | 9 | false (unchanged) |
| astrolok | 9 | 10 | false (unchanged) |
| global-gdp-etl | 10 | 11 | false (unchanged) |
| ontario-infrastructure | 11 | 12 | false (unchanged) |

## Flagged claims for Bach to review

These are review flags, not independently established errors. The claims below remain in the site;
none was silently removed. Line numbers refer to the edited source. Scope caveats already in the
write-ups are retained. This pass checked every routed page, shared data, all project write-ups,
and the unrouted blog drafts; it did not verify external repositories or live services.

| Source line | Existing claim | Why it needs care / evidence to keep handy |
| --- | --- | --- |
| `src/data/experience.ts:91` | “eliminating recurring double-booking errors” / “an estimated 5+ hours” | The estimate qualifier is preserved. Be ready to explain how hours were estimated and the observation window for eliminating errors; the repo contains no measurement record. |
| `src/data/experience.ts:95` | “Kept clinical software available for client services” | Describes IT support, but can sound like an availability guarantee. No uptime measurement is claimed or evidenced. |
| `src/data/experience.ts:76` | “annual hackathon with 250+ participants” | Keep the event/year, participant-count source and personal scope of logistics/sponsor work ready; the repo repeats the figure without attendance evidence. |
| `src/content/projects/ask-bach.md:29` | “using only a set of documents I wrote for it” | The Limitations section reports an unsupported combination of true facts. Retrieval grounding is the design; answer truth is not guaranteed. |
| `src/content/projects/ask-bach.md:22` | “Made citations unforgeable by design” | Evidence-id resolution constrains source identity. It does not establish that the answer is supported by those sources; groundedness is unmeasured. |
| `src/content/projects/ask-bach.md:55` | “When the context does not contain the answer, the service says so” | A description of intended refusal behaviour reads as a universal guarantee. The small evaluation measures retrieval, not refusal reliability. |
| `src/content/projects/ask-bach.md:71` | “Hybrid clearly beats dense-only” | Only 5 questions plus 5 related paraphrases; the write-up acknowledges the small set. Keep this scoped to that regression check. |
| `src/content/projects/market-guard.md:26` | “replays and restarts never double-count” | The reported replay test verifies 100 deterministic trades with one checkpoint. It does not cover all possible late events or concurrent writers; existing limitations remain. |
| `src/content/projects/market-guard.md:39` | “A collector running on Azure Container Apps” | The status note more cautiously says “was deployed.” The previous audit already asks whether it is still running. Current runtime state was not checked. |
| `src/content/projects/energy-demand-forecasting.md:4` | “every model is validated the same, leak-free way” | Walk-forward splits are documented, but the write-up also says inputs/horizons differ and the persistence baseline is missing. Avoid treating this as a proven absence of all leakage. |
| `src/content/projects/energy-demand-forecasting.md:62` | “a day-ahead forecast would lose lag_1h and the gap would shrink” | The day-ahead result is an inference, not an experiment reported here. |
| `src/content/projects/chest-xray-pneumonia.md:30` | “a heatmap showing which part of the image drove it” | The same write-up correctly calls heatmaps a sanity check, not proof of model reasoning. This earlier wording sounds stronger. |
| `src/content/projects/fasttext-embeddings.md:48` | “The analogy gap … comes from data scale” / “rules out an evaluation bug” | A pretrained baseline is a useful check, but does not isolate data scale as the cause or rule out every implementation/evaluation error. The closing paragraph repeats the causal claim. |
| `src/content/projects/astrolok.md:60` | “Three causes combine” / “ImageNet features do not transfer to points of light on black” | The negative result is documented; those proposed explanations are not separated by controlled ablations. Retain the distinction between observations and hypotheses. |
| `src/components/ChatWidget.astro:31` | “a bot trained on Bach’s resume and projects” | The project describes retrieval over notes, not fine-tuning on the resume. Left unchanged under the instruction to preserve components; “answers from Bach’s notes” would describe the architecture more precisely. |
| `src/data/education.ts:12` | “Dean’s List (2×)” | Existing audit: PDF has no count; site/KB have 2×. Confirm against the academic record before copying the count into the PDF. |
| `src/content/blog/lessons-from-reproducible-ml.md:16` | “That structure reduced debugging time and made collaboration much easier” | Unrouted draft: no before/after evidence or collaboration example is given. Keep a concrete example if this is published. |

Existing open questions in `docs/AUDIT.md` still apply: CPG result publication clearance, Nested Learning
attribution/unsubstantiated 2.1-point gain in the separate KB, orientation role confirmation, and GDP ETL
year. No unpublished thesis results were added to this site.

## Manual PDF checklist

`public/Resume.pdf` is separate and was left unchanged. Apply these to its editable source and re-export;
where a section is absent, the item applies only if adding that section.

- [ ] Use **Machine Learning & Data Engineering** wherever a headline or target-role line appears.
- [ ] Target **new-graduate machine learning engineering and data engineering roles starting after April 2027**.
- [ ] Lead any profile summary with building ML systems and their data pipelines, then the efficient continual learning thesis. Keep expected graduation April 2027.
- [ ] Prioritize **Ask Bach → MarketGuard → CascadedViT thesis**. Present thesis work as ongoing efficient ML research, with implementation details and no private experiment results.
- [ ] Use the three plain-English summaries from the before/after table where summaries appear. Keep technical implementation details in bullets.
- [ ] For MarketGuard, distinguish the deployed collector, local/CI Kafka-Spark tests, and **manually refreshed dashboard snapshots**. Do not add scheduled refresh, production uptime or traffic claims.
- [ ] Rename Statistics Without Borders to **Data Engineering Volunteer**, February 2024. Describe a **short project** reviewing IPÊ storage and designing **sample Azure pipelines**, with intended rather than measured query-time/cost improvements.
- [ ] Remove **Microsoft Office Specialist (Word)**; keep both IBM certifications.
- [ ] Match the concise experience wording in the table; retain **estimated 5+ hours**, 100+ staff, existing dates and role scope. Review flagged absolutes before exporting.
- [ ] If xG is included, lead with **Brier 0.085 vs StatsBomb’s 0.079 on an unseen tournament** and retain **no evidence of a closing-line edge**, including the bootstrap uncertainty when space permits.
- [ ] If AstroLoc is included, describe the working classical baseline and retain the CNN’s **65.6°** mean error versus **about 90°** for a random guess; do not imply the CNN plate-solver succeeded.
- [ ] Carry forward the earlier audit corrections: readmission uses an **encounter-ID-ordered hold-out**, not verified chronological/leakage-free validation; electricity’s **0.81% MAPE is one hour ahead**; GDP ETL scrapes **one table** into CSV/SQLite with logs.
- [ ] Confirm the Dean’s List count and GDP ETL year against source records before changing those entries.
- [ ] Keep the skills unchanged, including Airflow and Databricks. Prepare a concrete explanation of experience with each; scheduled MarketGuard orchestration remains future work.
- [ ] Replace `public/Resume.pdf` with the reviewed export, then update `profile.resumePdfUpdated` only if the PDF’s printed month changes. Its current value remains **October 2026** because this pass did not regenerate the PDF.

## Ask Bach knowledge base checklist (separate repo)

`docs/ASK-BACH-BACKEND-NOTES.md` now carries these follow-ups. No backend repository or Cosmos DB
records were edited here. Confirm filenames in AskBachBot before changing documents beyond those
already identified in the audit.

- [ ] In `app/data/documents/about.txt` and any other profile/resume documents, replace broad/co-op/internship positioning with **Machine Learning & Data Engineering** and the **after April 2027** new-graduate availability. Use the shared `profile.shortBio` as the source for the introduction.
- [ ] Update project-recommendation content to lead **Ask Bach, MarketGuard, CascadedViT thesis**; keep all 12 projects available for questions.
- [ ] Update the volunteer document and Cosmos `content` record **`swb-experience`** to the new title and short sample-pipeline scope. Preserve the id. The website’s static-wins merge does not fix chatbot answers from stale KB chunks.
- [ ] Remove the Word certification from current profile/resume documents and certification records.
- [ ] Align `project_market_guard.txt` with the manual refresh / published snapshot / local streaming caveats. Do not add Airflow scheduling until implemented.
- [ ] Align xG and AstroLoc project summaries with the results and caveats in the table.
- [ ] Keep thesis results private in chatbot answers. Review the already-flagged `project_cpg_cascadedvit.txt` with the supervisor before retaining any results; do not use the new site copy as permission to publish them.
- [ ] Correct `project_nested_learning.txt` attribution to extensions of an upstream reproduction and resolve/remove its unsupported 2.1-point claim after source review.
- [ ] Match `cmha.txt` and **`cmha-experience`** to the preserved **estimated 5+ hours** qualifier and current bullets.
- [ ] Refresh chunks and embeddings through AskBachBot’s existing ingestion/index workflow. Probe “What roles is Bach looking for?”, “When can he start?”, “What should I try first?”, “What did he do at SWB?”, “Is MarketGuard live or scheduled?” and “What are the thesis results?” for consistency.

## Verification

- `npm run og`: passed; `public/og.png` regenerated and visually inspected with the new headline.
- `npm run verify` on the final site content: passed. Astro checked 36 files with zero errors,
  warnings or hints; 9 unit tests passed; the static build completed; 271 internal links/assets
  across 15 pages resolved; all 22 Playwright tests passed across desktop and mobile.
- `npm run dev -- --host 127.0.0.1`: checked with Playwright at 1280px and 393px widths. Both
  returned HTTP 200, showed exactly Ask Bach → MarketGuard → CascadedViT, had no horizontal
  overflow, and opened all 12 projects in the requested order through “All projects →”. The
  temporary dev server was stopped after checking. Browser tests mocked/blocked API calls;
  they do not establish current backend availability or knowledge-base freshness.
- Compared against the original files: skills, the full `toolGroups` declaration, all components,
  global CSS, PDF, experience ids and project links are unchanged. No project files were renamed.
- `git diff --check`: passed. Changes remain local and uncommitted.
