import bank from './data/questions.json' with { type: 'json' };
import { certification } from './data/certifications.js';

export const questions = bank;
export const questionById = Object.fromEntries(bank.map(q => [q.id, q]));

function shuffle(items, rng) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function domainAllocation() {
  const allocation = certification.domains.map(d => {
    const exact = d.weight * certification.questionCount / 100;
    return { ...d, count: Math.floor(exact), remainder: exact % 1 };
  });
  const remaining = certification.questionCount - allocation.reduce((sum, d) => sum + d.count, 0);
  [...allocation].sort((a, b) => b.remainder - a.remainder).slice(0, remaining).forEach(d => d.count++);
  return allocation;
}

export function createSession(mode, domainId = null, now = Date.now(), rng = Math.random) {
  if (!['practice', 'exam', 'timed'].includes(mode)) throw new Error('Unknown quiz mode');
  if (mode === 'practice' && !certification.domains.some(d => d.id === domainId)) throw new Error('Unknown domain');
  const selected = mode === 'practice'
    ? shuffle(bank.filter(q => q.domain === domainId), rng).slice(0, 10)
    : domainAllocation().flatMap(d => shuffle(bank.filter(q => q.domain === d.id), rng).slice(0, d.count));
  const ids = shuffle(selected, rng).map(q => q.id);
  return {
    id: `${now}-${Math.floor(rng() * 1e12)}`,
    certificationId: certification.id,
    contentVersion: '2026-10-09-v1',
    mode,
    domainId: mode === 'practice' ? domainId : null,
    questions: ids,
    optionOrders: Object.fromEntries(ids.map(id => [id, shuffle([0, 1, 2, 3], rng)])),
    answers: {},
    checked: {},
    flags: {},
    index: 0,
    startedAt: now,
    deadline: mode === 'timed' ? now + certification.durationMinutes * 60_000 : null,
    submittedAt: null,
    finishReason: null,
  };
}

export function remainingSeconds(session, now = Date.now()) {
  return session.deadline === null ? null : Math.max(0, Math.ceil((session.deadline - now) / 1000));
}

export function submitSession(session, now = Date.now()) {
  if (session.submittedAt !== null) return session;
  const expired = session.deadline !== null && now >= session.deadline;
  return { ...session, submittedAt: expired ? session.deadline : now, finishReason: expired ? 'expired' : 'submitted' };
}

export function updateSession(session, action, now = Date.now()) {
  if (session.submittedAt !== null) return session;
  if (session.deadline !== null && now >= session.deadline) return submitSession(session, now);
  const { id } = action;
  if (action.type === 'navigate') {
    return Number.isInteger(action.index) && action.index >= 0 && action.index < session.questions.length
      ? { ...session, index: action.index } : session;
  }
  if (!session.questions.includes(id)) return session;
  if (action.type === 'answer' && Number.isInteger(action.option) && action.option >= 0 && action.option < 4 && !session.checked[id]) {
    return { ...session, answers: { ...session.answers, [id]: action.option } };
  }
  if (action.type === 'check' && session.mode === 'practice' && session.answers[id] !== undefined) {
    return { ...session, checked: { ...session.checked, [id]: true } };
  }
  if (action.type === 'flag') return { ...session, flags: { ...session.flags, [id]: !session.flags[id] } };
  return session;
}

export function gradeSession(session) {
  const domains = certification.domains.map(d => {
    const ids = session.questions.filter(id => questionById[id].domain === d.id);
    const correct = ids.filter(id => session.answers[id] === questionById[id].correctIndex).length;
    return { ...d, total: ids.length, correct, percentage: ids.length ? Math.round(correct / ids.length * 100) : 0 };
  }).filter(d => d.total);
  const correct = domains.reduce((sum, d) => sum + d.correct, 0);
  const total = session.questions.length;
  return { correct, total, percentage: Math.round(correct / total * 100), unanswered: session.questions.filter(id => session.answers[id] === undefined).length, domains };
}

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finiteTime = value => Number.isFinite(value) && value >= 0;

export function isValidSession(s) {
  if (!object(s) || typeof s.id !== 'string' || !s.id || s.certificationId !== certification.id || s.contentVersion !== '2026-10-09-v1') return false;
  if (!['practice', 'exam', 'timed'].includes(s.mode) || !finiteTime(s.startedAt)) return false;
  if (s.mode === 'timed' ? s.deadline !== s.startedAt + certification.durationMinutes * 60_000 : s.deadline !== null) return false;
  if (s.submittedAt !== null && (!finiteTime(s.submittedAt) || s.submittedAt < s.startedAt)) return false;
  if (s.submittedAt === null ? s.finishReason !== null : !['submitted', 'expired'].includes(s.finishReason)) return false;
  if (!Array.isArray(s.questions) || !s.questions.length || new Set(s.questions).size !== s.questions.length || !s.questions.every(id => Object.hasOwn(questionById, id))) return false;
  if (s.mode === 'practice') {
    // Keep earlier shorter practice sets valid when their topic pool grows.
    if (s.questions.length > 10 || !certification.domains.some(d => d.id === s.domainId) || !s.questions.every(id => questionById[id].domain === s.domainId)) return false;
  } else {
    if (s.domainId !== null || s.questions.length !== certification.questionCount) return false;
    if (!domainAllocation().every(d => s.questions.filter(id => questionById[id].domain === d.id).length === d.count)) return false;
  }
  if (!Number.isInteger(s.index) || s.index < 0 || s.index >= s.questions.length) return false;
  if (!object(s.optionOrders) || !s.questions.every(id => Array.isArray(s.optionOrders[id]) && s.optionOrders[id].length === 4 && s.optionOrders[id].every(Number.isInteger) && [...s.optionOrders[id]].sort().join(',') === '0,1,2,3')) return false;
  if (!object(s.answers) || !Object.entries(s.answers).every(([id, option]) => s.questions.includes(id) && Number.isInteger(option) && option >= 0 && option < 4)) return false;
  for (const key of ['checked', 'flags']) {
    if (!object(s[key]) || !Object.entries(s[key]).every(([id, value]) => s.questions.includes(id) && typeof value === 'boolean')) return false;
  }
  if (s.mode !== 'practice' && Object.values(s.checked).some(Boolean)) return false;
  if (Object.entries(s.checked).some(([id, checked]) => checked && s.answers[id] === undefined)) return false;
  return true;
}
