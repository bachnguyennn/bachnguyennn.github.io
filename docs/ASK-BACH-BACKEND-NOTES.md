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
  process automation. The site now positions for new-graduate ML, applied AI and software engineering roles.

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
