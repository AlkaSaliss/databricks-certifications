# Databricks certification quiz design

The user wants a responsive React app hosted on GitHub Pages, initially for Data Engineer Professional. They selected only the exam starting October 9, 2026 and requested CI/CD on pushes to main. Their request explicitly authorizes research, planning, question authoring, and implementation in this session.

## Exam authority and content

The supplied and online October 2026 official exam guide is authoritative: 60 scored multiple-choice questions in 120 minutes, in English. Up to ten unscored items may appear on the real exam; this app simulates the 60 scored items only. The certification webpage still lists the previous 59-question exam. The older Udemy overview has outdated scope, names, and weights; do not copy its questions or treat its claimed 70% threshold as an official pass mark.

New blueprint weights: code 23%, ingestion 12%, manipulation 12%, monitoring 10%, performance 15%, security 8%, governance 5%, deployment 10%, modeling 5%. Largest-remainder rounding for 60 items gives 14, 7, 7, 6, 9, 5, 3, 6, 3 respectively. Sharing and federation belong to ingestion in this blueprint.

Gather broadly across official Databricks documentation and primary Apache Spark references. Bundle an original scenario and code question bank, each item with one correct answer, four options, an explanation, an objective, and source IDs. No exam dumps or copied commercial course questions. Document product renames and preview/runtime constraints where relevant. The question bank is educational and is not a calibrated predictor of exam success.

## Product flow

A light, teal-accented study dashboard provides certification selection (one available certification), three mode cards, the nine topic cards with weights and question counts, and links to the official guide and the source library. Theme practice runs ten randomized questions or the smaller available pool, with feedback after the learner checks an answer. Explanations remain hidden until then and checked answers are locked.

Both simulation modes use 60 unique, randomly ordered questions selected according to the blueprint, with independently randomized answer options. Allow previous/next navigation, question jumps, marking for review, and changing answers until submission. Hide all feedback and sources while an exam is active. An explicit submission confirmation reports unanswered questions. Show raw accuracy and per-domain results with all questions available for review afterward; never present an invented official passing threshold.

The timed simulation starts an absolute deadline 120 minutes from its start, has no pause, counts time while the tab is inactive or closed, prevents responses after expiry, and automatically submits when expired. Untimed simulation has no deadline.

Save one active session and completed attempt history locally in the browser. Reloading preserves the question/answer orders, answers, flags, and deadline. A suspended session can be resumed from the dashboard; starting another requires explicit discard confirmation. A completed attempt can be reviewed. Gracefully run without persistence when browser storage is unavailable, with a concise visible notice. Validate saved data so corrupt or obsolete state does not crash the app.

## Architecture and deployment

Use React and Vite with JavaScript, local JSON data, plain CSS, and a small pure quiz-engine module. No backend, accounts, API keys, routing library, UI framework, or database. Avoid URL navigation paths to preserve direct GitHub Pages refresh support. Use relative assets (Vite base ./) for both the project subpath and local preview.

Use native Node test runner for deterministic selection, grading, expiration and saved-state validation. Use Playwright for end-to-end flows at desktop and mobile sizes. Keep browser automation dependencies development-only. GitHub Actions runs these checks, builds, uploads dist, and deploys with the official GitHub Pages actions on push to main; pull requests run checks without deploying. Explain the one-time Settings > Pages > GitHub Actions setup in README.

## Verification

Check question IDs, duplicate prompts/options, references, domain supply and blueprint totals. Test shuffled option scoring, missing answers, exact counts, deterministic clocks, refresh persistence, unavailable/corrupt storage, practice feedback, exam answer concealment, submission, deadline expiry after suspension, topic breakdowns, desktop/mobile overflow, and project-subpath assets. Verify the production build and GitHub workflow structure. Leave source PDFs intact.
