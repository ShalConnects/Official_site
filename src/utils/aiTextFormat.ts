/** Pure helpers + shared types for the AI Text Formatter tool. */

export type DisplayMode = 'plain' | 'formatted' | 'rich';

export interface HistoryEntry {
  input: string;
  output: string;
  timestamp: number;
}

export interface FormattingConfig {
  displayMode: DisplayMode;
  fontSize: number;
  lineHeight: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  paragraphSpacing: number;
  spacingMode?: 'compact' | 'standard' | 'spacious';
  preserveBold?: boolean;
  preserveItalic?: boolean;
  listStyle?: 'bullet' | 'dash' | 'asterisk';
  numberedStyle?: 'dot' | 'paren' | 'paren2';
  headerSpacing?: 'always' | 'never' | 'smart';
  outputFormat?: 'plain' | 'markdown' | 'html';
  smartParagraphs?: boolean;
}

export interface PatternPerformance {
  pattern: string;
  type: 'intro' | 'closing' | 'keyword' | 'emdash';
  matches: number;
  correctMatches: number;
  incorrectMatches: number;
  lastUsed: number;
  confidence: number;
}

export interface UserCorrection {
  originalText: string;
  correctedText: string;
  removedPatterns: string[];
  keptPatterns: string[];
  timestamp: number;
  context?: string;
  emDashReplacements?: Array<{
    original: string;
    replaced: string;
    context: 'sentence' | 'list' | 'parenthetical' | 'other';
    position: number;
  }>;
}

export interface PatternFeedback {
  pattern: string;
  type: 'intro' | 'closing' | 'keyword' | 'emdash';
  feedback: 'correct' | 'incorrect';
  context: string;
  timestamp: number;
}

export interface LearningData {
  patternPerformance: PatternPerformance[];
  userCorrections: UserCorrection[];
  patternFeedback: PatternFeedback[];
  userPreferences: {
    preferredPatterns: string[];
    disabledPatterns: string[];
    domainPreferences: Record<string, string[]>;
  };
  lastUpdated: number;
}

export const EMPTY_LEARNING_DATA: LearningData = {
  patternPerformance: [],
  userCorrections: [],
  patternFeedback: [],
  userPreferences: {
    preferredPatterns: [],
    disabledPatterns: [],
    domainPreferences: {},
  },
  lastUpdated: Date.now(),
};

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatForRichPreview(text: string): string {
  if (!text) return '';
  return text
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((para) => {
      if (/^[•\-\*\d]\.?\s/.test(para.trim())) {
        return `<ul>${para
          .split('\n')
          .filter((line) => /^[•\-\*\d]\.?\s/.test(line.trim()))
          .map((line) => `<li>${escapeHtml(line.replace(/^[•\-\*\d]\.?\s+/, '').trim())}</li>`)
          .join('')}</ul>`;
      }
      return `<p>${escapeHtml(para.replace(/\n/g, ' ').trim())}</p>`;
    })
    .join('');
}

export function detectAIText(text: string): {
  detected: boolean;
  confidence: number;
  patterns: string[];
} {
  if (!text) return { detected: false, confidence: 0, patterns: [] };

  const detectedPatterns: string[] = [];
  let score = 0;

  const aiPatterns = [
    { pattern: /\*\*.*?\*\*/, name: 'Bold formatting', weight: 1 },
    { pattern: /__.*?__/, name: 'Bold alt', weight: 1 },
    { pattern: /\*[^*\n].*?\*/, name: 'Italic', weight: 1 },
    { pattern: /_[^_\n].*?_/, name: 'Italic alt', weight: 1 },
    { pattern: /^#{1,6}\s+/m, name: 'Headers', weight: 2 },
    { pattern: /\[.*?\]\(.*?\)/, name: 'Markdown links', weight: 2 },
    { pattern: /^[\*\-\+]\s+/m, name: 'Bullet points', weight: 2 },
    { pattern: /^\d+\.\s+/m, name: 'Numbered lists', weight: 2 },
    { pattern: /```[\s\S]*?```/, name: 'Code blocks', weight: 3 },
    { pattern: /`[^`\n]+`/, name: 'Inline code', weight: 1 },
    { pattern: /^>\s+/m, name: 'Blockquotes', weight: 1 },
    { pattern: /^[\-\*]{3,}$/m, name: 'Horizontal rules', weight: 1 },
  ];

  const aiPhrases = [
    /here'?s\s+(a|the|your)/i,
    /let\s+me\s+(help|explain|show)/i,
    /i'?d\s+(be\s+)?happy\s+to/i,
    /feel\s+free\s+to/i,
    /don'?t\s+hesitate/i,
  ];

  for (const { pattern, name, weight } of aiPatterns) {
    if (pattern.test(text)) {
      detectedPatterns.push(name);
      score += weight;
    }
  }
  for (const phrase of aiPhrases) {
    if (phrase.test(text)) {
      detectedPatterns.push('AI phrases');
      score += 2;
    }
  }

  const confidence = Math.min(100, Math.round((score / 20) * 100));
  return { detected: score >= 3, confidence, patterns: [...new Set(detectedPatterns)] };
}
