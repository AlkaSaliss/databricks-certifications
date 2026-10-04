import { useCallback, useEffect, useState } from 'react';
import { certification, modes } from './data/certifications.js';
import sources from './data/sources.json';
import { createSession, gradeSession, questions, submitSession, updateSession } from './quiz.js';
import { readStore, writeStore } from './storage.js';
import Icon from './components/Icon.jsx';
import Quiz from './components/Quiz.jsx';
import Results from './components/Results.jsx';
import Confirm from './components/Confirm.jsx';

const domainCounts = Object.fromEntries(certification.domains.map(d => [d.id, questions.filter(q => q.domain === d.id).length]));

export default function App() {
  const [initial] = useState(() => readStore());
  const [store, setStore] = useState(initial.store);
  const [notice, setNotice] = useState(initial.notice);
  const [canSave, setCanSave] = useState(true);
  const [view, setView] = useState(initial.store.active ? 'quiz' : 'dashboard');
  const [mode, setMode] = useState('practice');
  const [domainId, setDomainId] = useState('code');
  const [now, setNow] = useState(Date.now());
  const [resultSession, setResultSession] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [search, setSearch] = useState('');
  const active = store.active;

  useEffect(() => {
    const saved = writeStore(store);
    setCanSave(saved);
    if (!saved) setNotice('Browser storage is unavailable. This session works, but progress will not survive a refresh.');
  }, [store]);

  const complete = useCallback(session => {
    setStore(previous => ({ active: null, attempts: [session, ...previous.attempts.filter(attempt => attempt.id !== session.id)].slice(0, 50) }));
    setResultSession(session);
    setDialog(null);
    setView('results');
  }, []);

  useEffect(() => {
    if (!active || active.deadline === null) return;
    const tick = () => {
      const time = Date.now();
      setNow(time);
      if (time >= active.deadline) complete(submitSession(active, time));
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [active, complete]);

  const start = () => {
    const session = createSession(mode, mode === 'practice' ? domainId : null);
    setStore(previous => ({ ...previous, active: session }));
    setNow(Date.now());
    setDialog(null);
    setView('quiz');
  };
  const action = nextAction => {
    const next = updateSession(active, nextAction);
    if (next.submittedAt !== null) complete(next);
    else setStore(previous => ({ ...previous, active: next }));
  };
  const navigate = next => { setView(next); setSearch(''); window.scrollTo(0, 0); };
  const selectedDomain = certification.domains.find(d => d.id === domainId);
  const selectedMode = modes.find(m => m.id === mode);
  const latest = store.attempts[0];
  const nav = [{ id: 'dashboard', icon: 'grid', title: 'Practice' }, { id: 'history', icon: 'history', title: 'My sessions' }, { id: 'resources', icon: 'book', title: 'Study resources' }];

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <aside className="sidebar"><button className="brand" onClick={() => navigate('dashboard')} aria-label="Lakehouse Prep home"><span className="brand-symbol"><Icon name="layers" size={25} /></span><span>lakehouse<span className="brand-sub">PREP</span></span></button><p className="sidebar-label">YOUR STUDY SPACE</p><nav aria-label="Main navigation">{nav.map(item => <button key={item.id} aria-label={item.title} className={`nav-item ${view === item.id || item.id === 'dashboard' && ['quiz', 'results'].includes(view) ? 'active' : ''}`} onClick={() => navigate(item.id)}><Icon name={item.icon} /><span>{item.title}</span>{item.id === 'history' && store.attempts.length > 0 && <span className="nav-count">{store.attempts.length}</span>}</button>)}</nav><div className="sidebar-bottom"><div className="study-tip"><span className="tip-icon"><Icon name="target" /></span><strong>Practice with purpose.</strong><p>Pair your quizzes with hands-on practice in Databricks.</p><a href="https://www.databricks.com/learn/free-edition" target="_blank" rel="noreferrer">Explore Free Edition <Icon name="external" size={14} /></a></div><span className="independent-label">Independent certification prep</span></div></aside>
    <div className="workspace"><header className="topbar"><span className="topbar-label">Databricks certification practice</span><a href={certification.guideUrl} target="_blank" rel="noreferrer">Official exam guide <Icon name="external" size={15} /></a></header><main id="main-content">
      {notice && <div className="notice" role="status"><Icon name="info" size={18} /><span>{notice}</span><button onClick={() => setNotice(null)} aria-label="Dismiss storage notice"><Icon name="close" size={16} /></button></div>}
      {view === 'dashboard' && <>
        <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="tiny-line" />YOUR NEXT MILESTONE</p><h1>Build confidence.<br /><span>One question at a time.</span></h1><p>Turn what you know into what you can do.<br className="desktop-break" /> Prepare for your next Databricks certification.</p><div className="hero-tags"><span><Icon name="check" size={15} />Source-backed questions</span><span><Icon name="check" size={15} />Built for focused practice</span></div></div><div className="credential-visual" aria-hidden="true"><div className="credential-orbit orbit-one" /><div className="credential-orbit orbit-two" /><div className="credential-card"><div className="credential-mark"><Icon name="layers" size={39} /></div><p>DATABRICKS</p><strong>Data Engineer<br />Professional</strong><span className="credential-level">PROFESSIONAL LEVEL</span><div className="credential-line" /><small>Your next chapter starts here.</small></div><span className="credential-spark spark-one">+</span><span className="credential-spark spark-two">+</span></div></section>
        <section className="certification-bar"><div className="certification-icon"><Icon name="layers" size={25} /></div><div className="certification-select"><label htmlFor="certification">YOUR CERTIFICATION</label><select id="certification" value={certification.id} onChange={() => {}}><option value={certification.id}>{certification.title}</option></select></div><span className="version-badge">From Oct 9, 2026</span><div className="exam-stat"><strong>60</strong><span>exam questions</span></div><div className="exam-stat"><strong>120<span> min</span></strong><span>official time limit</span></div></section>
        {active && <div className="resume-card"><div><strong>You have a session in progress</strong><p>{modes.find(m => m.id === active.mode).title} · {Object.keys(active.answers).length} of {active.questions.length} answered{active.mode === 'timed' ? ' · Timer is running' : ''}</p></div><button className="primary" onClick={() => navigate('quiz')}>Resume session <Icon name="arrow" size={17} /></button></div>}
        <section className="mode-section"><div className="section-heading"><div><p className="step-label">01 / CHOOSE YOUR APPROACH</p><h2>How do you want to practice?</h2></div><span className="section-caption">A little progress, every session.</span></div><div className="mode-grid">{modes.map(item => <button key={item.id} className={`mode-card ${mode === item.id ? 'selected' : ''}`} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}><span className="mode-top"><span className="mode-icon"><Icon name={item.icon} size={25} /></span><span className="mode-radio">{mode === item.id && <Icon name="check" size={13} />}</span></span><span className="mode-label">{item.label}</span><strong>{item.title}</strong><span className="mode-description">{item.description}</span><span className="mode-detail">{item.detail}</span></button>)}</div></section>
        {mode === 'practice' ? <section className="topics-section"><div className="section-heading"><div><p className="step-label">02 / PICK YOUR FOCUS</p><h2>One topic. Deeper understanding.</h2><p className="muted">Explore all nine domains in the October 2026 exam blueprint.</p></div><span className="question-total">{questions.length} practice questions</span></div><div className="topic-grid">{certification.domains.map((domain, index) => <button key={domain.id} className={`topic-card ${domainId === domain.id ? 'selected' : ''}`} aria-pressed={domainId === domain.id} onClick={() => setDomainId(domain.id)}><span className="topic-card-top"><span className="topic-icon"><Icon name={domain.icon} size={21} /></span><span className="topic-weight">{domain.weight}% of exam</span></span><span className="topic-number">DOMAIN {String(index + 1).padStart(2, '0')}</span><strong>{domain.title}</strong><span className="topic-description">{domain.description}</span><span className="topic-footer">{domainCounts[domain.id]} questions<Icon name={domainId === domain.id ? 'check' : 'arrow'} size={16} /></span></button>)}</div></section> : <section className="exam-info"><div className="section-heading"><div><p className="step-label">02 / YOUR EXAM SIMULATION</p><h2>{mode === 'timed' ? 'The full exam. The official time limit.' : 'The full exam. Room to think.'}</h2></div><span className="badge">October 2026 blueprint</span></div><div className="exam-rules"><div><Icon name="clipboard" /><strong>60 unique questions</strong><p>Randomized questions and answers, balanced across the nine exam domains.</p></div><div><Icon name={mode === 'timed' ? 'clock' : 'book'} /><strong>{mode === 'timed' ? '120 minutes, no pause' : 'Learn at your own pace'}</strong><p>{mode === 'timed' ? 'The deadline continues while you are away. Your exam submits when time runs out.' : 'Take the time you need. Leave and resume your session on this device.'}</p></div><div><Icon name="target" /><strong>Review when you finish</strong><p>Navigate freely, flag questions, and see explanations after submitting.</p></div></div><p className="small-note">Simulates the 60 scored questions. The real exam may also include up to 10 unscored items within its 120-minute limit.</p></section>}
        <div className="start-bar"><div><span>READY WHEN YOU ARE</span><strong>{mode === 'practice' ? selectedDomain.title : selectedMode.title}</strong><small>{mode === 'practice' ? `${Math.min(10, domainCounts[domainId])} questions · No timer` : selectedMode.detail}</small></div><button className="primary" onClick={() => active ? setDialog('replace') : start()}>Start {mode === 'practice' ? 'practice' : 'exam'} <Icon name="arrow" size={18} /></button></div>
        <div className="dashboard-footnote"><span><span className={`status-dot ${canSave ? '' : 'unsaved'}`} />{canSave ? 'Progress is saved on this device' : 'Progress is available for this session only'}</span>{latest && <button className="text-button" onClick={() => { setResultSession(latest); setView('results'); }}>Last score: {gradeSession(latest).percentage}% <Icon name="arrow" size={14} /></button>}<span>Original practice questions · Independent of Databricks</span></div>
      </>}
      {view === 'quiz' && active && <Quiz session={active} now={now} canSave={canSave} onAction={action} onSubmit={() => setDialog('submit')} onHome={() => navigate('dashboard')} />}
      {view === 'results' && resultSession && <Results key={resultSession.id} session={resultSession} onHome={() => navigate('dashboard')} />}
      {view === 'history' && <><div className="page-heading"><p className="eyebrow">A RECORD OF YOUR PROGRESS</p><h1>My sessions</h1><p className="muted">Your last 50 completed sessions, saved on this device.</p></div>{store.attempts.length ? <div className="history-list">{store.attempts.map(attempt => { const grade = gradeSession(attempt); return <button className="history-card" key={attempt.id} onClick={() => { setResultSession(attempt); setView('results'); }}><span className="topic-icon"><Icon name={modes.find(m => m.id === attempt.mode).icon} /></span><span className="history-details"><strong>{attempt.domainId ? certification.domains.find(d => d.id === attempt.domainId).title : modes.find(m => m.id === attempt.mode).title}</strong><span>{new Date(attempt.submittedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {grade.correct}/{grade.total} correct{attempt.finishReason === 'expired' ? ' · Time expired' : ''}</span></span><b>{grade.percentage}%</b><Icon name="chevron" /></button>; })}</div> : <div className="empty-state"><Icon name="history" size={42} /><h2>Your first session is a fresh start.</h2><p>Complete a practice set or exam to see your results here.</p><button className="primary" onClick={() => navigate('dashboard')}>Start practicing <Icon name="arrow" size={17} /></button></div>}</>}
      {view === 'resources' && <><div className="page-heading"><p className="eyebrow">GO STRAIGHT TO THE SOURCE</p><h1>Study resources</h1><p className="muted">{sources.length} official documentation references. Reviewed October 4, 2026.</p></div><a className="guide-card" href={certification.guideUrl} target="_blank" rel="noreferrer"><span className="topic-icon"><Icon name="clipboard" size={25} /></span><div><strong>Data Engineer Professional · Official exam guide</strong><p>Use the new exam outline starting October 9, 2026. Recheck before your exam.</p></div><Icon name="external" /></a><label className="resource-search"><Icon name="search" /><span className="sr-only">Search study resources</span><input placeholder="Search documentation…" value={search} onChange={e => setSearch(e.target.value)} /></label><div className="resource-list">{sources.filter(source => source.title.toLowerCase().includes(search.toLowerCase())).map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.title}</strong><small>{new URL(source.url).hostname}</small></span><Icon name="external" size={17} /></a>)}</div>{!sources.some(source => source.title.toLowerCase().includes(search.toLowerCase())) && <p className="empty-state">No resources match this search.</p>}<p className="assessment-note"><Icon name="info" size={17} />Quiz explanations link to their supporting documentation. Pair reading with hands-on practice; preview features and runtime requirements can change.</p></>}
    </main><footer className="app-footer">Made for the next step in your data journey.<span>Lakehouse Prep</span></footer></div>
    {dialog && <Confirm title={dialog === 'submit' ? 'Submit your session?' : 'Start a new session?'} confirmLabel={dialog === 'submit' ? 'Submit & see results' : 'Discard & start new'} onCancel={() => setDialog(null)} onConfirm={() => dialog === 'submit' ? complete(submitSession(active)) : start()}>{dialog === 'submit' ? <><p>You’ve answered {Object.keys(active.answers).length} of {active.questions.length} questions.</p><p>{active.questions.length - Object.keys(active.answers).length ? 'Unanswered questions will count as incorrect. You can review every answer after submission.' : 'You can review every answer and its explanation after submission.'}</p></> : <p>Your current session will be discarded. Completed sessions will stay in your history.</p>}</Confirm>}
  </div>;
}
