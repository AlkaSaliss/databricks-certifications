import { useEffect, useRef } from 'react';
import { certification, modes } from '../data/certifications.js';
import { questionById, remainingSeconds } from '../quiz.js';
import Question from './Question.jsx';
import Icon from './Icon.jsx';

export default function Quiz({ session, now, canSave, onAction, onSubmit, onHome }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, [session.index]);
  const question = questionById[session.questions[session.index]];
  const domain = certification.domains.find(d => d.id === question.domain);
  const answered = session.questions.filter(id => session.answers[id] !== undefined).length;
  const seconds = remainingSeconds(session, now);
  const formatted = seconds === null ? null : `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const checked = Boolean(session.checked[question.id]);
  const last = session.index === session.questions.length - 1;
  return <div className="quiz-page">
    <div className="quiz-topline"><button className="text-button" onClick={onHome}><span className="back-arrow">←</span> Back to dashboard</button><span className="save-label"><span className={`status-dot ${canSave ? '' : 'unsaved'}`} />{canSave ? 'Session stays available on this device' : 'Session is not saved in this browser'}</span></div>
    <div className="page-heading quiz-heading"><div><p className="eyebrow">{certification.title}</p><h1 ref={heading} tabIndex={-1}>{modes.find(m => m.id === session.mode).title}</h1></div>{formatted && <div className={`timer ${seconds < 600 ? 'urgent' : ''}`} role="timer" aria-label={`${Math.ceil(seconds / 60)} minutes remaining`}><Icon name="clock" /><span>{formatted}</span><small>remaining</small></div>}</div>
    <div className="quiz-layout">
      <section className="question-card">
        <div className="question-meta"><span className="badge">{domain.title}</span><span>Question {session.index + 1} of {session.questions.length}</span></div>
        <Question question={question} order={session.optionOrders[question.id]} answer={session.answers[question.id]} revealed={checked} onAnswer={option => onAction({ type: 'answer', id: question.id, option })} />
        {session.mode === 'practice' && !checked && <button className="primary check-answer" disabled={session.answers[question.id] === undefined} onClick={() => onAction({ type: 'check', id: question.id })}>Check answer <Icon name="check" size={17} /></button>}
        <div className="question-controls"><button className="secondary" disabled={session.index === 0} onClick={() => onAction({ type: 'navigate', index: session.index - 1 })}>← Previous</button><button className={`text-button flag-button ${session.flags[question.id] ? 'flagged' : ''}`} onClick={() => onAction({ type: 'flag', id: question.id })} aria-pressed={Boolean(session.flags[question.id])}><Icon name="flag" size={17} />{session.flags[question.id] ? 'Flagged' : 'Flag for review'}</button>{last ? <button className="primary" onClick={onSubmit}>Finish session <Icon name="check" size={17} /></button> : <button className="primary" onClick={() => onAction({ type: 'navigate', index: session.index + 1 })}>Next <Icon name="arrow" size={17} /></button>}</div>
      </section>
      <aside className="navigator-card"><h2>Your progress</h2><div className="progress-label"><strong>{answered}<span> / {session.questions.length}</span></strong><span>answered</span></div><div className="progress-track"><div style={{ width: `${answered / session.questions.length * 100}%` }} /></div><div className="question-grid" aria-label="Question navigation">{session.questions.map((id, i) => <button key={id} className={`question-number ${session.index === i ? 'current' : ''} ${session.answers[id] !== undefined ? 'answered' : ''} ${session.flags[id] ? 'has-flag' : ''}`} aria-label={`Question ${i + 1}${session.answers[id] !== undefined ? ', answered' : ', unanswered'}${session.flags[id] ? ', flagged' : ''}`} aria-current={session.index === i ? 'step' : undefined} onClick={() => onAction({ type: 'navigate', index: i })}>{i + 1}{session.flags[id] && <span className="mini-flag" />}</button>)}</div><div className="navigator-legend"><span><i className="legend-square answered" />Answered</span><span><i className="legend-square" />Unanswered</span><span><i className="legend-flag" />Flagged</span></div><button className="secondary submit-button" onClick={onSubmit}>Submit session <Icon name="check" size={17} /></button><p className="small-note">{session.mode === 'practice' ? 'Check each answer for its explanation, or review everything after submission.' : 'Answers and explanations are revealed after submission.'}</p>{session.mode === 'timed' && <p className="small-note">The timer keeps running when you leave. Your exam submits at zero.</p>}</aside>
    </div>
  </div>;
}
