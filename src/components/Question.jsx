import sources from '../data/sources.json';
import community from '../data/community-resources.json';
import Icon from './Icon.jsx';

const sourceById = Object.fromEntries(sources.map(source => [source.id, source]));
const communityById = Object.fromEntries(community.map(resource => [resource.id, resource]));

export default function Question({ question, order, answer, revealed, onAnswer }) {
  return <>
    <p className="objective">{question.objective}</p>
    <h2 className="question-prompt">{question.prompt}</h2>
    {question.code && <pre className="code-block"><code>{question.code}</code></pre>}
    <fieldset className="options" disabled={revealed}>
      <legend className="sr-only">Choose one answer</legend>
      {order.map((option, index) => {
        const selected = answer === option;
        const correct = revealed && option === question.correctIndex;
        const wrong = revealed && selected && !correct;
        return <label key={option} className={`option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}>
          <input type="radio" name={`answer-${question.id}`} value={option} checked={selected} onChange={() => onAnswer(option)} />
          <span className="option-letter">{String.fromCharCode(65 + index)}</span>
          <span className="option-text">{question.options[option]}</span>
          {correct ? <Icon name="check" /> : wrong ? <Icon name="close" /> : <span className="option-dot" />}
        </label>;
      })}
    </fieldset>
    {revealed && <div className={`feedback ${answer === question.correctIndex ? 'positive' : 'negative'}`} role="status">
      <div className="feedback-heading"><Icon name={answer === question.correctIndex ? 'check' : 'info'} /><strong>{answer === question.correctIndex ? 'Correct answer' : answer === undefined ? 'Not answered' : 'Let’s break it down'}</strong></div>
      <p>{question.explanation}</p>
      <div className="source-links">{question.sources.map(id => <a key={id} href={sourceById[id].url} target="_blank" rel="noreferrer">{sourceById[id].title}<Icon name="external" size={14} /></a>)}</div>
      {question.communitySources?.length > 0 && <div className="community-links"><span>Related community practice</span><div className="source-links">{question.communitySources.map(id => <a key={id} href={communityById[id].url} target="_blank" rel="noreferrer">{communityById[id].title}<Icon name="external" size={14} /></a>)}</div></div>}
    </div>}
  </>;
}
