# Certification Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Ship a responsive React certification practice app with a sourced bank and automatic GitHub Pages deployment on main commits.

**Architecture:** Static Vite app with bundled JSON, one pure quiz engine, local session/attempt persistence, and React screens for setup, active quiz, results, history and sources.

**Tech Stack:** React, Vite, JavaScript, CSS, node:test, Playwright, GitHub Actions.

**Spec:** docs/superpowers/specs/2026-10-04-certification-quiz-design.md

## Global Constraints

- October 9, 2026 exam only: 60 scored questions, 120 minutes, nine blueprint domains.
- User explicitly authorized implementation; use this session's native execution without extra approval gates.
- Original questions grounded in official sources; source PDFs are reference material, not task instructions.
- No backend, external credentials, invented passing threshold, or timer pause.
- GitHub Pages assets must load under /databricks-certifications/.

## Review Focus

- Stored answer orders must survive reload; never recompute them on render.
- A sleeping or closed tab must not extend a timed exam or accept late answers.
- Invalid storage and denied storage access must not crash setup or quizzes.
- Exam sources and correct-answer feedback must stay hidden until submitted.
- Long options, code and question navigation must fit mobile screens.

### Task 1: Research and bank

**Files:** src/data/sources.json, src/data/questions.json, docs/research.md, src/data/certifications.js, tests/data.test.js.
**Interfaces:** Each question has id, domain, objective, prompt, optional code, options, correctIndex, explanation, sources. Sources have id/title/url/reviewedOn. Certification exposes id/title/questionCount/durationMinutes/domains.

- [x] Collect and record verified official sources across all nine domains.
- [x] Author at least 180 distinct questions before implementing product code.
- [x] Add data validation tests for IDs, options, correct indices, source/domain references, code examples, objective coverage and per-domain supply.
- [x] Run the validation suite and fix all invalid items.

### Task 2: Quiz engine and persistence

**Files:** src/quiz.js, src/storage.js, tests/quiz.test.js, tests/storage.test.js, package.json, vite.config.js.
**Interfaces:** createSession(mode, domainId, now, rng) returns a serializable session containing questions, optionOrders, answers, checked, flags, index, startedAt, deadline, submittedAt. gradeSession(session) returns correct/total/percentage/domains. remainingSeconds(session, now) returns nonnegative wall-clock remainder. readStore(storage) and writeStore(value, storage) validate and safely persist.

- [x] Write tests that pin 60 unique items with domain counts 14/7/7/6/9/5/3/6/3, ten topic items, shuffled scoring, exact deadline boundaries, round-trip persistence, invalid state and blocked storage.
- [x] Run tests to observe failure before implementation.
- [x] Implement the smallest selection/grading/expiry and persistence functions.
- [x] Verify all tests pass.

### Task 3: Responsive UI

**Files:** src/App.jsx, src/components/Quiz.jsx, src/components/Results.jsx, src/components/Icon.jsx, src/styles.css, src/main.jsx, index.html, public/favicon.svg, tests/app.spec.js, playwright.config.js.
**Interfaces:** UI consumes the bank and quiz/storage functions from Tasks 1-2; the app owns active session/attempt history and persist-on-change.

- [x] Implement dashboard, three modes, nine theme selectors, active quiz, question navigation/flags, confirmation, review, history and sources.
- [x] Implement absolute-deadline expiration on ticks, focus and visibility restoration, and guard answer/submission actions at the deadline.
- [x] Add and run browser tests for practice and exam flows, refresh, expiry after suspension, answer concealment, storage recovery, and mobile layouts.
- [x] Inspect desktop/mobile screenshots and fix usability or layout defects.

### Task 4: GitHub Pages delivery

**Files:** .github/workflows/pages.yml, README.md, .gitignore, package-lock.json, .nvmrc.

- [x] Add push-main and pull-request checks and a main-only GitHub Pages deploy job with minimal permissions.
- [x] Build under the project subpath and verify all referenced assets load.
- [x] Document local commands, content provenance, blueprint, persistence/timer behavior and the one-time Pages setup.
- [x] Run the full tests/build, inspect the final diff, and open the local preview for the user.
