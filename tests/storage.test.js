import test from 'node:test';
import assert from 'node:assert/strict';
import { readStore, writeStore, STORAGE_KEY } from '../src/storage.js';
import { createSession, submitSession } from '../src/quiz.js';

function storage(initial = null) {
  let value = initial;
  return { getItem: () => value, setItem: (_, next) => { value = next; } };
}

test('empty storage and corrupted JSON recover to a usable empty store', () => {
  assert.deepEqual(readStore(storage()).store, { active: null, attempts: [] });
  assert.equal(readStore(storage('{not json')).store.active, null);
  assert.ok(readStore(storage('{not json')).notice);
  assert.equal(readStore(storage('null')).store.active, null);
  assert.equal(readStore(storage('{}')).store.active, null);
});

test('storage safely round trips active sessions and completed attempt history', () => {
  const s = storage();
  const active = createSession('timed');
  const attempt = submitSession(createSession('practice', 'code'));
  const store = { active, attempts: [attempt] };
  assert.equal(writeStore(store, s), true);
  assert.deepEqual(readStore(s).store, store);
  assert.equal(typeof STORAGE_KEY, 'string');
});

test('blocked browser storage does not throw and reports loss of persistence', () => {
  const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); } };
  const result = readStore(blocked);
  assert.equal(result.store.active, null);
  assert.ok(result.notice);
  assert.equal(writeStore(result.store, blocked), false);
});

test('invalid saved active content is removed without discarding valid completed history', () => {
  const attempt = submitSession(createSession('exam'));
  const result = readStore(storage(JSON.stringify({ version: 1, active: { mode: 'timed' }, attempts: [attempt, null, { id: 'old' }] })));
  assert.equal(result.store.active, null);
  assert.deepEqual(result.store.attempts, [attempt]);
  assert.ok(result.notice);
});

test('a completed active session is recovered as one historical attempt', () => {
  const active = submitSession(createSession('timed'));
  const result = readStore(storage(JSON.stringify({ version: 1, active, attempts: [active] })));
  assert.equal(result.store.active, null);
  assert.equal(result.store.attempts.length, 1);
});
