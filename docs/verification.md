# Verification record

Initial implementation verified October 4, 2026, before the subsequent publication and enrichment described below.

- `npm test`: 16 tests passed. Covers 180-question structural validation, official blueprint constants, weighted selection across 25 generated exams, unique items, shuffled scoring, unanswered questions, practice locks, deadline boundaries, immutable actions, corrupt saved state and denied persistence.
- `PW_CHANNEL=chrome npm run test:e2e`: 10 tests passed. Covers topic practice, untimed exam, 120-minute timed exam, expiry after refresh/absence, submission/history, feedback concealment, replacement confirmation, corrupt/blocked storage, the eight-item modeling pool, source search, desktop rendering and mobile overflow.
- `npm run build`: production build passed.
- All 17 Python code excerpts parsed with Python AST; remaining excerpts are SQL, CLI or YAML examples.
- Production site served beneath `/databricks-certifications/`: the HTML rendered and the favicon, JS and CSS asset requests returned HTTP 200 under that subpath.
- Production mobile screenshot inspected at 375 x 812; desktop dashboard and quiz screenshots inspected.
- GitHub Actions YAML parsed; main triggers, PR deployment exclusion, deployment dependency, and scoped Pages permissions inspected.
- Fresh independent review identified five wrong source links and malformed string/nested answer orders; both were reproduced by failing tests, corrected, and the full checks passed afterward.
- Original source PDFs remain untouched. No commit, push, GitHub settings change or live deployment was performed.

The workflow needs the repository Pages source set to GitHub Actions and the implementation committed/pushed to main for its first actual deployment. The code and local production behavior are verified; a hosted Actions run and live GitHub Pages site are not yet verified.

The authored bank covers all nine domains. Some named subtopics receive less direct practice than others; treat the bank as an educational supplement to the full guide and hands-on work.


## Publication and enrichment

The initial app was published on October 4, 2026 at https://alkasaliss.github.io/databricks-certifications/. Both build and deploy jobs passed in GitHub Actions run 37220605575 for commit 5dfeacb49cc70da96dba29a7543cf30995ef2dcd. The live React dashboard was inspected before community research began.

The enrichment appends 60 original questions and 12 primary references, and adds 11 curated community materials. The original 180 question objects are unchanged. Local checks cover the community resource section/search, related question links, earlier saved practice sessions, and the full quiz modes. The new deployment follows the same push-main workflow. See community-research.md for sources, decisions, coverage, and verification.
