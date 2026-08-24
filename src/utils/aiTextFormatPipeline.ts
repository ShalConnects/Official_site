import type { LearningData } from './aiTextFormat';

export type FormatStyleOptions = {
  listStyle: 'bullet' | 'dash' | 'asterisk';
  numberedStyle: 'dot' | 'paren' | 'paren2';
  headerSpacing: 'always' | 'never' | 'smart';
  spacingMode: 'compact' | 'standard' | 'spacious';
  preserveBold: boolean;
  preserveItalic: boolean;
  smartParagraphs: boolean;
  outputFormat: 'plain' | 'markdown' | 'html';
};

export type EmDashReplacement = {
  original: string;
  replaced: string;
  context: 'sentence' | 'list' | 'parenthetical' | 'other';
  position: number;
};

export type LearningHooks = {
  getPatternConfidence: (patternId: string) => number;
  isPatternDisabled: (patternId: string) => boolean;
  learningData: LearningData;
};

function removeMetaCommentary(text: string, learning: LearningHooks): string {
  if (!text || text.trim().length === 0) return text;

  const lines = text.split('\n');
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  // Group lines into paragraphs, preserving line breaks
  for (const line of lines) {
    if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        // Join current paragraph lines with newlines to preserve structure
        paragraphs.push(currentParagraph.join('\n'));
        currentParagraph = [];
      }
      paragraphs.push('');
    } else {
      // Preserve each line separately to maintain line breaks
      currentParagraph.push(line.trim());
    }
  }
  if (currentParagraph.length > 0) {
    // Join remaining paragraph lines with newlines
    paragraphs.push(currentParagraph.join('\n'));
  }

  if (paragraphs.length === 0) return text;

  // Patterns for introductory meta-commentary with adaptive confidence
  const introPatterns = [
    { pattern: /^(alright|okay|ok)\s+[a-z]+[,\s]/i, id: 'intro-0' },
    { pattern: /^here'?s\s+(a|the|your)\s+(tightened|cleaned|short|punchy|corporate|version|draft)/i, id: 'intro-1' },
    { pattern: /^say\s+less/i, id: 'intro-2' },
    { pattern: /^here\s+you\s+go/i, id: 'intro-3' },
    { pattern: /giving\s+["'].*?["']\s+vibes/i, id: 'intro-4' },
    { pattern: /you\s+can\s+send\s+back/i, id: 'intro-5' },
    { pattern: /still\s+complete.*?still\s+professional/i, id: 'intro-6' },
    { pattern: /more\s+confident\s+version/i, id: 'intro-7' },
    { pattern: /easier\s+to\s+digest/i, id: 'intro-8' },
    { pattern: /smoother\s+and/i, id: 'intro-9' },
  ];

  // Patterns for closing meta-commentary with adaptive confidence
  const closingPatterns = [
    { pattern: /^if\s+you\s+want/i, id: 'closing-0' },
    { pattern: /^let\s+me\s+know\s+if/i, id: 'closing-1' },
    { pattern: /^just\s+say\s+the\s+word/i, id: 'closing-2' },
    { pattern: /^i\s+can\s+(also\s+)?craft/i, id: 'closing-3' },
    { pattern: /^i\s+can\s+compress/i, id: 'closing-4' },
    { pattern: /^would\s+you\s+like/i, id: 'closing-5' },
    { pattern: /shorter.*?punchier.*?version/i, id: 'closing-6' },
    { pattern: /professional\s+corporate\s+energy/i, id: 'closing-7' },
    { pattern: /more\s+details.*?or\s+anything\s+else/i, id: 'closing-8' },
    { pattern: /i\s+can\s+(also\s+)?make\s+it\s+more/i, id: 'closing-9' },
    { pattern: /can\s+(also\s+)?make\s+it\s+more/i, id: 'closing-10' },
    { pattern: /make\s+it\s+more\s+(casual|formal|concise|punchy|professional)/i, id: 'closing-11' },
    { pattern: /if\s+you\s+want.*?(casual|formal|concise|punchy|professional)/i, id: 'closing-12' },
    { pattern: /i\s+can\s+(also\s+)?(make|change|reformat|adjust)/i, id: 'closing-13' },
    { pattern: /if\s+you\s+want.*?i\s+can\s+also\s+make\s+it/i, id: 'closing-14' },
    { pattern: /if\s+you\s+want.*?make\s+it\s+more/i, id: 'closing-15' },
  ];

  // Keywords that suggest meta-commentary
  const metaKeywords = [
    'version', 'draft', 'tightened', 'punchier', 'corporate', 'energy',
    'vibes', 'saga', 'digest', 'smoother', 'craft', 'compress',
    'casual', 'formal', 'concise', 'punchy', 'professional', 'reformat', 'adjust'
  ];

  // Check if a paragraph is likely meta-commentary
  const isMetaCommentary = (para: string, isIntro: boolean): boolean => {
    if (!para || para.length < 10) return false;

    // If paragraph contains newlines, check only the first line for meta-commentary
    // This prevents false positives when actual content follows meta-commentary
    const firstLine = para.split('\n')[0];
    const lowerPara = firstLine.toLowerCase();

    // Check patterns on first line only with adaptive confidence
    const patterns = isIntro ? introPatterns : closingPatterns;
    for (const patternObj of patterns) {
      const patternId = patternObj.id;
      
      // Skip disabled patterns
      if (learning.isPatternDisabled(patternId)) continue;
      
      // Check if pattern matches
      if (patternObj.pattern.test(firstLine)) {
        const confidence = learning.getPatternConfidence(patternId);
        // Only consider it meta-commentary if confidence is above threshold (0.3)
        if (confidence >= 0.3) {
          return true;
        }
      }
    }

    // Direct check for the specific closing phrase pattern
    if (!isIntro) {
      // Check for "If you want, I can also make it more [casual/formal/concise]"
      if (/if\s+you\s+want.*?i\s+can\s+also\s+make\s+it\s+more/i.test(firstLine)) {
        return true;
      }
      // Check for variations with "more" followed by style words
      if (/if\s+you\s+want.*?make\s+it\s+more\s+(casual|formal|concise|punchy|professional)/i.test(firstLine)) {
        return true;
      }
      // Check for "can also make it more"
      if (/can\s+also\s+make\s+it\s+more/i.test(firstLine)) {
        return true;
      }
    }

    // Check for meta keywords combined with certain phrases
    const hasMetaKeywords = metaKeywords.some(keyword => lowerPara.includes(keyword));
    if (hasMetaKeywords) {
      // Additional heuristics
      if (lowerPara.includes('here') || lowerPara.includes('if you') || lowerPara.includes('can also')) {
        return true;
      }
      // Check for closing phrases offering to reformat
      if (lowerPara.includes('if you want') && (lowerPara.includes('can') || lowerPara.includes('make'))) {
        return true;
      }
      if (lowerPara.includes('make it more') || lowerPara.includes('can make it')) {
        return true;
      }
      // Check if it's describing content rather than being content
      if (lowerPara.includes('your') && (lowerPara.includes('is') || lowerPara.includes('giving'))) {
        return true;
      }
    }

    return false;
  };

  // Find content boundaries using structure detection
  let contentStartIndex = 0;
  let contentEndIndex = paragraphs.length - 1;

  // Look for formal greetings or subject lines (content start markers)
  const contentStartMarkers = [
    /^subject:/i,
    /^(hi|hello|dear|greetings)\s+/i,
    /^thanks?\s+(for|you)/i,
    /^i'?ve\s+(added|included|provided)/i,
  ];

  // Look for signatures or closings (content end markers)
  const contentEndMarkers = [
    /^(best\s+)?regards?/i,
    /^thanks?\s+again/i,
    /^(sincerely|yours?)/i,
    /^(ceo|founder|president),?\s+[A-Z]/i,
  ];

  // Find actual content start
  for (let i = 0; i < Math.min(5, paragraphs.length); i++) {
    const firstLine = paragraphs[i].split('\n')[0];
    if (contentStartMarkers.some(marker => marker.test(firstLine))) {
      contentStartIndex = i;
      break;
    }
  }

  // Find actual content end
  for (let i = paragraphs.length - 1; i >= Math.max(paragraphs.length - 5, 0); i--) {
    const firstLine = paragraphs[i].split('\n')[0];
    if (contentEndMarkers.some(marker => marker.test(firstLine))) {
      contentEndIndex = i;
      break;
    }
  }

  // Remove introductory meta-commentary (before content start)
  let startRemoved = 0;
  for (let i = 0; i < contentStartIndex; i++) {
    if (isMetaCommentary(paragraphs[i], true)) {
      startRemoved++;
    } else {
      break;
    }
  }

  // Remove closing meta-commentary (after content end)
  let endRemoved = 0;
  for (let i = paragraphs.length - 1; i > contentEndIndex; i--) {
    if (isMetaCommentary(paragraphs[i], false)) {
      endRemoved++;
    } else {
      break;
    }
  }

  // If we found content boundaries, use them; otherwise use heuristic removal
  if (contentStartIndex > 0 || contentEndIndex < paragraphs.length - 1) {
    const result = paragraphs.slice(startRemoved, paragraphs.length - endRemoved);
    return result.join('\n').trim();
  } else {
    // Fallback: remove based on heuristics only
    const result: string[] = [];
    let inContent = false;

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      if (para === '') {
        result.push('');
        continue;
      }

      // Check if this looks like actual content (check first line only)
      const firstLine = para.split('\n')[0];
      if (contentStartMarkers.some(marker => marker.test(firstLine))) {
        inContent = true;
      }

      if (inContent) {
        result.push(para);
        if (contentEndMarkers.some(marker => marker.test(firstLine))) {
          // Stop after signature/closing
          break;
        }
      } else {
        // Before content - check if it's meta-commentary
        if (!isMetaCommentary(para, true)) {
          result.push(para);
          inContent = true;
        }
      }
    }

    // Remove closing meta-commentary from the end
    while (result.length > 0 && isMetaCommentary(result[result.length - 1], false)) {
      result.pop();
    }

    let finalText = result.join('\n').trim();
    
    // Final pass: Remove any remaining closing meta-commentary at the end
    // This catches cases where closing phrases appear after signatures
    const lines = finalText.split('\n');
    const cleanedLines: string[] = [];
    let removingClosing = true;
    
    // Process from the end backwards to find and remove closing meta-commentary
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (!trimmed) {
        // Empty line - only preserve if we're not in removal mode
        if (!removingClosing) {
          cleanedLines.unshift(line);
        }
        continue;
      }
      
      // Check if this line is closing meta-commentary
      // Also check if line contains the phrase even if it doesn't match exact patterns
      const isClosingPhrase = isMetaCommentary(trimmed, false) || 
        /if\s+you\s+want.*?(can\s+also\s+)?make\s+it\s+more/i.test(trimmed) ||
        /if\s+you\s+want.*?(casual|formal|concise)/i.test(trimmed) ||
        /i\s+can\s+also\s+make\s+it\s+more\s+(casual|formal|concise)/i.test(trimmed) ||
        /make\s+it\s+more\s+(casual|formal|concise|punchy|professional)/i.test(trimmed);
      
      if (removingClosing && isClosingPhrase) {
        continue; // Skip this closing meta-commentary line
      }
      
      // If we hit non-empty content that's NOT closing meta-commentary, stop removing
      if (removingClosing && !isClosingPhrase) {
        removingClosing = false;
      }
      
      // Preserve the line
      cleanedLines.unshift(line);
    }
    
    return cleanedLines.join('\n').trim();
  }
}

