import { useState } from 'react';
import { certification, modes } from '../data/certifications.js';
import { gradeSession, questionById } from '../quiz.js';
import Question from './Question.jsx';
import Icon from './Icon.jsx';

export default function Results({ session, onHome }) {
  const [tab, setTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(0);
  const result = gradeSession(session);
  const ids = session.questions.filter(id => filter === 'all' || (filter === 'missed' ? session.answers[id] !== questionById[id].correctIndex : session.flags[id]));
  const reviewId = ids[Math.min(index, ids.length - 1)];
  const elapsed = Math.max(0, Math.round((session.submittedAt - session.startedAt) / 60_000));
  return <div className="results-page">
    <button className="text-button" onClick={onHome}>← Back to dashboard</button>
    <div className="page-heading"><div><p className="eyebrow">{modes.find(m => m.id === session.mode).title} · {certification.title}</p><h1>Every answer is a step forward.</h1><p className="muted">{session.finishReason === 'expired' ? 'Time is up. Your answers were submitted automatically.' : 'Session complete. Review your answers and keep building.'}</p></div></div>
    <div className="result-tabs" role="tablist" aria-label="Results view"><button role="tab" aria-selected={tab === 'overview'} aria-controls="overview-panel" id="overview-tab" onClick={() => setTab('overview')}>Overview</button><button role="tab" aria-selected={tab === 'review'} aria-controls="review-panel" id="review-tab" onClick={() => setTab('review')}>Review answers</button></div>
    {tab === 'overview' ? <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
      <section className="score-card"><div className="score-ring" style={{ '--score': `${result.percentage}%` }}><div><strong>{result.percentage}<span>%</span></strong><small>Practice score</small></div></div><div className="score-details"><p className="eyebrow">YOUR SESSION, AT A GLANCE</p><h2>{result.correct} of {result.total} correct</h2><div className="score-stats"><span><strong>{result.total - result.correct - result.unanswered}</strong>Incorrect</span><span><strong>{result.unanswered}</strong>Unanswered</span><span><strong>{elapsed}<small> min</small></strong>Time spent</span></div><button className="primary" onClick={() => setTab('review')}>Review answers <Icon name="arrow" size={17} /></button></div></section>
      <section className="breakdown-card"><div className="section-heading"><div><h2>Your topic breakdown</h2><p className="muted">Use these results to choose where to practice next.</p></div></div>{result.domains.map(d => <div key={d.id} className="breakdown-row"><span className="topic-icon"><Icon name={d.icon} /></span><strong>{d.title}</strong><div className="progress-track"><div style={{ width: `${d.percentage}%` }} /></div><span>{d.correct} / {d.total}</span><b>{d.percentage}%</b></div>)}</section>
      <p className="assessment-note"><Icon name="info" size={17} />This is an original practice set, not an official Databricks exam or a calibrated readiness assessment. No official pass/fail threshold is assumed.</p>
    </div> : <div id="review-panel" role="tabpanel" aria-labelledby="review-tab">
      <div className="review-toolbar"><label>Show <select value={filter} onChange={e => { setFilter(e.target.value); setIndex(0); }}><option value="all">All questions</option><option value="missed">Incorrect & unanswered</option><option value="flagged">Flagged questions</option></select></label><span>{ids.length} question{ids.length === 1 ? '' : 's'}</span></div>
      {reviewId ? <section className="question-card review-card"><div className="question-meta"><span className="badge">{certification.domains.find(d => d.id === questionById[reviewId].domain).title}</span><span>Question {session.questions.indexOf(reviewId) + 1} of {session.questions.length}</span></div><Question question={questionById[reviewId]} order={session.optionOrders[reviewId]} answer={session.answers[reviewId]} revealed onAnswer={() => {}} /><div className="question-controls"><button className="secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Previous</button><span className="muted">{index + 1} of {ids.length} in this view</span><button className="primary" disabled={index >= ids.length - 1} onClick={() => setIndex(index + 1)}>Next <Icon name="arrow" size={17} /></button></div></section> : <div className="empty-state"><Icon name="check" size={36} /><h2>No questions in this view</h2><p>Choose another filter to continue your review.</p></div>}
    </div>}
  </div>;
}
