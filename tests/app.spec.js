import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { STORAGE_KEY } from '../src/storage.js';
import { createSession } from '../src/quiz.js';

const questions = JSON.parse(readFileSync(new URL('../src/data/questions.json', import.meta.url)));
const byId = Object.fromEntries(questions.map(q => [q.id, q]));
const saved = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);

async function startExam(page, timed = false) {
  await page.goto('/');
  await page.getByRole('button', { name: timed ? /PUT IT TO THE TEST Timed exam/ : /FIND YOUR RHYTHM Exam simulation/ }).click();
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await expect(page.getByText('Question 1 of 60', { exact: true })).toBeVisible();
}

async function submit(page) {
  await page.getByRole('button', { name: 'Submit session', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Submit & see results', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Every answer is a step forward.' })).toBeVisible();
}

test('practice provides correct feedback, locks answers, survives refresh, and enters history', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByLabel('YOUR CERTIFICATION')).toHaveValue('data-engineer-professional');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
  await expect(page.locator('.feedback')).toHaveCount(0);
  const initial = await saved(page);
  const q = byId[initial.active.questions[0]];
  await page.getByText(q.options[q.correctIndex], { exact: true }).click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByText('Correct answer', { exact: true })).toBeVisible();
  await expect(page.locator('.source-links a')).not.toHaveCount(0);
  await expect(page.getByRole('radio').first()).toBeDisabled();
  await page.getByRole('button', { name: 'Flag for review', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Correct answer', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const restored = await saved(page);
  expect(restored.active.questions).toEqual(initial.active.questions);
  expect(restored.active.optionOrders).toEqual(initial.active.optionOrders);
  await submit(page);
  await expect(page.getByRole('heading', { name: '1 of 10 correct' })).toBeVisible();
  await page.getByRole('tab', { name: 'Review answers' }).click();
  await expect(page.locator('.feedback')).toBeVisible();
  await page.getByRole('button', { name: 'My sessions', exact: true }).click();
  await expect(page.locator('.history-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('untimed exam permits navigation and changed answers without revealing feedback', async ({ page }) => {
  await startExam(page);
  await expect(page.getByRole('timer')).toHaveCount(0);
  await page.locator('.option').first().click();
  const first = await saved(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Previous', exact: false }).click();
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.locator('.option').nth(1).click();
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await expect(page.locator('.feedback')).toHaveCount(0);
  await expect(page.locator('.source-links')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Question 60, unanswered', exact: true }).click();
  await expect(page.getByText('Question 60 of 60', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Question 60 of 60', { exact: true })).toBeVisible();
  expect((await saved(page)).active.questions).toEqual(first.active.questions);
  await submit(page);
  await expect(page.locator('.score-stats > span').filter({ hasText: 'Unanswered' })).toContainText('59');
  await page.getByRole('tab', { name: 'Review answers' }).click();
  await expect(page.locator('.feedback')).toBeVisible();
  expect((await saved(page)).active).toBeNull();
});

test('timed exam uses 120 minutes and auto-submits after wall-clock expiry', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-10T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-10T10:00:01Z'));
  await startExam(page, true);
  await expect(page.getByRole('timer')).toContainText('02:00:00');
  await page.locator('.option').first().click();
  await page.clock.fastForward(60 * 60 * 1000);
  await expect(page.getByRole('timer')).toContainText('01:00:00');
  await page.reload();
  await expect(page.getByRole('timer')).toContainText('01:00:00');
  await page.clock.fastForward(60 * 60 * 1000 + 1000);
  await expect(page.getByText('Time is up. Your answers were submitted automatically.')).toBeVisible();
  const state = await saved(page);
  expect(state.active).toBeNull();
  expect(state.attempts).toHaveLength(1);
  expect(state.attempts[0].finishReason).toBe('expired');
  expect(state.attempts[0].submittedAt).toBe(state.attempts[0].deadline);
});

test('reopening an expired timed session immediately recovers one completed attempt', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-10T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-10T10:00:01Z'));
  await startExam(page, true);
  const state = await saved(page);
  await page.clock.setSystemTime(new Date(state.active.deadline + 10_000));
  await page.reload();
  await expect(page.getByText('Time is up. Your answers were submitted automatically.')).toBeVisible();
  const recovered = await saved(page);
  expect(recovered.attempts).toHaveLength(1);
  expect(recovered.active).toBeNull();
  await page.reload();
  await page.getByRole('button', { name: 'My sessions', exact: true }).click();
  await expect(page.locator('.history-card')).toHaveCount(1);
});

test('leaving a timed session does not pause it and replacing requires explicit discard', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-10T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-10T10:00:01Z'));
  await startExam(page, true);
  const state = await saved(page);
  await page.getByRole('button', { name: 'Back to dashboard', exact: false }).click();
  await expect(page.getByText('You have a session in progress')).toBeVisible();
  await page.getByRole('button', { name: /BUILD YOUR KNOWLEDGE Theme practice/ }).click();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Keep going', exact: true }).click();
  expect((await saved(page)).active.id).toBe(state.active.id);
  await page.clock.fastForward(30 * 60 * 1000);
  await page.getByRole('button', { name: 'Resume session', exact: true }).click();
  await expect(page.getByRole('timer')).toContainText('01:30:00');
  await page.getByRole('button', { name: 'Back to dashboard', exact: false }).click();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.getByRole('button', { name: 'Discard & start new', exact: true }).click();
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
});

test('storage failures and malformed saved data preserve a usable app', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto('/');
  await expect(page.getByText('Browser storage is unavailable. This session works, but progress will not survive a refresh.')).toBeVisible();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.locator('.option').first().click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('.feedback')).toBeVisible();
});

test('corrupt local state is removed without crashing the dashboard', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, '{broken'), STORAGE_KEY);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build confidence/ })).toBeVisible();
  await expect(page.getByRole('status')).toBeVisible();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
});