function replaceEmDashes(text: string, learning: LearningHooks): { text: string; replacements: EmDashReplacement[] } {
  if (!text || text.trim().length === 0) {
    return { text, replacements: [] };
  }

  const replacements: Array<{ original: string; replaced: string; context: 'sentence' | 'list' | 'parenthetical' | 'other'; position: number }> = [];
  let result = text;

  // Find all em dashes and their context
  const matches: Array<{ index: number; context: 'sentence' | 'list' | 'parenthetical' | 'other' }> = [];
  let match;
  const tempRegex = /—/g;
  
  while ((match = tempRegex.exec(text)) !== null) {
    const index = match.index;
    const before = text.substring(Math.max(0, index - 50), index);
    const after = text.substring(index + 1, Math.min(text.length, index + 51));
    const fullContext = before + '—' + after;
    
    // Determine context
    let context: 'sentence' | 'list' | 'parenthetical' | 'other' = 'sentence';
    
    // Check if it's in a list (starts with bullet, dash, number, etc.)
    const lineStart = text.lastIndexOf('\n', index) + 1;
    const lineBeforeDash = text.substring(lineStart, index).trim();
    if (/^[•\-\*\d]+\.?\s/.test(lineBeforeDash) || /^[-•*]\s/.test(text.substring(lineStart, index + 1))) {
      context = 'list';
    }
    // Check if it's parenthetical (surrounded by spaces, often used for asides)
    else if (/\s—\s/.test(fullContext) && (before.trim().endsWith(',') || after.trim().startsWith(','))) {
      context = 'parenthetical';
    }
    // Check if it's sentence-level (between words, not in lists)
    else if (/\w\s*—\s*\w/.test(fullContext)) {
      context = 'sentence';
    }
    else {
      context = 'other';
    }
    
    matches.push({ index, context });
  }

  // Replace em dashes based on context and learning system (process in reverse to maintain indices)
  for (let i = matches.length - 1; i >= 0; i--) {
    const { index, context } = matches[i];
    const patternId = `emdash-${context}-${i}`;
    
    // Check if this pattern is disabled by user
    const isDisabled = learning.learningData.userPreferences.disabledPatterns.includes(patternId);
    if (isDisabled) {
      // Skip replacement if pattern is disabled
      continue;
    }
    
    // Get confidence for this context type
    const contextPatterns = learning.learningData.patternPerformance.filter(
      p => p.type === 'emdash' && p.pattern.startsWith(`emdash-${context}-`)
    );
    const avgConfidence = contextPatterns.length > 0
      ? contextPatterns.reduce((sum, p) => sum + p.confidence, 0) / contextPatterns.length
      : 0.5;
    
    // Only replace if confidence is above threshold (0.3)
    if (avgConfidence < 0.3) {
      continue;
    }
    
    // Replace all em dashes with commas (simpler, more natural for AI-generated text)
    // Remove any spaces before the em dash to ensure no space before comma
    let spaceCount = 0;
    let checkIndex = index - 1;
    // Count consecutive spaces before the em dash
    while (checkIndex >= 0 && result[checkIndex] === ' ') {
      spaceCount++;
      checkIndex--;
    }
    
    const replacement = ',';
    const startIndex = index - spaceCount;
    
    replacements.unshift({
      original: text.substring(Math.max(0, startIndex - 20), Math.min(text.length, index + 21)),
      replaced: text.substring(Math.max(0, startIndex - 20), startIndex) + replacement + text.substring(index + 1, Math.min(text.length, index + 21)),
      context,
      position: startIndex
    });
    
    // Replace em dash and any spaces before it with just the comma
    result = result.substring(0, startIndex) + replacement + result.substring(index + 1);
  }

  return { text: result, replacements };
}

