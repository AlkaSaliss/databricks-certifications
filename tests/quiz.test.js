import test from 'node:test';
import assert from 'node:assert/strict';
import { certification } from '../src/data/certifications.js';
import { questions, questionById, domainAllocation, createSession, gradeSession, remainingSeconds, updateSession, submitSession, isValidSession } from '../src/quiz.js';

const start = 1_800_000_000_000;
const rng = () => 0.37;

test('exam allocates 60 unique questions with the official weights rounded to whole items', () => {
  assert.deepEqual(domainAllocation().map(d => d.count), [14, 7, 7, 6, 9, 5, 3, 6, 3]);
  for (let run = 0; run < 25; run++) {
    const session = createSession('exam');
    assert.equal(session.questions.length, 60);
    assert.equal(new Set(session.questions).size, 60);
    for (const { id, count } of domainAllocation()) {
      assert.equal(session.questions.filter(q => questionById[q].domain === id).length, count);
    }
  }
});

test('practice picks at most ten distinct questions from the chosen domain', () => {
  for (const domain of certification.domains) {
    const s = createSession('practice', domain.id, start, rng);
    assert.equal(s.questions.length, Math.min(10, questions.filter(q => q.domain === domain.id).length));
    assert.ok(s.questions.every(id => questionById[id].domain === domain.id));
    assert.equal(s.deadline, null);
  }
  assert.throws(() => createSession('practice', 'nonexistent'));
  assert.throws(() => createSession('invalid'));
});

test('option shuffles survive serialization and answers are graded against the original option index', () => {
  const s = createSession('exam', null, start, rng);
  for (const id of s.questions) {
    assert.deepEqual([...s.optionOrders[id]].sort(), [0, 1, 2, 3]);
    s.answers[id] = questionById[id].correctIndex;
  }
  const copy = JSON.parse(JSON.stringify(s));
  assert.deepEqual(copy.optionOrders, s.optionOrders);
  const result = gradeSession(copy);
  assert.equal(result.correct, 60);
  assert.equal(result.percentage, 100);
  delete copy.answers[copy.questions[0]];
  copy.answers[copy.questions[1]] = (questionById[copy.questions[1]].correctIndex + 1) % 4;
  assert.equal(gradeSession(copy).correct, 58);
  assert.equal(gradeSession(copy).unanswered, 1);
  assert.equal(gradeSession(copy).domains.reduce((sum, d) => sum + d.total, 0), 60);
});

test('timed sessions have a wall-clock 120-minute deadline, including time away from the tab', () => {
  const s = createSession('timed', null, start, rng);
  assert.equal(s.deadline, start + 120 * 60 * 1000);
  assert.equal(remainingSeconds(s, start), 7200);
  assert.equal(remainingSeconds(s, start + 3600_000), 3600);
  assert.equal(remainingSeconds(s, s.deadline - 1), 1);
  assert.equal(remainingSeconds(s, s.deadline), 0);
  assert.equal(remainingSeconds(s, s.deadline + 5000), 0);
  assert.equal(remainingSeconds(createSession('exam'), start), null);
});

test('responses cannot change after submission or expiry, and expiry submits exactly once', () => {
  const s = createSession('timed', null, start, rng);
  const id = s.questions[0];
  const changed = updateSession(s, { type: 'answer', id, option: 1 }, start + 1000);
  assert.equal(changed.answers[id], 1);
  const expired = updateSession(changed, { type: 'answer', id, option: 2 }, s.deadline);
  assert.equal(expired.answers[id], 1);
  assert.equal(expired.submittedAt, s.deadline);
  assert.equal(expired.finishReason, 'expired');
  assert.equal(updateSession(expired, { type: 'answer', id, option: 3 }, s.deadline + 2000), expired);
  assert.equal(submitSession(expired, s.deadline + 5000), expired);
});

test('practice feedback locks checked answers and keeps unchecked feedback hidden', () => {
  let s = createSession('practice', 'code', start, rng);
  const id = s.questions[0];
  s = updateSession(s, { type: 'check', id }, start);
  assert.equal(s.checked[id], undefined);
  s = updateSession(s, { type: 'answer', id, option: 0 }, start);
  s = updateSession(s, { type: 'check', id }, start);
  assert.equal(s.checked[id], true);
  assert.equal(updateSession(s, { type: 'answer', id, option: 2 }, start).answers[id], 0);
  const exam = createSession('exam', null, start, rng);
  assert.equal(updateSession(exam, { type: 'check', id: exam.questions[0] }, start), exam);
});

test('session actions validate options, current membership, flags, and navigation bounds', () => {
  const s = createSession('exam', null, start, rng);
  assert.equal(updateSession(s, { type: 'answer', id: 'missing', option: 0 }, start), s);
  assert.equal(updateSession(s, { type: 'answer', id: s.questions[0], option: 9 }, start), s);
  assert.equal(updateSession(s, { type: 'navigate', index: 60 }, start), s);
  let flagged = updateSession(s, { type: 'flag', id: s.questions[0] }, start);
  assert.equal(flagged.flags[s.questions[0]], true);
  flagged = updateSession(flagged, { type: 'flag', id: s.questions[0] }, start);
  assert.equal(flagged.flags[s.questions[0]], false);
  assert.equal(updateSession(s, { type: 'navigate', index: 59 }, start).index, 59);
});

test('saved sessions reject unknown content, invalid answer orders, malformed metadata, and wrong exam sizes', () => {
  const valid = createSession('timed', null, start, rng);
  assert.ok(isValidSession(JSON.parse(JSON.stringify(valid))));
  for (const transform of [
    s => { s.questions[0] = 'missing'; },
    s => { s.questions.pop(); },
    s => { s.questions[1] = s.questions[0]; },
    s => { s.answers[s.questions[0]] = 7; },
    s => { s.optionOrders[s.questions[0]] = [0, 0, 1, 2]; },
    s => { s.optionOrders[s.questions[0]] = ['0', '1', '2', '3']; },
    s => { s.optionOrders[s.questions[0]] = [[0], [1], [2], [3]]; },
    s => { s.index = -1; },
    s => { s.deadline = 'later'; },
    s => { s.deadline += 1000; },
    s => { s.mode = 'other'; },
    s => { s.flags = null; },
    s => { s.checked[s.questions[0]] = true; },
    s => { s.startedAt = Infinity; },
    s => { s.submittedAt = start - 10; },
  ]) {
    const copy = JSON.parse(JSON.stringify(valid));
    transform(copy);
    assert.equal(isValidSession(copy), false);
  }
  assert.equal(isValidSession(null), false);
});


test('catalog additions preserve valid saved practice sessions from a smaller earlier pool', () => {
  const s = createSession('practice', 'modeling', start, rng);
  s.questions = questions.filter(q => q.domain === 'modeling' && Number(q.id.split('-')[1]) <= 180).map(q => q.id);
  assert.equal(s.questions.length, 8);
  s.optionOrders = Object.fromEntries(s.questions.map(id => [id, [0, 1, 2, 3]]));
  s.answers[s.questions[0]] = questionById[s.questions[0]].correctIndex;
  assert.ok(isValidSession(s));
  assert.equal(gradeSession(s).total, 8);
});
