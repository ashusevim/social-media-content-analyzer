import type { SuggestionSummary } from '../types/analysis';

type SuggestionsPanelProps = {
  summary: SuggestionSummary;
};

const priorityLabel = {
  high: 'High impact',
  medium: 'Nice to have',
  low: 'Optional',
};

export function SuggestionsPanel({ summary }: SuggestionsPanelProps) {
  if (!summary) return null;

  const { metrics, suggestions } = summary;

  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Engagement insights</h3>
        <span className="panel__hint">Data-backed suggestions</span>
      </div>

      <div className="metrics-grid">
        <div>
          <p className="metrics-grid__label">Words</p>
          <p className="metrics-grid__value">{metrics.wordCount}</p>
        </div>
        <div>
          <p className="metrics-grid__label">Reading time</p>
          <p className="metrics-grid__value">{metrics.readingTime} min</p>
        </div>
        <div>
          <p className="metrics-grid__label">Hashtags</p>
          <p className="metrics-grid__value">{metrics.hashtagCount}</p>
        </div>
        <div>
          <p className="metrics-grid__label">Mentions</p>
          <p className="metrics-grid__value">{metrics.mentionCount}</p>
        </div>
        <div>
          <p className="metrics-grid__label">Emojis</p>
          <p className="metrics-grid__value">{metrics.emojiCount}</p>
        </div>
        <div>
          <p className="metrics-grid__label">Avg sentence</p>
          <p className="metrics-grid__value">{metrics.avgSentenceLength} words</p>
        </div>
      </div>

      <ul className="suggestions">
        {suggestions.length ? (
          suggestions.map((suggestion) => (
            <li key={suggestion.title} className={`suggestions__item suggestions__item--${suggestion.priority}`}>
              <div>
                <p className="suggestions__title">{suggestion.title}</p>
                <p className="suggestions__detail">{suggestion.detail}</p>
              </div>
              <span className="suggestions__badge">{priorityLabel[suggestion.priority]}</span>
            </li>
          ))
        ) : (
          <li className="suggestions__item">
            <p className="suggestions__title">Looking great!</p>
            <p className="suggestions__detail">No immediate improvements detected.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
