# Verification record

Completed October 4, 2026.

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