export function formatAiText(
  text: string,
  style: FormatStyleOptions,
  learning: LearningHooks
): { text: string; emDashReplacements: EmDashReplacement[] } {
  if (!text) return { text: '', emDashReplacements: [] };
  const { listStyle, numberedStyle, headerSpacing, spacingMode, preserveBold, preserveItalic, smartParagraphs, outputFormat } = style;
  let formatted = text;
  let emDashReplacements: EmDashReplacement[] = [];

  // Helper function to get list marker based on style
  const getListMarker = (): string => {
    switch (listStyle) {
      case 'dash': return '- ';
      case 'asterisk': return '* ';
      case 'bullet':
      default: return '• ';
    }
  };

  // Helper function to get numbered list marker based on style
  const getNumberedMarker = (num: number): string => {
    switch (numberedStyle) {
      case 'paren': return `${num}) `;
      case 'paren2': return `(${num}) `;
      case 'dot':
      default: return `${num}. `;
    }
  };

  // Helper function to determine if we should add blank line after header
  const shouldAddBlankLineAfterHeader = (nextIsListItem: boolean, nextIsParagraph: boolean = false): boolean => {
    switch (headerSpacing) {
      case 'always': return true;
      case 'never': return false;
      case 'smart':
      default: 
        // In smart mode, flow directly into both lists and paragraphs (no blank line)
        return !nextIsListItem && !nextIsParagraph;
    }
  };

  // Helper function to get number of blank lines between paragraphs based on spacing mode
  const getParagraphSpacing = (): number => {
    switch (spacingMode) {
      case 'compact': return 0; // No blank lines
      case 'spacious': return 2; // Two blank lines
      case 'standard':
      default: return 1; // One blank line
    }
  };

  // Remove meta-commentary first (before markdown processing)
  formatted = removeMetaCommentary(formatted, learning);
  
  // Replace em dashes with smart context-aware replacement
  const emDashResult = replaceEmDashes(formatted, learning);
  formatted = emDashResult.text;
  emDashReplacements = emDashResult.replacements;

  // Handle markdown headers (# ## ###) - convert to plain text with colon
  // Process line by line to detect signature sections
  const linesForHeader = formatted.split('\n');
  const headerProcessedLines: string[] = [];
  let inSignatureSection = false;
  
  for (let i = 0; i < linesForHeader.length; i++) {
    const line = linesForHeader[i];
    const trimmed = line.trim();
    
    // Check if this line is a signature closing (Best regards, Sincerely, etc.)
    if (/^(best\s+)?regards?[,:]?$/i.test(trimmed) || /^(sincerely|yours?)[,:]?$/i.test(trimmed)) {
      inSignatureSection = true;
      headerProcessedLines.push(line.replace(/^#{1,6}\s+(.+)$/, '$1')); // Remove markdown header markers if present
      continue;
    }
    
    // Check if we're past the signature section (empty line after signature usually means we're done)
    if (inSignatureSection && trimmed === '') {
      inSignatureSection = false;
      headerProcessedLines.push(line);
      continue;
    }
    
    // Process markdown headers
    const headerMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headerMatch) {
      const headerText = headerMatch[1].trim();
      // Don't add colon to signature lines or lines in signature section
      if (headerText && !/[.:!?]$/.test(headerText) && !inSignatureSection) {
        headerProcessedLines.push(headerText + ':');
      } else {
        headerProcessedLines.push(headerText);
      }
    } else {
      // Regular line - if in signature section, don't add colon even if it looks like a header
      if (inSignatureSection && trimmed && !/[.:!?]$/.test(trimmed)) {
        // Keep as is - don't add colon to signature names
        headerProcessedLines.push(line);
      } else {
        headerProcessedLines.push(line);
      }
    }
  }
  
  formatted = headerProcessedLines.join('\n');

  // Handle bold-only lines (standalone headers like **Title**) - MUST be before general bold removal
  // Process line by line to detect signature sections
  const linesForBoldHeader = formatted.split('\n');
  const boldHeaderProcessedLines: string[] = [];
  let inSignatureSectionBold = false;
  
  for (let i = 0; i < linesForBoldHeader.length; i++) {
    const line = linesForBoldHeader[i];
    const trimmed = line.trim();
    
    // Check if this line is a signature closing
    if (/^(best\s+)?regards?[,:]?$/i.test(trimmed) || /^(sincerely|yours?)[,:]?$/i.test(trimmed)) {
      inSignatureSectionBold = true;
      // Remove bold markers if present
      const boldMatch = line.match(/^\s*\*\*([^*\n]+?)\*\*\s*$/);
      if (boldMatch) {
        boldHeaderProcessedLines.push(boldMatch[1].trim());
      } else {
        boldHeaderProcessedLines.push(line);
      }
      continue;
    }
    
    // Check if we're past the signature section
    if (inSignatureSectionBold && trimmed === '') {
      inSignatureSectionBold = false;
      boldHeaderProcessedLines.push(line);
      continue;
    }
    
    // Process bold headers
    const boldMatch = line.match(/^\s*\*\*([^*\n]+?)\*\*\s*$/);
    if (boldMatch) {
      const headerText = boldMatch[1].trim();
      // Check if this is likely a header (short, ends with colon context, or followed by content)
      // Don't treat as header if it's long (likely content) or contains parentheses (likely a value/name)
      const isLikelyHeader = headerText.length < 60 && 
                             !headerText.includes('(') && 
                             !headerText.includes(')') &&
                             !headerText.includes('trading as');
      
      // Don't add colon to signature lines or content that's not a header
      if (headerText && !/[.:!?]$/.test(headerText) && !inSignatureSectionBold && isLikelyHeader) {
        boldHeaderProcessedLines.push(headerText + ':');
      } else {
        boldHeaderProcessedLines.push(headerText);
      }
    } else {
      // Regular line - if in signature section, don't add colon
      if (inSignatureSectionBold && trimmed && !/[.:!?]$/.test(trimmed) && !trimmed.includes('**')) {
        boldHeaderProcessedLines.push(line);
      } else {
        boldHeaderProcessedLines.push(line);
      }
    }
  }
  
  formatted = boldHeaderProcessedLines.join('\n');
  
  // Also handle bold headers at the START of a line (even if followed by text on same line)
  // Pattern: line starts, optional whitespace, **, content, **, followed by text
  // We need to process this line by line to check the previous line
  const linesBeforeHeaderFix = formatted.split('\n');
  const linesAfterHeaderFix: string[] = [];
  
  for (let i = 0; i < linesBeforeHeaderFix.length; i++) {
    const line = linesBeforeHeaderFix[i];
    const prevLine = i > 0 ? linesBeforeHeaderFix[i - 1] : '';
    const prevLineTrimmed = prevLine.trim();
    const prevLineIsEmpty = !prevLineTrimmed;
    
    // Check if this line starts with a bold header followed by text
    const headerMatch = line.match(/^(\s*)\*\*([^*\n]+?)\*\*\s+(.+)$/);
    if (headerMatch) {
      const [, _leadingSpace, headerText, followingText] = headerMatch;
      const trimmed = headerText.trim();
      // Add colon if header doesn't end with punctuation
      const headerWithColon = trimmed && !/[.:!?]$/.test(trimmed) ? trimmed + ':' : trimmed;
      
      // Check if the last processed line is empty - if so, we already have the break
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _lastProcessedIsEmpty = linesAfterHeaderFix.length > 0 && !linesAfterHeaderFix[linesAfterHeaderFix.length - 1].trim();
      
      // Remove any trailing empty lines to avoid double spacing, but we'll add exactly one back
      while (linesAfterHeaderFix.length > 0 && !linesAfterHeaderFix[linesAfterHeaderFix.length - 1].trim()) {
        linesAfterHeaderFix.pop();
      }
      
      // Add exactly one empty line before header if previous line had content
      // This ensures the header is separated from the previous paragraph
      if (!prevLineIsEmpty && !prevLineTrimmed.endsWith(':')) {
        linesAfterHeaderFix.push(''); // Add empty line before header to separate from previous paragraph
      }
      
      // Add header with colon, then empty line, then the following text
      // This ensures the header is grouped with its following paragraph, not the previous one
      linesAfterHeaderFix.push(headerWithColon); // Header on its own line
      linesAfterHeaderFix.push(''); // Empty line after header
      linesAfterHeaderFix.push(followingText.trim()); // Following text (the relevant paragraph)
    } else {
      linesAfterHeaderFix.push(line);
    }
  }
  
  formatted = linesAfterHeaderFix.join('\n');
  
  // Convert lists FIRST (before removing italic, which uses * and might interfere)
  // Convert bullet lists: "- Item" or "* Item" -> "• Item" (preserve line breaks)
  // IMPORTANT: Only convert lines that START with list markers, not inline * characters
  const linesForListConversion = formatted.split('\n');
  const convertedLines: string[] = [];
  
  for (const line of linesForListConversion) {
    // Only convert lines that START with a list item marker (at beginning or after whitespace)
    // Pattern: start of line, optional whitespace, then "* ", "- ", or "+ " followed by content
    // This ensures we don't convert inline * characters that are part of italic formatting
    if (/^\s*[\*\-\+]\s+(.+)$/.test(line)) {
      // This is a list item - convert it
      const match = line.match(/^\s*([\*\-\+]\s+)(.+)$/);
      if (match) {
        const leadingWhitespace = line.match(/^(\s*)/)?.[1] || '';
        const content = match[2].trim();
        
        // Check if this line contains merged list items separated by " * " pattern
        // This handles cases like: "* Item 1 * Item 2 * Item 3"
        if (/\s+\*\s+/.test(content)) {
          // Split on " * " to get individual items
          const parts = content.split(/\s+\*\s+/);
          parts.forEach((part, index) => {
            const trimmedPart = part.trim();
            if (trimmedPart) {
              // First item uses the original leading whitespace, others use same indentation
              const marker = getListMarker();
              if (index === 0) {
                convertedLines.push(leadingWhitespace + marker + trimmedPart);
              } else {
                convertedLines.push(leadingWhitespace + marker + trimmedPart);
              }
            }
          });
        } else {
          // Single item, just convert the marker
          convertedLines.push(leadingWhitespace + getListMarker() + content);
        }
      } else {
        convertedLines.push(line);
      }
    } else {
      // Check if line contains merged list items separated by * markers
      // This handles lines that don't start with a list marker but have merged items
      // Also handles lines that already have • but still contain * separators
      const lineTrimmed = line.trim();
      
      // Check if line contains " * " pattern (merged items with * separator)
      // OR if line starts with • but also has * separators later
      if (/\s+\*\s+/.test(lineTrimmed)) {
        const items: string[] = [];
        
        // Split the entire line on " * " pattern
        const parts = lineTrimmed.split(/\s+\*\s+/);
        
        parts.forEach((part, index) => {
          const trimmedPart = part.trim();
          if (trimmedPart) {
            const marker = getListMarker();
            // If this is the first part and it starts with a list marker, keep it as is
            if (index === 0 && /^[•\-\*]\s+/.test(trimmedPart)) {
              items.push(trimmedPart);
            } else {
              // Remove any leading list marker if present (shouldn't happen, but be safe)
              const cleanPart = trimmedPart.replace(/^[•\-\*]\s+/, '');
              // Otherwise, add marker prefix
              items.push(marker + cleanPart);
            }
          }
        });
        
        // If we successfully split into multiple items, use them
        if (items.length > 1) {
          items.forEach(item => {
            convertedLines.push(item);
          });
        } else {
          convertedLines.push(line);
        }
      } else {
        // No merged items - keep line as is
        convertedLines.push(line);
      }
    }
  }
  
  formatted = convertedLines.join('\n');
  
  // Clean up any remaining stray * markers in list items (from merged items that were split)
  // This handles cases where list items still contain * characters used as separators
  const linesForCleanup = formatted.split('\n');
  formatted = linesForCleanup.map(line => {
    // If line starts with • (list item), clean up any remaining * separators
    if (/^•\s/.test(line)) {
      // Remove any standalone * characters that appear after the bullet (used as separators)
      // Pattern: bullet, content, then " * " or " *" at end
      return line.replace(/\s+\*\s+/g, ' ').replace(/\s+\*$/g, '').replace(/^\s*\*\s+/g, '');
    }
    return line;
  }).join('\n');
  
  // Remove or preserve markdown bold (**text** or __text__) based on option
  if (!preserveBold) {
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '$1');
  formatted = formatted.replace(/__(.+?)__/g, '$1');
  } else {
    // Preserve bold but convert to consistent format
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '**$1**');
    formatted = formatted.replace(/__(.+?)__/g, '**$1**');
  }

  // Remove or preserve markdown italic (*text* or _text_) based on option
  // Process line by line to avoid matching list markers
  const linesForItalic = formatted.split('\n');
  formatted = linesForItalic.map(line => {
    // Check if line starts with a list marker (any style)
    const isListItem = /^[•\-\*]\s/.test(line);
    
    if (isListItem) {
      if (preserveItalic) {
        // Preserve italic but clean up separators
        return line.replace(/\s+\*\s+/g, ' ').replace(/\s+\*$/g, '').replace(/^\s*\*\s+/g, '');
      } else {
        // Remove italic formatting (*text*) but preserve the content
        return line.replace(/\*([^*\n]+?)\*/g, '$1').replace(/_([^_\n]+?)_/g, '$1');
    }
    } else {
      if (preserveItalic) {
        // Preserve italic but convert to consistent format
        return line.replace(/\*([^*\n]+?)\*/g, '*$1*').replace(/_([^_\n]+?)_/g, '*$1*');
      } else {
        // Remove italic markers
    return line.replace(/\*(.+?)\*/g, '$1').replace(/_(.+?)_/g, '$1');
      }
    }
  }).join('\n');

  // Remove markdown links ([text](url) -> text)
  formatted = formatted.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Handle numbered lists: split merged items and ensure proper formatting
  // First, split lines that contain multiple numbered list items on the same line
  const linesForNumberedList = formatted.split('\n');
  const splitNumberedLines: string[] = [];
  
  for (const line of linesForNumberedList) {
    // Check if line contains multiple numbered list items (pattern: "number. text number. text")
    // Find all positions where "number. " appears (where number is 1-2 digits typically)
    // Split on these boundaries
    const numberedItemPattern = /\d+\.\s+/g;
    const matches = Array.from(line.matchAll(numberedItemPattern));
    
    if (matches.length > 1) {
      // Line contains multiple numbered items - split them
      let lastIndex = 0;
      matches.forEach((match, index) => {
        const startPos = match.index!;
        // Get the end position (start of next match, or end of line)
        const endPos = index < matches.length - 1 ? matches[index + 1].index! : line.length;
        const item = line.substring(startPos, endPos).trim();
        if (item) {
          splitNumberedLines.push(item);
        }
        lastIndex = endPos;
      });
    } else {
      // Single item or no numbered list - keep line as is
      splitNumberedLines.push(line);
    }
  }
  
  formatted = splitNumberedLines.join('\n');
  
  // Convert numbered lists to use selected style
  // Match patterns: "1. Item", "1) Item", "(1) Item"
  formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, (match, num, content) => {
    return getNumberedMarker(parseInt(num)) + content.trim();
  });
  formatted = formatted.replace(/^(\d+)\)\s+(.+)$/gm, (match, num, content) => {
    return getNumberedMarker(parseInt(num)) + content.trim();
  });
  formatted = formatted.replace(/^\((\d+)\)\s+(.+)$/gm, (match, num, content) => {
    return getNumberedMarker(parseInt(num)) + content.trim();
  });
  
  // Ensure list items are on separate lines - don't merge them
  // This prevents list items from running together
  // After conversion, list items should still be on separate lines

  // Remove code blocks (``` or `)
  formatted = formatted.replace(/```[\s\S]*?```/g, '');
  formatted = formatted.replace(/`(.+?)`/g, '$1');

  // Remove blockquotes (>)
  formatted = formatted.replace(/^>\s+/gm, '');

  // Remove horizontal rules (--- or ***)
  formatted = formatted.replace(/^[\-\*]{3,}$/gm, '');

  // Better paragraph handling - preserve intentional line breaks
  // Clean up excessive line breaks (more than 2 consecutive) - but do this AFTER header processing
  // We'll clean this up at the end instead
  
  // Preserve paragraph structure - trim lines but keep empty lines between paragraphs
  // Split into lines, process each line while preserving structure
  const lines = formatted.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const trimmed = originalLine.trim();
    const isEmpty = trimmed === '';
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    const isNextEmpty = nextLine === '';
    const prevLine = processedLines.length > 0 ? processedLines[processedLines.length - 1] : '';
    
    // Check if previous line is a signature closing (Best regards, etc.)
    const prevIsSignatureClosing = prevLine && /^(best\s+)?regards?[,:]?$/i.test(prevLine) || /^(sincerely|yours?)[,:]?$/i.test(prevLine);
    
    // If current line is empty, preserve it if it's between non-empty lines
    if (isEmpty) {
      // Don't preserve empty line between signature closing and name
      if (prevIsSignatureClosing && nextLine && !/^[•\-\*\d]\.?\s/.test(nextLine)) {
        continue; // Skip empty line to keep signature closing and name together
      }
      // Check if the last processed line is already empty - if so, skip to avoid double spacing
      const lastWasEmpty = processedLines.length > 0 && !processedLines[processedLines.length - 1].trim();
      if (lastWasEmpty) {
        continue; // Skip duplicate empty lines - ensure only one blank line between paragraphs
      }
      
      // Check if previous or next line is a list item (support all list marker styles)
      const prevIsListItem = prevLine && /^[•\-\*\d]\.?\s/.test(prevLine);
      
      // Find the next non-empty line to check if it's a list item
      let nextNonEmptyLine = '';
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim()) {
          nextNonEmptyLine = lines[j].trim();
          break;
        }
      }
      const nextIsListItem = !!(nextNonEmptyLine && /^[•\-\*\d]\.?\s/.test(nextNonEmptyLine));
      
      // Don't preserve empty lines between consecutive list items
      if (prevIsListItem && nextIsListItem) {
        // Skip this empty line - list items should be directly adjacent
        continue;
      }
      
      // Keep empty line if previous line exists and next line is not empty
      // But check headerSpacing option for headers
      const prevIsHeader = prevLine && /:$/.test(prevLine);
      
      // Check if next non-empty line is a paragraph (not a header, not a list item)
      const nextIsParagraph = !!(nextNonEmptyLine && !/:$/.test(nextNonEmptyLine) && !/^[•\-\*\d]\.?\s/.test(nextNonEmptyLine));
      
      // Skip empty line if it's between a header and a list item or paragraph (based on headerSpacing)
      if (prevIsHeader && (nextIsListItem || nextIsParagraph)) {
        const shouldPreserve = shouldAddBlankLineAfterHeader(nextIsListItem, nextIsParagraph);
        if (!shouldPreserve) {
          continue; // Don't preserve this empty line - header should flow directly into content
        }
      }
      
      // Apply spacing mode for paragraph spacing
      // But don't add spacing if previous line is a header that should flow into content
      const paragraphSpacingCount = getParagraphSpacing();
      if (prevLine && (!isNextEmpty || prevIsHeader)) {
        // Only add spacing if header spacing allows it
        if (prevIsHeader) {
          const shouldAddHeaderSpacing = shouldAddBlankLineAfterHeader(nextIsListItem, nextIsParagraph);
          if (!shouldAddHeaderSpacing) {
            continue; // Don't add blank line - header flows directly into content
          }
        }
        // Add appropriate number of blank lines based on spacing mode
        for (let s = 0; s < paragraphSpacingCount; s++) {
        processedLines.push('');
        }
      }
      continue;
    }
    
    // If line ends with colon (header), check if we need to add a break before and after it
    if (trimmed && /:$/.test(trimmed)) {
      // Check if this is a signature closing - don't treat it as a regular header
      const isSignatureClosing = /^(best\s+)?regards?[,:]?$/i.test(trimmed) || /^(sincerely|yours?)[,:]?$/i.test(trimmed);
      
      if (!isSignatureClosing) {
        // Add blank line before header if previous line exists and is not empty and not already a header
        const prevIsHeader = prevLine && /:$/.test(prevLine);
        const prevIsEmpty = !prevLine || !prevLine.trim();
        if (!prevIsEmpty && !prevIsHeader && processedLines.length > 0) {
          // Check if last processed line is already empty
          const lastWasEmpty = processedLines.length > 0 && !processedLines[processedLines.length - 1].trim();
          if (!lastWasEmpty) {
            processedLines.push(''); // Add blank line before header
          }
        }
      }
      processedLines.push(trimmed);
      // Check if next line in original is empty - if so, we'll preserve it next iteration
      // If next line is not empty, check if we already have an empty line
      const nextOriginalLine = i < lines.length - 1 ? lines[i + 1] : '';
      const nextOriginalIsEmpty = !nextOriginalLine || !nextOriginalLine.trim();
      const lastWasEmpty = processedLines.length > 0 && !processedLines[processedLines.length - 1].trim();
      
      // Check if next line is a list item or paragraph
      const nextIsListItem = nextOriginalLine && /^[•\-\*\d]\.?\s/.test(nextOriginalLine.trim());
      const nextIsParagraph = nextOriginalLine && !nextIsListItem && !/:$/.test(nextOriginalLine.trim());
      
      // If next line is empty, check if the line after that is a list item or paragraph
      let nextNonEmptyIsListItem = false;
      let nextNonEmptyIsParagraph = false;
      if (nextOriginalIsEmpty) {
        // Look ahead to find the next non-empty line
        for (let j = i + 2; j < lines.length; j++) {
          const futureLine = lines[j].trim();
          if (futureLine) {
            if (/^[•\-\*\d]\.?\s/.test(futureLine)) {
              nextNonEmptyIsListItem = true; // Next content is a list item
            } else if (!/:$/.test(futureLine)) {
              nextNonEmptyIsParagraph = true; // Next content is a paragraph
            }
            break;
          }
        }
      }
      
      // Use headerSpacing option to determine if we should add blank line
      const shouldAddBlank = shouldAddBlankLineAfterHeader(
        nextIsListItem || nextNonEmptyIsListItem,
        nextIsParagraph || nextNonEmptyIsParagraph
      );
      
      if (shouldAddBlank && !nextOriginalIsEmpty && !lastWasEmpty) {
        // Next line has content and we should add blank line, so add one
        processedLines.push('');
      } else if (nextOriginalIsEmpty && !shouldAddBlank && (nextNonEmptyIsListItem || nextNonEmptyIsParagraph)) {
        // Next line is empty but the content after it is a list item or paragraph, and we don't want blank line
        // Skip preserving it - we'll continue and the empty line won't be added
      } else if (nextOriginalIsEmpty && shouldAddBlank && !nextNonEmptyIsListItem && !nextNonEmptyIsParagraph) {
        // Next line is empty and we want blank line, it will be preserved in next iteration
      }
      // If next line is already empty and not skipped, it will be preserved in the next iteration (but only once)
      continue;
    }
    
    // Check if this is a list item (starts with bullet or number)
    const isListItem = /^[•\-\*\d]\.?\s/.test(trimmed);
    const prevIsListItem = prevLine && /^[•\-\*\d]\.?\s/.test(prevLine);
    
    // If this is a list item, ensure it's on its own line (it already is, just preserve it)
    if (isListItem) {
      // Always push list items - they should be on separate lines
      // If previous line was also a list item and there was an empty line between them in the original,
      // we should preserve that (it would have been handled in the empty line check above)
      processedLines.push(trimmed);
      // List items should remain on separate lines - don't merge them
      continue;
    }
    
    // If this line follows a signature closing, it's likely a name - don't modify it
    if (prevIsSignatureClosing && trimmed && !/[.:!?]$/.test(trimmed) && !isListItem) {
      // This is likely a signature name - keep it as is, don't add colon
      processedLines.push(trimmed);
      continue;
    }
    
    processedLines.push(trimmed);
  }
  
  formatted = processedLines.join('\n');
  
  // Cleanup: remove any double blank lines (3+ newlines) that may have been created
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Remove empty lines between consecutive list items (support all marker styles)
  // Pattern: list item, newline, empty line(s), newline, list item
  formatted = formatted.replace(/([•\-\*\d]\.?\s[^\n]+)\n\n+([•\-\*\d]\.?\s[^\n]+)/g, '$1\n$2');
  
  // Final cleanup: remove excessive line breaks (more than 1 consecutive)
  // This ensures we don't have more than 1 blank line (2 newlines) between paragraphs
  // Reduce any sequence of 3+ newlines to exactly 2 newlines (one blank line)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Add spacing between list items and paragraphs (but preserve list item line breaks)
  // Only add spacing before first list item (between paragraph and list)
  formatted = formatted.replace(/([^\n•\-\*\d])\n([•\-\*\d])/g, '$1\n\n$2');
  // Add spacing after last list item (between list and paragraph)
  formatted = formatted.replace(/([•\-\*\d].+)\n([^\n•\-\*\d])/g, '$1\n\n$2');
  // Don't add spacing between consecutive list items - they should stay on separate lines
  
  // Cleanup: remove any double blank lines created by list spacing
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Final cleanup: remove empty lines between consecutive list items
  // Process line by line to reliably remove empty lines between list items
  const finalLines = formatted.split('\n');
  const cleanedLines: string[] = [];
  
  // Helper function to find the previous non-empty line in cleanedLines
  const getPreviousNonEmptyLine = (): string => {
    for (let j = cleanedLines.length - 1; j >= 0; j--) {
      if (cleanedLines[j].trim()) {
        return cleanedLines[j];
      }
    }
    return '';
  };
  
  for (let i = 0; i < finalLines.length; i++) {
    const currentLine = finalLines[i];
    const nextLine = i < finalLines.length - 1 ? finalLines[i + 1] : '';
    const isEmpty = !currentLine.trim();
    
    if (isEmpty) {
      // Find the previous non-empty line (might be in cleanedLines)
      const prevNonEmptyLine = getPreviousNonEmptyLine();
      const prevIsListItem = prevNonEmptyLine && /^[•\-\*\d]\.?\s/.test(prevNonEmptyLine.trim());
      
      // Find the next non-empty line (might be ahead in finalLines)
      let nextNonEmptyLine = '';
      for (let j = i + 1; j < finalLines.length; j++) {
        if (finalLines[j].trim()) {
          nextNonEmptyLine = finalLines[j];
          break;
        }
      }
      const nextIsListItem = nextNonEmptyLine && /^[•\-\*\d]\.?\s/.test(nextNonEmptyLine.trim());
      
      // Skip empty lines that are between two list items
      if (prevIsListItem && nextIsListItem) {
        continue; // Don't add this empty line
      }
    }
    
    cleanedLines.push(currentLine);
  }
  
  formatted = cleanedLines.join('\n');

  // Remove empty lines between headers and their content (lists or paragraphs) in smart mode
  // Use regex to directly remove empty lines that come after headers
  if (headerSpacing === 'smart') {
    // Pattern: header ending with colon, followed by one or more empty lines, followed by content
    // Remove empty lines between header and list items
    formatted = formatted.replace(/^(.+:\s*)\n(\n+)([•\-\*\d]\.?\s)/gm, '$1\n$3');
    // Remove empty lines between header and paragraphs (non-header, non-list content)
    formatted = formatted.replace(/^(.+:\s*)\n(\n+)([^•\-\*\d\n:].+)$/gm, '$1\n$3');
    // Also handle cases with just one empty line
    formatted = formatted.replace(/^(.+:\s*)\n\n([•\-\*\d]\.?\s)/gm, '$1\n$2');
    formatted = formatted.replace(/^(.+:\s*)\n\n([^•\-\*\d\n:].+)$/gm, '$1\n$2');
  }

  // Final pass: ensure only one blank line (2 newlines) between any paragraphs
  // This reduces any sequence of 3+ newlines to exactly 2 newlines (one blank line)
  // Run multiple times to catch all cases and ensure we never have more than 2 consecutive newlines
  let prevFormatted = '';
  let iterations = 0;
  while (formatted !== prevFormatted && iterations < 10) {
    prevFormatted = formatted;
    // Reduce any sequence of 3+ newlines to exactly 2 newlines (one blank line)
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    iterations++;
  }

  // Smart paragraph detection (if enabled)
  if (smartParagraphs) {
    const lines = formatted.split('\n');
    const smartLines: string[] = [];
    let currentParagraph: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const isEmpty = !line;
      const isListItem = /^[•\-\*\d]\.?\s/.test(line);
      const isHeader = /:$/.test(line);
      const isShortLine = line.length < 80 && !isEmpty && !isListItem && !isHeader;
      
      if (isEmpty) {
        // If we have accumulated a paragraph, join it
        if (currentParagraph.length > 0) {
          smartLines.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        smartLines.push('');
      } else if (isListItem || isHeader) {
        // If we have accumulated a paragraph, join it first
        if (currentParagraph.length > 0) {
          smartLines.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        smartLines.push(line);
      } else if (isShortLine && i < lines.length - 1 && lines[i + 1].trim() && !/^[•\-\*\d]\.?\s/.test(lines[i + 1].trim())) {
        // Short line that might be part of a paragraph - accumulate it
        currentParagraph.push(line);
      } else {
        // Regular line - if we have accumulated paragraph, join it first
        if (currentParagraph.length > 0) {
          smartLines.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        smartLines.push(line);
      }
    }
    
    // Join any remaining accumulated paragraph
    if (currentParagraph.length > 0) {
      smartLines.push(currentParagraph.join(' '));
    }
    
    formatted = smartLines.join('\n');
  }

  // Convert to selected output format
  if (outputFormat === 'markdown') {
    // Convert to markdown format
    const mdLines = formatted.split('\n');
    const mdFormatted: string[] = [];
    
    for (const line of mdLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        mdFormatted.push('');
        continue;
      }
      
      // Check if it's a header
      if (/:$/.test(trimmed)) {
        mdFormatted.push(`## ${trimmed.replace(':', '')}`);
        continue;
      }
      
      // Check if it's a list item
      const listMatch = trimmed.match(/^([•\-\*]|\d+[\.\)])\s+(.+)$/);
      if (listMatch) {
        const marker = listMatch[1];
        const content = listMatch[2];
        if (/^[•\-\*]/.test(marker)) {
          mdFormatted.push(`- ${content}`);
        } else {
          mdFormatted.push(`${marker} ${content}`);
        }
        continue;
      }
      
      // Regular paragraph
      mdFormatted.push(trimmed);
    }
    
    formatted = mdFormatted.join('\n');
  } else if (outputFormat === 'html') {
    // Convert to HTML format
    const htmlLines = formatted.split('\n');
    const htmlFormatted: string[] = [];
    
    for (let i = 0; i < htmlLines.length; i++) {
      const line = htmlLines[i].trim();
      const prevLine = i > 0 ? htmlLines[i - 1].trim() : '';
      const nextLine = i < htmlLines.length - 1 ? htmlLines[i + 1].trim() : '';
      
      if (!line) {
        if (prevLine && nextLine) {
          htmlFormatted.push('</p><p>');
        }
        continue;
      }
      
      // Check if it's a header
      if (/:$/.test(line)) {
        if (prevLine) htmlFormatted.push('</p>');
        htmlFormatted.push(`<h2>${line.replace(':', '')}</h2>`);
        if (nextLine && !/^[•\-\*\d]\.?\s/.test(nextLine)) {
          htmlFormatted.push('<p>');
        }
        continue;
      }
      
      // Check if it's a list item
      const listMatch = line.match(/^([•\-\*]|\d+[\.\)])\s+(.+)$/);
      if (listMatch) {
        const marker = listMatch[1];
        const content = listMatch[2];
        const isNumbered = /^\d+/.test(marker);
        
        if (isNumbered) {
          if (!prevLine || !/^\d+[\.\)]\s/.test(prevLine)) {
            htmlFormatted.push('<ol>');
          }
          htmlFormatted.push(`  <li>${content}</li>`);
          if (!nextLine || !/^\d+[\.\)]\s/.test(nextLine)) {
            htmlFormatted.push('</ol>');
          }
        } else {
          if (!prevLine || !/^[•\-\*]\s/.test(prevLine)) {
            htmlFormatted.push('<ul>');
          }
          htmlFormatted.push(`  <li>${content}</li>`);
          if (!nextLine || !/^[•\-\*]\s/.test(nextLine)) {
            htmlFormatted.push('</ul>');
          }
        }
        continue;
      }
      
      // Regular paragraph
      if (!prevLine || /:$/.test(prevLine) || /^[•\-\*\d]\.?\s/.test(prevLine)) {
        htmlFormatted.push('<p>');
      }
      htmlFormatted.push(line);
      if (!nextLine || /:$/.test(nextLine) || /^[•\-\*\d]\.?\s/.test(nextLine)) {
        htmlFormatted.push('</p>');
      }
    }
    
    formatted = htmlFormatted.join('\n');
  }

  // Trim whitespace
  formatted = formatted.trim();
  
  // Final cleanup: Remove any remaining closing meta-commentary at the very end
  const finalCleanupLines = formatted.split('\n');
  const finalCleanedLines: string[] = [];
  let removingClosing = true;
  
  // Process from the end backwards to remove closing meta-commentary
  for (let i = finalCleanupLines.length - 1; i >= 0; i--) {
    const line = finalCleanupLines[i];
    const trimmed = line.trim();
    
    if (!trimmed) {
      // If we're removing closing meta-commentary, skip empty lines
      if (removingClosing) {
        continue;
      }
      finalCleanedLines.unshift(line);
      continue;
    }
    
    // Check if this is closing meta-commentary - use comprehensive pattern matching
    const isClosing = 
      /if\s+you\s+want.*?i\s+can\s+also\s+make\s+it\s+more/i.test(trimmed) ||
      /if\s+you\s+want.*?make\s+it\s+more/i.test(trimmed) ||
      /i\s+can\s+also\s+make\s+it\s+more/i.test(trimmed) ||
      /make\s+it\s+more\s+(casual|formal|concise)/i.test(trimmed) ||
      /if\s+you\s+want.*?(casual|formal|concise)/i.test(trimmed) ||
      /can\s+also\s+make\s+it\s+more/i.test(trimmed);
    
    // If we're removing and this is closing meta-commentary, skip it
    if (removingClosing && isClosing) {
      continue; // Skip this closing meta-commentary line
    }
    
    // If we hit non-closing content, stop removing
    if (removingClosing && !isClosing) {
      removingClosing = false;
    }
    
    finalCleanedLines.unshift(line);
  }
  
  formatted = finalCleanedLines.join('\n').trim();

  return { text: formatted, emDashReplacements };
}
