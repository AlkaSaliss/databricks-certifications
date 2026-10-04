import { isValidSession } from './quiz.js';

export const STORAGE_KEY = 'lakehouse-prep-v1';
const empty = () => ({ active: null, attempts: [] });

export function readStore(storage) {
  try {
    const raw = (storage ?? window.localStorage).getItem(STORAGE_KEY);
    if (!raw) return { store: empty(), notice: null };
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 1 || !Array.isArray(saved.attempts)) {
      return { store: empty(), notice: 'Saved progress was outdated or unreadable. You can start a new session.' };
    }
    const valid = saved.attempts.filter(s => isValidSession(s) && s.submittedAt !== null);
    const attempts = valid.filter((s, i) => valid.findIndex(other => other.id === s.id) === i).slice(0, 50);
    let active = isValidSession(saved.active) ? saved.active : null;
    const invalid = (saved.active !== null && !active) || valid.length !== saved.attempts.length;
    if (active?.submittedAt !== null && active) {
      if (!attempts.some(s => s.id === active.id)) attempts.unshift(active);
      active = null;
    }
    return { store: { active, attempts: attempts.slice(0, 50) }, notice: invalid ? 'Some saved progress was unreadable and has been removed.' : null };
  } catch {
    return { store: empty(), notice: 'Browser storage is unavailable or unreadable. Progress may not survive a refresh.' };
  }
}

export function writeStore(store, storage) {
  try {
    (storage ?? window.localStorage).setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...store }));
    return true;
  } catch {
    return false;
  }
}
