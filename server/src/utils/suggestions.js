const CTA_PHRASES = ['click', 'learn more', 'sign up', 'subscribe', 'join'];
const EMOJI_REGEX = /\p{Emoji}/gu;

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function estimateReadingTime(wordCount) {
  const WORDS_PER_MINUTE = 180;
  return Number((wordCount / WORDS_PER_MINUTE).toFixed(2));
}

function analyzeText(text = '') {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const wordCount = normalized ? normalized.split(' ').length : 0;
  const hashtagCount = countMatches(text, /#[\w-]+/g);
  const mentionCount = countMatches(text, /@[\w-]+/g);
  const emojiCount = countMatches(text, EMOJI_REGEX);
  const sentenceCount = countMatches(text, /[.!?]+/g) || 1;
  const avgSentenceLength = sentenceCount ? Math.round(wordCount / sentenceCount) : wordCount;

  return {
    normalized,
    wordCount,
    hashtagCount,
    mentionCount,
    emojiCount,
    avgSentenceLength,
    readingTime: estimateReadingTime(wordCount),
  };
}

function buildSuggestionSummary(text = '') {
  const safeText = text || '';
  const analysis = analyzeText(safeText);
  const suggestions = [];

  if (analysis.wordCount < 20) {
    suggestions.push({
      title: 'Add more context',
      detail: 'Posts under 20 words rarely stand out. Elaborate with a benefit, data point, or quote.',
      priority: 'medium',
    });
  }

  if (analysis.wordCount > 80) {
    suggestions.push({
      title: 'Tighten copy',
      detail: 'High word counts can decrease completion rates. Trim filler and lead with the hook.',
      priority: 'high',
    });
  }

  if (analysis.hashtagCount === 0) {
    suggestions.push({
      title: 'Add hashtags',
      detail: 'Relevant hashtags increase discovery. Aim for 2–4 niche tags.',
      priority: 'medium',
    });
  }

  if (analysis.mentionCount === 0) {
    suggestions.push({
      title: 'Mention partners or fans',
      detail: 'Tagging collaborators encourages re-shares and boosts credibility.',
      priority: 'low',
    });
  }

  const hasCta = CTA_PHRASES.some((phrase) => safeText.toLowerCase().includes(phrase));
  if (!hasCta) {
    suggestions.push({
      title: 'Add a clear CTA',
      detail: 'Tell the audience what to do next (download, reply, visit link).',
      priority: 'high',
    });
  }

  if (analysis.emojiCount === 0) {
    suggestions.push({
      title: 'Consider emojis',
      detail: 'Selective emojis can improve scannability. Use 1–2 expressive icons.',
      priority: 'low',
    });
  }

  if (analysis.avgSentenceLength > 25) {
    suggestions.push({
      title: 'Shorten sentences',
      detail: 'Long sentences hide the hook. Break them up for clarity.',
      priority: 'medium',
    });
  }

  return {
    metrics: {
      wordCount: analysis.wordCount,
      hashtagCount: analysis.hashtagCount,
      mentionCount: analysis.mentionCount,
      emojiCount: analysis.emojiCount,
      readingTime: analysis.readingTime,
      avgSentenceLength: analysis.avgSentenceLength,
    },
    suggestions,
  };
}

module.exports = {
  buildSuggestionSummary,
};
