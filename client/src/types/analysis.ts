export type FileCategory = 'pdf' | 'image';

export interface AnalyzedFile {
  filename: string;
  type: FileCategory;
  text: string;
}

export type SuggestionPriority = 'low' | 'medium' | 'high';

export interface SuggestionItem {
  title: string;
  detail: string;
  priority: SuggestionPriority;
}

export interface SuggestionMetrics {
  wordCount: number;
  hashtagCount: number;
  mentionCount: number;
  emojiCount: number;
  readingTime: number;
  avgSentenceLength: number;
}

export interface SuggestionSummary {
  metrics: SuggestionMetrics;
  suggestions: SuggestionItem[];
}

export interface AnalyzeResponse {
  files: AnalyzedFile[];
  extractedText: string;
  suggestions: SuggestionSummary;
}
