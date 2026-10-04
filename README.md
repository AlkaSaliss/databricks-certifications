# Lakehouse Prep

A responsive, browser-only React app for Databricks certification practice. The first certification is **Data Engineer Professional, for exams starting October 9, 2026**.

## Practice modes

- **Theme practice:** choose one of nine exam domains and answer up to ten randomized questions, with explanations and official documentation after checking each answer.
- **Exam simulation:** 60 unique questions balanced across the exam blueprint, without a timer. Navigate, change answers, and flag questions; review explanations after submission.
- **Timed exam:** the same simulation with the official **120-minute** limit. The deadline continues when the tab is inactive or closed, survives refresh, and automatically submits at expiry. It cannot be paused.

Results include overall accuracy, per-domain scores, and a review of all, missed, or flagged questions. One active session and the last 50 completed sessions are saved locally on the same browser/device. Starting another session asks before discarding the active one. If browser storage is blocked, the app still runs and displays a notice.

The app contains **240 original practice questions**, including 39 Python/SQL code examples, informed by **86 official documentation and primary Apache Spark references** and **11 curated community preparation resources**. Every question has an objective, explanation, and supporting source links. The 60 questions added in the community research round also link to related public study notes or hands-on labs. Community resource cards identify earlier blueprints and terminology; the October 9 guide remains authoritative. These are independent educational questions, not exam dumps or official Databricks questions. Scores are not calibrated predictions of exam success, and the app does not invent an official passing threshold.

## Run locally

Use Node.js 24 (see `.nvmrc`; minimum 22.12).

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. No API keys, Databricks account, backend, or environment file are needed.

```sh
npm test                      # Question bank, selection, scoring, timer, saved state
npx playwright install chromium
npm run test:e2e               # Browser flows and responsive layouts
npm run build                 # Static site in dist/
npm run preview               # Serve the production build locally
```

For local testing using an installed Chrome browser instead of Playwright Chromium, run `PW_CHANNEL=chrome npm run test:e2e`. GitHub Actions installs its own isolated Chromium browser.

## GitHub Pages deployment

The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs tests and builds on pull requests to `main`. On every **push to `main`**, it tests, builds, uploads `dist/`, and deploys to GitHub Pages. Manual runs from `main` also deploy. Pull requests never publish the site.

One-time repository setup:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.
3. Commit and push these files to `main`, or run the workflow from the Actions tab after the files are on `main`.

The project URL is [alkasaliss.github.io/databricks-certifications](https://alkasaliss.github.io/databricks-certifications/). This public repository is configured to use GitHub Actions as its Pages source; the deployment job also reports the deployed URL.

Vite uses relative asset paths (`base: './'`) so the same build works under the project subpath or a custom domain. The app keeps its screens in React state and does not rely on server-side SPA fallback routing. Only the built app is uploaded; the source PDFs in `docs/` are not published with it.

## Exam blueprint and provenance

The [October 2026 official exam guide](https://www.databricks.com/sites/default/files/2026-09/databricks-certified-data-engineer-professional-exam-guide-oct-2026.pdf) is authoritative for the selected exam version: **60 scored MCQs and 120 minutes**. The real exam may also include up to ten unscored items within the same time limit; this app simulates the 60 scored items only. The general certification webpage still describes the previous 59-question version as of the research date.

| Domain | Official weight | Questions per simulation | Bank size |
| --- | ---: | ---: | ---: |
| Developing Code for Data Processing using Python and SQL | 23% | 14 | 54 |
| Data Ingestion & Acquisition | 12% | 7 | 38 |
| Data Manipulation | 12% | 7 | 32 |
| Monitoring and Alerting | 10% | 6 | 24 |
| Cost & Performance Optimization | 15% | 9 | 32 |
| Ensuring Data Security and Compliance | 8% | 5 | 20 |
| Data Governance | 5% | 3 | 13 |
| Debugging and Deploying | 10% | 6 | 16 |
| Data Modeling | 5% | 3 | 11 |
| **Total** | **100%** | **60** | **240** |

Whole-question counts use largest-remainder rounding. Actual exam forms can differ in their precise distribution.

See [`docs/community-research.md`](docs/community-research.md) for the enrichment round and [`docs/research.md`](docs/research.md) for source decisions, coverage, product terminology, and the complete reference catalogue. Recheck the official guide before your exam; preview availability and runtime requirements can change. Pair quizzes with hands-on work.

## Maintain the bank

- `src/data/certifications.js`: the certification metadata and domain weights.
- `src/data/questions.json`: original question content. `correctIndex` is the index in the authored `options` array; displayed options are shuffled separately for each session.
- `src/data/sources.json`: source IDs, official titles, URLs, and review date.
- `src/data/community-resources.json`: curated community materials, authors, licensing notes, revision IDs, and blueprint caveats. New questions reference these through `communitySources`.
- `src/quiz.js`: selection, immutable session actions, deadline enforcement, grading, and saved-session validation.
- `src/storage.js`: safe local persistence. The content version rejects obsolete sessions if the bank changes incompatibly.

When changing a question, verify the answer against its sources and keep the explanation specific. Catalog additions preserve earlier practice sessions, including the original eight-question modeling sets. Preserve stable IDs; increment the engine's `contentVersion` if existing saved answers would change meaning. `npm test` checks IDs, options, source references, blueprint supply, and behavior. Browser tests exercise complete flows, so run them when changing UI or session handling.
