# Ask Bach backend: follow-ups outside this repository

The website redesign did not change the AskBachBot API. These are changes worth making in
[AskBachBot](https://github.com/bachnguyennn/AskBachBot) to keep the chatbot consistent with the site.

## Content (Cosmos DB `content` container / `app/data/documents/`)

- **`cmha-experience` record** served by `/content/experience` has three short highlights, one of which says
  "saved over five staff hours weekly". The resume says "an estimated 5+ hours". The site now ignores API copies
  of known ids, but the chatbot can still repeat the stronger wording. Align the record and `cmha.txt` with
  `src/data/experience.ts`.
- **`project_nested_learning.txt`** says Bach "built a mechanism-level reproduction of HOPE" and cites a 2.1-point
  perplexity gain. See `docs/AUDIT.md`, open question 2.
- **`project_cpg_cascadedvit.txt`** publishes CPG results. See `docs/AUDIT.md`, open question 1.
- **`about.txt` "What Bach is looking for"** lists co-op and internship roles in data engineering, analysis and
  process automation. Use the headline **Machine Learning & Data Engineering** and state that Bach is seeking
  new-graduate machine learning engineering and data engineering roles starting after April 2027. Lead the
  bio with building ML systems and the data pipelines behind them, followed by the continual learning thesis.
- **Featured projects:** prioritize Ask Bach, MarketGuard, then the CascadedViT thesis in recommendation
  answers. Keep all 12 projects in the knowledge base; Chest X-ray is still a project, just no longer featured.
- **`swb-experience` record and the corresponding volunteer document:** use **Data Engineering Volunteer**,
  February 2024, and describe a short project reviewing storage and designing **sample** Azure pipelines for
  IPÊ. Do not imply a deployed pipeline or measured cost/query-time improvement. Preserve the record id.
- **Certification records:** remove Microsoft Office Specialist (Word) from current profile answers.
- **MarketGuard documents:** retain the manual GitHub Actions refresh, published dashboard snapshots,
  local/CI Kafka-Spark path, and labeled synthetic fallback. Scheduling remains future work.
- **Project result summaries:** xG leads with Brier 0.085 vs StatsBomb's 0.079 on an unseen tournament, while
  retaining no evidence of a closing-line edge. AstroLoc leads with the working classical solver and retains
  the CNN's 65.6° error vs about 90° for a random guess. Thesis results remain private.
- After editing the source documents, use AskBachBot's existing ingestion/indexing workflow to refresh the
  stored chunks and embeddings. Check headline, availability, volunteer scope, thesis privacy and manual
  MarketGuard refresh with representative questions. No backend files or cloud records were changed here.

## Behaviour

- **Contact questions already work.** "How can I contact Bach?" returned the email, LinkedIn and GitHub from
  `about.txt` (checked against the live API on 2026-10-20). No frontend heuristics were added.
- **CORS.** Only `https://bachnguyennn.github.io` and `http://localhost:4321` are allowed. Add the Azure Static
  Web Apps hostname if that deployment should have a working chat. Playwright tests use port 4322 and mock the
  API, so they do not need a CORS entry.
- **Errors.** Upstream Groq failures return HTTP 500. The widget treats any non-2xx as "unavailable" and offers
  email; mapping to 502/503 (as the README roadmap suggests) would allow a more specific message.
- **Sources.** The widget maps known document filenames to site pages (`ChatWidget.astro`, `sourcePages`). When
  adding a knowledge-base document, add a mapping or it is listed by name only.
