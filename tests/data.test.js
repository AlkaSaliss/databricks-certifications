import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { certification } from '../src/data/certifications.js';

const questions = JSON.parse(readFileSync(new URL('../src/data/questions.json', import.meta.url)));
const sources = JSON.parse(readFileSync(new URL('../src/data/sources.json', import.meta.url)));

test('bank contains 180 distinct original, fully referenced MCQs', () => {
  assert.equal(questions.length, 180);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  assert.equal(new Set(questions.map(q => q.prompt)).size, questions.length);
  const sourceIds = new Set(sources.map(s => s.id));
  const domains = new Set(certification.domains.map(d => d.id));
  for (const q of questions) {
    assert.ok(domains.has(q.domain), q.id);
    assert.equal(q.options.length, 4, q.id);
    assert.equal(new Set(q.options).size, 4, q.id);
    assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 4, q.id);
    assert.ok(q.objective && q.prompt && q.explanation, q.id);
    assert.ok(q.sources.length > 0 && q.sources.every(id => sourceIds.has(id)), q.id);
    assert.ok(!/TODO|TBD/.test(JSON.stringify(q)), q.id);
  }
  assert.ok(questions.filter(q => q.code).length >= 25);
});

test('blueprint is the upcoming 60-question, 120-minute exam with sufficient domain supply', () => {
  assert.equal(certification.questionCount, 60);
  assert.equal(certification.durationMinutes, 120);
  assert.equal(certification.domains.length, 9);
  assert.equal(certification.domains.reduce((sum, d) => sum + d.weight, 0), 100);
  assert.deepEqual(certification.domains.map(d => d.weight), [23, 12, 12, 10, 15, 8, 5, 10, 5]);
  for (const d of certification.domains) {
    const pool = questions.filter(q => q.domain === d.id);
    assert.ok(pool.length >= Math.ceil(d.weight * 0.6), d.id);
    assert.ok(new Set(pool.map(q => q.objective)).size >= 2, d.id);
  }
});

test('source library uses primary documentation with unique IDs and valid URLs', () => {
  assert.ok(sources.length >= 70);
  assert.equal(new Set(sources.map(s => s.id)).size, sources.length);
  assert.equal(new Set(sources.map(s => s.url)).size, sources.length, 'Source entries must point to distinct supporting pages');
  for (const source of sources) {
    assert.ok(['docs.databricks.com', 'spark.apache.org'].includes(new URL(source.url).hostname));
    assert.ok(source.title && source.reviewedOn);
  }
});