test('modeling theme uses its enriched pool', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /DOMAIN 09 Data Modeling/ }).click();
  await expect(page.locator('.start-bar')).toContainText('10 questions');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
  const state = await saved(page);
  expect(state.active.questions.every(id => byId[id].domain === 'modeling')).toBe(true);
});

test('mobile dashboard, quiz, review, and resource library have no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const noOverflow = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await noOverflow();
  await page.screenshot({ path: 'test-results/mobile-dashboard.png', fullPage: true });
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.locator('.option').first().click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await noOverflow();
  await page.screenshot({ path: 'test-results/mobile-quiz.png', fullPage: true });
  await submit(page);
  await noOverflow();
  await page.getByRole('tab', { name: 'Review answers' }).click();
  await noOverflow();
  await page.getByRole('button', { name: 'Study resources', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search study resources' }).fill('watermark');
  await expect(page.locator('.official-resource-list > a')).toHaveCount(1);
  await noOverflow();
});

test('desktop dashboard and code questions render without browser exceptions', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.screenshot({ path: 'test-results/desktop-dashboard.png', fullPage: true });
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  const state = await saved(page);
  const codeIndex = state.active.questions.findIndex(id => byId[id].code);
  if (codeIndex >= 0) await page.getByRole('button', { name: `Question ${codeIndex + 1}, unanswered`, exact: true }).click();
  await expect(page.getByRole('radio')).toHaveCount(4);
  await page.screenshot({ path: 'test-results/desktop-quiz.png', fullPage: true });
  expect(errors).toEqual([]);
});


test('curated community materials are visible and searchable by author', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Study resources', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Community preparation', exact: true })).toBeVisible();
  await expect(page.locator('.community-list > a')).toHaveCount(11);
  await page.getByRole('textbox', { name: 'Search study resources' }).fill('Jakub Lasak');
  await expect(page.locator('.community-list > a')).toHaveCount(4);
  await expect(page.getByText('No resources match this search.')).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('new-question community links are hidden until practice feedback is checked', async ({ page }) => {
  const session = createSession('practice', 'code');
  session.questions = ['dep-181', ...questions.filter(q => q.domain === 'code' && Number(q.id.split('-')[1]) <= 180).slice(0, 9).map(q => q.id)];
  session.optionOrders = Object.fromEntries(session.questions.map(id => [id, [0, 1, 2, 3]]));
  await page.addInitScript(({ key, session }) => localStorage.setItem(key, JSON.stringify({ version: 1, active: session, attempts: [] })), { key: STORAGE_KEY, session });
  await page.goto('/');
  await expect(page.locator('.community-links')).toHaveCount(0);
  await page.locator('.option').first().click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByText('Related community practice', { exact: true })).toBeVisible();
  await expect(page.locator('.community-links a')).toHaveCount(2);
  await expect(page.locator('.source-links').first().getByRole('link')).not.toHaveCount(0);
});
