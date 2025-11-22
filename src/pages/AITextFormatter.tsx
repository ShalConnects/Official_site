import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Copy, Check, Wand2, Sparkles, Type, Eye, FileText, Minus, Plus, RotateCcw, Minimize2, Search, Replace, Undo2, Redo2, CaseSensitive, CaseLower, CaseUpper, X, ChevronUp, ChevronDown, Regex, Bold, Italic, Underline, Strikethrough } from 'lucide-react';

type DisplayMode = 'plain' | 'formatted' | 'rich';

interface HistoryEntry {
  input: string;
  output: string;
  timestamp: number;
}

interface FormattingConfig {
  displayMode: DisplayMode;
  fontSize: number;
  lineHeight: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  paragraphSpacing: number;
}

export default function AITextFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [, setCopied] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [, setAiConfidence] = useState(0);
  const [, setAiPatterns] = useState<string[]>([]);

  // Helper function to escape HTML
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'formatting' | 'success' | 'copied'>('formatting');
  const [, setNotificationMessage] = useState('');
  
  // Formatting options
  const [displayMode, setDisplayMode] = useState<DisplayMode>('plain');
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [paragraphSpacing, setParagraphSpacing] = useState(1);
  const [showFormattingControls, setShowFormattingControls] = useState(false);

  // New features state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [, _setShowSideBySide] = useState(false);
  const [showDiff, _setShowDiff] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matchIndex, setMatchIndex] = useState(-1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [matchPositions, setMatchPositions] = useState<Array<{start: number; end: number}>>([]);
  const [savedConfigs, setSavedConfigs] = useState<Array<{name: string; config: FormattingConfig}>>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Performance: Debounce refs
  const formatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyIndexRef = useRef(-1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const detectAIText = (text: string): { detected: boolean; confidence: number; patterns: string[] } => {
    if (!text) return { detected: false, confidence: 0, patterns: [] };
    
    const detectedPatterns: string[] = [];
    let score = 0;
    
    // Check for common AI markdown patterns
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

    // Check for AI-specific phrases
    const aiPhrases = [
      /here'?s\s+(a|the|your)/i,
      /let\s+me\s+(help|explain|show)/i,
      /i'?d\s+(be\s+)?happy\s+to/i,
      /feel\s+free\s+to/i,
      /don'?t\s+hesitate/i,
    ];

    aiPatterns.forEach(({ pattern, name, weight }) => {
      if (pattern.test(text)) {
        detectedPatterns.push(name);
        score += weight;
      }
    });

    aiPhrases.forEach(phrase => {
      if (phrase.test(text)) {
        detectedPatterns.push('AI phrases');
        score += 2;
      }
    });

    // Calculate confidence (0-100)
    const confidence = Math.min(100, Math.round((score / 20) * 100));
    const detected = score >= 3; // Threshold for detection

    return { detected, confidence, patterns: [...new Set(detectedPatterns)] };
  };

  // Templates
  const templates = [
    {
      name: 'Email',
      description: 'Format for email messages',
      config: { fontSize: 14, lineHeight: 1.6, paragraphSpacing: 1.2, displayMode: 'formatted' as DisplayMode, wordWrap: true, showLineNumbers: false },
    },
    {
      name: 'Blog Post',
      description: 'Format for blog articles',
      config: { fontSize: 16, lineHeight: 1.8, paragraphSpacing: 1.5, displayMode: 'formatted' as DisplayMode, wordWrap: true, showLineNumbers: false },
    },
    {
      name: 'Social Media',
      description: 'Format for social posts',
      config: { fontSize: 14, lineHeight: 1.5, paragraphSpacing: 0.8, displayMode: 'plain' as DisplayMode, wordWrap: true, showLineNumbers: false },
    },
    {
      name: 'Code Documentation',
      description: 'Format for code docs',
      config: { fontSize: 13, lineHeight: 1.6, paragraphSpacing: 1, displayMode: 'plain' as DisplayMode, wordWrap: false, showLineNumbers: true },
    },
  ];

  const removeMetaCommentary = (text: string): string => {
    if (!text || text.trim().length === 0) return text;

    const lines = text.split('\n');
    const paragraphs: string[] = [];
    let currentParagraph = '';

    // Group lines into paragraphs
    for (const line of lines) {
      if (line.trim() === '') {
        if (currentParagraph.trim()) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        paragraphs.push('');
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + line.trim();
      }
    }
    if (currentParagraph.trim()) {
      paragraphs.push(currentParagraph.trim());
    }

    if (paragraphs.length === 0) return text;

    // Patterns for introductory meta-commentary
    const introPatterns = [
      /^(alright|okay|ok)\s+[a-z]+[,\s]/i,  // "Alright Name,"
      /^here'?s\s+(a|the|your)\s+(tightened|cleaned|short|punchy|corporate|version|draft)/i,
      /^say\s+less/i,
      /^here\s+you\s+go/i,
      /giving\s+["'].*?["']\s+vibes/i,  // "giving 'something' vibes"
      /you\s+can\s+send\s+back/i,
      /still\s+complete.*?still\s+professional/i,
      /more\s+confident\s+version/i,
      /easier\s+to\s+digest/i,
      /smoother\s+and/i,
    ];

    // Patterns for closing meta-commentary
    const closingPatterns = [
      /^if\s+you\s+want/i,
      /^let\s+me\s+know\s+if/i,
      /^just\s+say\s+the\s+word/i,
      /^i\s+can\s+(also\s+)?craft/i,
      /^i\s+can\s+compress/i,
      /^would\s+you\s+like/i,
      /shorter.*?punchier.*?version/i,
      /professional\s+corporate\s+energy/i,
      /more\s+details.*?or\s+anything\s+else/i,
    ];

    // Keywords that suggest meta-commentary
    const metaKeywords = [
      'version', 'draft', 'tightened', 'punchier', 'corporate', 'energy',
      'vibes', 'saga', 'digest', 'smoother', 'craft', 'compress'
    ];

    // Check if a paragraph is likely meta-commentary
    const isMetaCommentary = (para: string, isIntro: boolean): boolean => {
      if (!para || para.length < 10) return false;

      const lowerPara = para.toLowerCase();

      // Check patterns
      const patterns = isIntro ? introPatterns : closingPatterns;
      if (patterns.some(pattern => pattern.test(para))) {
        return true;
      }

      // Check for meta keywords combined with certain phrases
      const hasMetaKeywords = metaKeywords.some(keyword => lowerPara.includes(keyword));
      if (hasMetaKeywords) {
        // Additional heuristics
        if (lowerPara.includes('here') || lowerPara.includes('if you') || lowerPara.includes('can also')) {
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
      if (contentStartMarkers.some(marker => marker.test(paragraphs[i]))) {
        contentStartIndex = i;
        break;
      }
    }

    // Find actual content end
    for (let i = paragraphs.length - 1; i >= Math.max(paragraphs.length - 5, 0); i--) {
      if (contentEndMarkers.some(marker => marker.test(paragraphs[i]))) {
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

        // Check if this looks like actual content
        if (contentStartMarkers.some(marker => marker.test(para))) {
          inContent = true;
        }

        if (inContent) {
          result.push(para);
          if (contentEndMarkers.some(marker => marker.test(para))) {
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

      return result.join('\n').trim();
    }
  };

  // Performance: Debounced AI detection
  const debouncedDetectAI = useCallback((text: string) => {
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current);
    }
    detectTimeoutRef.current = setTimeout(() => {
      const result = detectAIText(text);
      setAiDetected(result.detected);
      setAiConfidence(result.confidence);
      setAiPatterns(result.patterns);
    }, 300);
  }, []);

  // History management
  const addToHistory = useCallback((inputText: string, outputText: string) => {
    setHistory(prev => {
      const currentIndex = historyIndexRef.current;
      // Slice history up to current index and add new entry
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ input: inputText, output: outputText, timestamp: Date.now() });
      // Keep only last 50 entries
      const finalHistory = newHistory.slice(-50);
      // Update index
      const newIndex = Math.min(finalHistory.length - 1, 49);
      historyIndexRef.current = newIndex;
      setHistoryIndex(newIndex);
      return finalHistory;
    });
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevEntry = history[historyIndex - 1];
      setInput(prevEntry.input);
      setOutput(prevEntry.output);
      const newIndex = historyIndex - 1;
      historyIndexRef.current = newIndex;
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextEntry = history[historyIndex + 1];
      setInput(nextEntry.input);
      setOutput(nextEntry.output);
      const newIndex = historyIndex + 1;
      historyIndexRef.current = newIndex;
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Load saved configurations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiFormatterConfigs');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved configs', e);
      }
    }
  }, []);

  // Save current configuration (unused but kept for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _saveCurrentConfig = useCallback(() => {
    const name = prompt('Enter a name for this configuration:');
    if (name) {
      const config: FormattingConfig = {
        displayMode,
        fontSize,
        lineHeight,
        wordWrap,
        showLineNumbers,
        paragraphSpacing,
      };
      const newConfigs = [...savedConfigs, { name, config }];
      setSavedConfigs(newConfigs);
      localStorage.setItem('aiFormatterConfigs', JSON.stringify(newConfigs));
    }
  }, [displayMode, fontSize, lineHeight, wordWrap, showLineNumbers, paragraphSpacing, savedConfigs]);

  // Load configuration
  const loadConfig = useCallback((config: FormattingConfig) => {
    setDisplayMode(config.displayMode);
    setFontSize(config.fontSize);
    setLineHeight(config.lineHeight);
    setWordWrap(config.wordWrap);
    setShowLineNumbers(config.showLineNumbers);
    setParagraphSpacing(config.paragraphSpacing);
  }, []);

  const formatText = (textToFormat?: string) => {
    try {
      const text = textToFormat !== undefined ? textToFormat : input;
      if (!text) {
        setOutput('');
        return;
      }
      let formatted = text;

    // Remove meta-commentary first (before markdown processing)
    formatted = removeMetaCommentary(formatted);


    // Handle markdown headers (# ## ###) - convert to plain text with colon
    formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, (_match, headerText) => {
      const trimmed = headerText.trim();
      // Add colon if header doesn't end with punctuation
      if (trimmed && !/[.:!?]$/.test(trimmed)) {
        return trimmed + ':';
      }
      return trimmed;
    });

    // Handle bold-only lines (standalone headers like **Title**) - MUST be before general bold removal
    // First, handle lines that are entirely bold text (possibly with whitespace)
    formatted = formatted.replace(/^\s*\*\*([^*\n]+?)\*\*\s*$/gm, (_match, headerText) => {
      const trimmed = headerText.trim();
      // Add colon if header doesn't end with punctuation
      if (trimmed && !/[.:!?]$/.test(trimmed)) {
        return trimmed + ':';
      }
      return trimmed;
    });
    
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
          convertedLines.push(leadingWhitespace + '• ' + match[2].trim());
        } else {
          convertedLines.push(line);
        }
      } else {
        // Check if line contains merged list items separated by * markers
        // Pattern: looks for " * " in the line (indicating merged items)
        const lineTrimmed = line.trim();
        
        // Check if line contains " * " pattern (merged items with * separator)
        if (/\s+\*\s+/.test(lineTrimmed)) {
          const items: string[] = [];
          
          // Split the entire line on " * " pattern
          const parts = lineTrimmed.split(/\s+\*\s+/);
          
          parts.forEach((part, index) => {
            const trimmedPart = part.trim();
            if (trimmedPart) {
              // If this is the first part and it starts with •, keep it as is
              if (index === 0 && /^•\s+/.test(trimmedPart)) {
                items.push(trimmedPart);
              } else {
                // Otherwise, add • prefix
                items.push('• ' + trimmedPart);
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
    
    // Remove markdown bold (**text** or __text__) - general bold removal (after header processing)
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '$1');
    formatted = formatted.replace(/__(.+?)__/g, '$1');

    // Remove markdown italic (*text* or _text_) - but NOT list markers (which are now •)
    // Match *text* but ensure it's not at the start of a line (list items start with • now)
    // Process line by line to avoid matching list markers
    const linesForItalic = formatted.split('\n');
    formatted = linesForItalic.map(line => {
      // If line starts with • (list item), don't process italic on it
      if (/^•\s/.test(line)) {
        return line;
      }
      // Otherwise, remove italic markers
      return line.replace(/\*(.+?)\*/g, '$1').replace(/_(.+?)_/g, '$1');
    }).join('\n');

    // Remove markdown links ([text](url) -> text)
    formatted = formatted.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Convert numbered lists: "1. Item" -> "1. Item" (keep the number)
    // Already readable, but ensure proper spacing
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');
    
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
      
      // If current line is empty, preserve it if it's between non-empty lines
      if (isEmpty) {
        // Check if the last processed line is already empty - if so, skip to avoid double spacing
        const lastWasEmpty = processedLines.length > 0 && !processedLines[processedLines.length - 1].trim();
        if (lastWasEmpty) {
          continue; // Skip duplicate empty lines - ensure only one blank line between paragraphs
        }
        
        // Check if previous or next line is a list item
        const prevIsListItem = prevLine && /^[•\d]\.?\s/.test(prevLine);
        const nextIsListItem = nextLine && /^[•\d]\.?\s/.test(nextLine);
        
        // Don't preserve empty lines between consecutive list items
        if (prevIsListItem && nextIsListItem) {
          // Skip this empty line - list items should be directly adjacent
          continue;
        }
        
        // Keep empty line if previous line exists and next line is not empty
        // Also preserve if previous line is a header (ends with colon)
        const prevIsHeader = prevLine && /:$/.test(prevLine);
        if (prevLine && (!isNextEmpty || prevIsHeader)) {
          // Only preserve one empty line - ensure single blank line between paragraphs
          processedLines.push('');
        }
        continue;
      }
      
      // If line ends with colon (header), check if we need to add a break after it
      if (trimmed && /:$/.test(trimmed)) {
        processedLines.push(trimmed);
        // Check if next line in original is empty - if so, we'll preserve it next iteration
        // If next line is not empty, check if we already have an empty line
        const nextOriginalLine = i < lines.length - 1 ? lines[i + 1] : '';
        const nextOriginalIsEmpty = !nextOriginalLine || !nextOriginalLine.trim();
        const lastWasEmpty = processedLines.length > 0 && !processedLines[processedLines.length - 1].trim();
        
        // Only add empty line if:
        // 1. Next line has content (not empty)
        // 2. We don't already have an empty line
        // 3. Next line is not a list item (list items should be directly after header)
        const nextIsListItem = nextOriginalLine && /^[•\d]\.?\s/.test(nextOriginalLine.trim());
        if (!nextOriginalIsEmpty && !lastWasEmpty && !nextIsListItem) {
          // Next line has content and we don't already have an empty line, so add one
          processedLines.push('');
        }
        // If next line is already empty, it will be preserved in the next iteration (but only once)
        continue;
      }
      
      // Check if this is a list item (starts with bullet or number)
      const isListItem = /^[•\d]\.?\s/.test(trimmed);
      const prevIsListItem = prevLine && /^[•\d]\.?\s/.test(prevLine);
      
      // If this is a list item, ensure it's on its own line (it already is, just preserve it)
      if (isListItem) {
        // Always push list items - they should be on separate lines
        // If previous line was also a list item and there was an empty line between them in the original,
        // we should preserve that (it would have been handled in the empty line check above)
        processedLines.push(trimmed);
        // List items should remain on separate lines - don't merge them
        continue;
      }
      
      processedLines.push(trimmed);
    }
    
    formatted = processedLines.join('\n');
    
    // Cleanup: remove any double blank lines (3+ newlines) that may have been created
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Remove empty lines between consecutive list items
    // Pattern: list item, newline, empty line(s), newline, list item
    formatted = formatted.replace(/([•\d]\.?\s[^\n]+)\n\n+([•\d]\.?\s[^\n]+)/g, '$1\n$2');
    
    // Final cleanup: remove excessive line breaks (more than 1 consecutive)
    // This ensures we don't have more than 1 blank line (2 newlines) between paragraphs
    // Reduce any sequence of 3+ newlines to exactly 2 newlines (one blank line)
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Add spacing between list items and paragraphs (but preserve list item line breaks)
    // Only add spacing before first list item (between paragraph and list)
    formatted = formatted.replace(/([^\n•\d])\n([•\d])/g, '$1\n\n$2');
    // Add spacing after last list item (between list and paragraph)
    formatted = formatted.replace(/([•\d].+)\n([^\n•\d])/g, '$1\n\n$2');
    // Don't add spacing between consecutive list items - they should stay on separate lines
    
    // Cleanup: remove any double blank lines created by list spacing
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Final cleanup: remove empty lines between consecutive list items
    // Pattern: list item, newline(s), empty line(s), newline(s), list item
    formatted = formatted.replace(/([•\d]\.?\s[^\n]+)\n\n+([•\d]\.?\s[^\n]+)/g, '$1\n$2');

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

    // Trim whitespace
    formatted = formatted.trim();

    setOutput(formatted);
    addToHistory(text, formatted);
    } catch (error) {
      console.error('Error formatting text:', error);
      setOutput(textToFormat !== undefined ? textToFormat : input);
    }
  };

  // Helper function to format text for rich preview
  const formatForRichPreview = (text: string): string => {
    if (!text) return '';
    
    // Split into paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map(para => {
      // Check if it's a list item
      if (/^[•\d]\.?\s/.test(para.trim())) {
        return `<ul>${para.split('\n').filter(line => /^[•\d]\.?\s/.test(line.trim())).map(line => 
          `<li>${line.replace(/^[•\d]\.?\s+/, '').trim()}</li>`
        ).join('')}</ul>`;
      }
      return `<p>${para.replace(/\n/g, ' ').trim()}</p>`;
    }).join('');
  };

  // Helper function to render output based on display mode
  const renderOutput = () => {
    if (!output) {
      return (
        <div className="w-full h-64 sm:h-96 p-4 border-2 border-gray-600 rounded-xl bg-gray-900 flex items-center justify-center text-gray-500">
          Formatted text will appear here...
        </div>
      );
    }

    const baseStyle: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
      wordWrap: wordWrap ? 'break-word' : 'normal',
      whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
    };

    const lineNumbersStyle: React.CSSProperties = {
      fontSize: `${Math.max(10, fontSize - 2)}px`,
      lineHeight: lineHeight,
    };

    switch (displayMode) {
      case 'rich':
        return (
          <div
            className="w-full h-64 sm:h-96 p-3 sm:p-4 border-2 border-gray-600 rounded-xl bg-gray-900 overflow-y-auto text-white"
            style={{
              ...baseStyle,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <style>{`
              .rich-preview {
                color: #ffffff;
              }
              .rich-preview p {
                margin-bottom: ${paragraphSpacing}rem;
                line-height: ${lineHeight};
                color: #ffffff;
              }
              .rich-preview ul {
                margin-bottom: ${paragraphSpacing}rem;
                padding-left: 1.5rem;
                list-style-type: disc;
                color: #ffffff;
              }
              .rich-preview li {
                margin-bottom: 0.5rem;
                line-height: ${lineHeight};
                color: #ffffff;
              }
            `}</style>
            <div 
              className="rich-preview"
              dangerouslySetInnerHTML={{ __html: formatForRichPreview(output) }}
            />
          </div>
        );
      case 'formatted':
        return (
          <div
            className="w-full h-64 sm:h-96 p-3 sm:p-4 border-2 border-gray-600 rounded-xl bg-gray-900 overflow-y-auto font-sans text-white"
            style={{
              ...baseStyle,
              paddingLeft: showLineNumbers ? '3.5rem' : '1rem',
            }}
          >
            {showLineNumbers ? (
              <div className="flex relative">
                <div 
                  className="text-gray-500 select-none pr-3 font-mono absolute left-0 top-0" 
                  style={lineNumbersStyle}
                >
                  {output.split('\n').map((_, i) => (
                    <div key={i} style={{ height: `${lineHeight * fontSize}px` }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex-1 whitespace-pre-wrap" style={{ lineHeight: baseStyle.lineHeight }}>
                  {output.split('\n').map((line, i) => (
                    <div key={i} style={{ marginBottom: `${paragraphSpacing * 0.5}rem`, minHeight: `${lineHeight * fontSize}px` }}>
                      {line || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                {output.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: `${paragraphSpacing * 0.5}rem` }}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'plain':
      default:
        if (showLineNumbers) {
          return (
            <div className="relative w-full h-64 sm:h-96 border-2 border-gray-600 rounded-xl bg-gray-900 overflow-hidden">
              <div 
                className="absolute left-0 top-0 bottom-0 text-gray-500 select-none pr-3 pl-2 pt-4 font-mono text-xs overflow-hidden"
                style={lineNumbersStyle}
              >
                {output.split('\n').map((_, i) => (
                  <div key={i} style={{ height: `${lineHeight * fontSize}px` }}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Formatted text will appear here..."
                className="w-full h-full p-3 sm:p-4 border-0 rounded-xl resize-none bg-transparent font-mono text-white placeholder-gray-500"
                style={{
                  ...baseStyle,
                  paddingLeft: '3rem',
                }}
              />
            </div>
          );
        }
        return (
          <textarea
            value={output}
            readOnly
            placeholder="Formatted text will appear here..."
            className="w-full h-64 sm:h-96 p-3 sm:p-4 border-2 border-gray-600 rounded-xl resize-none bg-gray-900 font-mono text-white placeholder-gray-500"
            style={baseStyle}
          />
        );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setNotificationType('copied');
    setShowNotification(true);
    setTimeout(() => {
      setCopied(false);
      setShowNotification(false);
    }, 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setCopied(false);
    setAiDetected(false);
    setHistory([]);
    setHistoryIndex(-1);
    historyIndexRef.current = -1;
    setShowOriginal(false);
  };

  // Text transformation functions
  const transformText = useCallback((transformType: string) => {
    if (!output) return;
    
    let transformed = output;
    
    switch (transformType) {
      case 'sentenceCase':
        // Convert to lowercase first, then capitalize first letter of each sentence
        transformed = output.toLowerCase();
        // Capitalize first letter of the text
        transformed = transformed.charAt(0).toUpperCase() + transformed.slice(1);
        // Capitalize first letter after sentence endings (. ! ?)
        transformed = transformed.replace(/([.!?]\s+)([a-z])/g, (_match, p1, p2) => p1 + p2.toUpperCase());
        break;
      case 'titleCase':
        // Convert to lowercase first, then capitalize first letter of each word
        transformed = output.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        break;
      case 'uppercase':
        transformed = output.toUpperCase();
        break;
      case 'lowercase':
        transformed = output.toLowerCase();
        break;
      case 'removeExtraSpaces':
        // Remove extra spaces but preserve line breaks
        transformed = output.split('\n').map(line => line.replace(/\s+/g, ' ').trim()).join('\n');
        break;
      case 'removeDuplicateLines':
        const lines = output.split('\n');
        transformed = Array.from(new Set(lines)).join('\n');
        break;
      case 'sortLines':
        transformed = output.split('\n').sort().join('\n');
        break;
      case 'reverseLines':
        transformed = output.split('\n').reverse().join('\n');
        break;
      case 'removeEmptyLines':
        transformed = output.split('\n').filter(line => line.trim()).join('\n');
        break;
      case 'trimLines':
        transformed = output.split('\n').map(line => line.trim()).join('\n');
        break;
      default:
        return;
    }
    
    setOutput(transformed);
    addToHistory(input, transformed);
  }, [output, input, addToHistory]);

  // Apply text formatting (bold, italic, underline, strikethrough)
  const applyTextFormatting = useCallback((formatType: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    if (!textareaRef.current || !output) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // If no text is selected, do nothing
    if (start === end) return;
    
    const selectedText = output.substring(start, end);
    let formattedText = '';
    
    // Apply markdown formatting based on type
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      default:
        return;
    }
    
    // Replace selected text with formatted text
    const newText = output.substring(0, start) + formattedText + output.substring(end);
    setOutput(newText);
    addToHistory(input, newText);
    
    // Restore cursor position after the formatted text
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + formattedText.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);
  }, [output, input, addToHistory]);

  // Find all matches
  const findMatches = useCallback((text: string, searchText: string) => {
    if (!searchText || !text) {
      setMatchPositions([]);
      setTotalMatches(0);
      setMatchIndex(-1);
      return [];
    }

    let regex: RegExp;
    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        regex = new RegExp(searchText, flags);
      } else {
        const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
        const flags = caseSensitive ? 'g' : 'gi';
        regex = new RegExp(pattern, flags);
      }
    } catch (e) {
      setMatchPositions([]);
      setTotalMatches(0);
      setMatchIndex(-1);
      // Show error notification for invalid regex
      if (useRegex && showFindReplace) {
        setNotificationType('formatting');
        setNotificationMessage('Invalid regex pattern');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
      return [];
    }

    const matches: Array<{start: number; end: number}> = [];
    let match;
    let lastIndex = -1;
    const maxIterations = text.length + 1; // Safety limit
    let iterations = 0;
    
    while ((match = regex.exec(text)) !== null && iterations < maxIterations) {
      iterations++;
      
      // Prevent infinite loop: if match is at same position and has zero length, advance
      if (match.index === lastIndex && match[0].length === 0) {
        // Advance regex lastIndex to prevent infinite loop
        if (regex.lastIndex <= match.index) {
          regex.lastIndex = match.index + 1;
        }
        if (regex.lastIndex > text.length) break;
        continue;
      }
      
      lastIndex = match.index;
      matches.push({ start: match.index, end: match.index + match[0].length });
      
      if (!regex.global) break;
      
      // Additional safety: if lastIndex didn't advance, break to prevent infinite loop
      if (regex.lastIndex === match.index && match[0].length === 0) {
        regex.lastIndex++;
        if (regex.lastIndex > text.length) break;
      }
    }

    setMatchPositions(matches);
    setTotalMatches(matches.length);
    if (matches.length > 0 && matchIndex === -1) {
      setMatchIndex(0);
    } else if (matches.length === 0) {
      setMatchIndex(-1);
    }
    return matches;
  }, [caseSensitive, wholeWord, useRegex, matchIndex, showFindReplace]);

  // Navigate to next match
  const findNext = useCallback(() => {
    if (matchPositions.length === 0) {
      // If no matches, try to find them first
      const matches = findMatches(output, findText);
      if (matches.length > 0) {
        setMatchIndex(0);
      }
      return;
    }
    setMatchIndex(prev => (prev + 1) % matchPositions.length);
  }, [matchPositions, findText, output, findMatches]);

  // Navigate to previous match
  const findPrevious = useCallback(() => {
    if (matchPositions.length === 0) {
      // If no matches, try to find them first
      const matches = findMatches(output, findText);
      if (matches.length > 0) {
        setMatchIndex(matches.length - 1); // Start at last match when going previous
      }
      return;
    }
    setMatchIndex(prev => (prev - 1 + matchPositions.length) % matchPositions.length);
  }, [matchPositions, findText, output, findMatches]);

  // Replace current match
  const replaceCurrent = useCallback(() => {
    if (!findText || !output || matchIndex === -1 || matchPositions.length === 0) return;
    
    const currentMatchIndex = matchIndex;
    const currentMatchPositions = matchPositions;
    const match = currentMatchPositions[currentMatchIndex];
    const before = output.substring(0, match.start);
    const after = output.substring(match.end);
    const replaced = before + replaceText + after;
    
    setOutput(replaced);
    addToHistory(input, replaced);
    
    // Recalculate matches after replace using the replaced text
    const newMatches = findMatches(replaced, findText);
    
    // Update match index based on new matches
    // If we replaced a match that wasn't the last one, stay at same index
    // If we replaced the last match, move to previous match
    // If no matches left, set to -1
    if (newMatches.length === 0) {
      setMatchIndex(-1);
    } else if (currentMatchIndex < currentMatchPositions.length - 1) {
      // Not the last match, stay at same index (next match moves up)
      setMatchIndex(Math.min(currentMatchIndex, newMatches.length - 1));
    } else if (newMatches.length > 0) {
      // Was the last match, move to new last match
      setMatchIndex(Math.max(0, newMatches.length - 1));
    } else {
      setMatchIndex(-1);
    }
  }, [findText, replaceText, output, input, matchIndex, matchPositions, addToHistory, findMatches]);

  // Replace all matches
  const performFindReplace = useCallback(() => {
    if (!findText || !output) return;
    
    let regex: RegExp;
    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        regex = new RegExp(findText, flags);
      } else {
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
        const flags = caseSensitive ? 'g' : 'gi';
        regex = new RegExp(pattern, flags);
      }
    } catch (e) {
      return;
    }
    
    const replaced = output.replace(regex, replaceText);
    
    setOutput(replaced);
    addToHistory(input, replaced);
    setMatchPositions([]);
    setTotalMatches(0);
    setMatchIndex(-1);
  }, [findText, replaceText, output, input, caseSensitive, wholeWord, useRegex, addToHistory]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      const isAIText = detectAIText(pastedText);
      if (isAIText) {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = output || input;
        const newValue = currentValue.substring(0, start) + pastedText + currentValue.substring(end);
        
        setInput(newValue);
        setIsFormatting(true);
        // Show formatting notification
        setNotificationType('formatting');
        setShowNotification(true);
        
        // Format the text
        formatText(newValue);
        
        // After formatting completes, show success notification
        setTimeout(() => {
          setNotificationType('success');
          setIsFormatting(false);
          setTimeout(() => setShowNotification(false), 2000);
        }, 500);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    setIsFormatting(true);
    // Auto-format on change (debounced)
    if (newValue && newValue.trim().length > 0) {
      debouncedDetectAI(newValue);
      // Show formatting notification only if we have substantial text
      if (newValue.length > 10) {
        setNotificationType('formatting');
        setShowNotification(true);
      }
      // Debounced formatting
      if (formatTimeoutRef.current) {
        clearTimeout(formatTimeoutRef.current);
      }
      formatTimeoutRef.current = setTimeout(() => {
        try {
          formatText(newValue);
          // Show success notification after formatting
          if (newValue.length > 10) {
            setNotificationType('success');
            setTimeout(() => {
              setIsFormatting(false);
              setTimeout(() => setShowNotification(false), 2000);
            }, 100);
          } else {
            setIsFormatting(false);
            setShowNotification(false);
          }
        } catch (error) {
          console.error('Error formatting text:', error);
          setIsFormatting(false);
          setShowNotification(false);
        }
      }, 500);
    } else {
      setAiDetected(false);
      setOutput('');
      setIsFormatting(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (input) {
          formatText();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
      }
      if (e.key === 'Escape') {
        setIsFullScreen(false);
        setShowFindReplace(false);
        setShowTemplates(false);
        setShowFormattingControls(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, undo, redo]);

  // Real-time search - find matches as user types or when search options change
  useEffect(() => {
    if (showFindReplace && findText && output) {
      findMatches(output, findText);
    } else if (!findText) {
      setMatchPositions([]);
      setTotalMatches(0);
      setMatchIndex(-1);
    }
  }, [findText, output, showFindReplace, caseSensitive, wholeWord, useRegex, findMatches]);

  // Scroll to current match and highlight it (only when navigating, not while typing)
  const findInputRef = useRef<HTMLInputElement | null>(null);
  const prevMatchIndexRef = useRef(-1);
  useEffect(() => {
    if (textareaRef.current && showFindReplace && matchIndex >= 0 && matchPositions.length > 0) {
      // Only focus textarea if matchIndex changed due to navigation (not initial search)
      const isNavigation = prevMatchIndexRef.current !== -1 && prevMatchIndexRef.current !== matchIndex;
      const isFindInputFocused = document.activeElement === findInputRef.current;
      prevMatchIndexRef.current = matchIndex;
      
      const textarea = textareaRef.current;
      const match = matchPositions[matchIndex];
      
      // Set selection to highlight current match
      textarea.setSelectionRange(match.start, match.end);
      
      // Only focus textarea if user is navigating matches AND Find input is not focused
      if (isNavigation && !isFindInputFocused) {
        textarea.focus();
      }
      
      // Scroll to match
      const textBeforeMatch = textarea.value.substring(0, match.start);
      const lines = textBeforeMatch.split('\n');
      const lineNumber = lines.length - 1;
      const computedLineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || fontSize * 1.6;
      const scrollTop = lineNumber * computedLineHeight - textarea.clientHeight / 2;
      textarea.scrollTop = Math.max(0, scrollTop);
    } else if (matchIndex === -1) {
      prevMatchIndexRef.current = -1;
    }
  }, [matchIndex, matchPositions, showFindReplace, fontSize, lineHeight]);

  // Diff calculation helper (unused but kept for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _calculateDiff = useMemo(() => {
    if (!input || !output || !showDiff) return null;
    
    const inputLines = input.split('\n');
    const outputLines = output.split('\n');
    const maxLines = Math.max(inputLines.length, outputLines.length);
    const diff: Array<{ type: 'added' | 'removed' | 'unchanged'; line: string }> = [];
    
    for (let i = 0; i < maxLines; i++) {
      const inputLine = inputLines[i] || '';
      const outputLine = outputLines[i] || '';
      
      if (inputLine === outputLine) {
        diff.push({ type: 'unchanged', line: inputLine });
      } else {
        if (inputLine) diff.push({ type: 'removed', line: inputLine });
        if (outputLine) diff.push({ type: 'added', line: outputLine });
      }
    }
    
    return diff;
  }, [input, output, showDiff]);

  const mainContent = (
    <div className={`${isFullScreen ? 'p-4' : 'p-4 sm:p-6'}`}>
      <div className={`${isFullScreen ? 'h-full overflow-auto' : 'mx-auto'}`} style={!isFullScreen ? { maxWidth: '65rem' } : {}}>
        {/* Notification */}
        {showNotification && (
          <div 
            className={`fixed top-4 right-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-sm sm:text-base transition-all duration-300 transform ${
              notificationType === 'formatting' 
                ? 'bg-[#da651e] text-white animate-pulse translate-x-0' 
                : 'bg-[#4a9d6f] text-white translate-x-0 animate-[slideIn_0.3s_ease-out]'
            }`}
            style={{
              animation: notificationType === 'formatting' 
                ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' 
                : notificationType === 'success' || notificationType === 'copied'
                ? 'slideIn 0.3s ease-out, checkmarkPop 0.5s ease-out 0.2s'
                : undefined
            }}
          >
            {notificationType === 'formatting' ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Formatting your text...</span>
              </>
            ) : notificationType === 'copied' ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" style={{ animation: 'checkmarkPop 0.5s ease-out' }} />
                <span>Text copied to clipboard!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" style={{ animation: 'checkmarkPop 0.5s ease-out' }} />
                <span>AI text formatted automatically!</span>
              </>
            )}
          </div>
        )}
        
        {/* Add CSS animations and scrollbar styling */}
        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes checkmarkPop {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          /* Custom scrollbar styling */
          textarea::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          textarea::-webkit-scrollbar-track {
            background: transparent;
          }
          textarea::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
          }
          textarea::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
          /* Firefox scrollbar */
          textarea {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 transparent;
          }
        `}</style>

        {/* Unified Text Field */}
        <div className="px-4 sm:px-0">
          <div className="bg-gray-800/50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0 mb-0" style={{ padding: '0px 0 10px' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-0">
                  {output ? 'Formatted Text' : 'AI Text Formatter'}
                </h2>
                {output && (
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-medium border border-gray-600 transition-colors"
                    title={showOriginal ? 'Show formatted text' : 'Show original text'}
                  >
                    <Eye className="w-3 h-3" />
                    {showOriginal ? 'Original' : 'Formatted'}
                  </button>
                )}
                {aiDetected && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-[#4a9d6f]/20 text-[#4a9d6f] rounded-full text-xs font-medium border border-[#4a9d6f]/30">
                    <Sparkles className="w-3 h-3" />
                    AI Detected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {output && (
                  <>
                    <button
                      onClick={copyToClipboard}
                      className="p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy formatted text"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 rounded-lg transition-colors"
                      title="Clear all text"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </>
                )}
                <span className="text-xs sm:text-sm text-gray-400">{(output || input).length} chars</span>
              </div>
            </div>

            {/* Output Display */}
            {/* Unified Textarea - shows formatted output but is editable */}
            {displayMode === 'plain' ? (
              <>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={isFormatting ? input : (showOriginal && output ? input : (output || input))}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    onScroll={(e) => {
                      if (overlayRef.current) {
                        overlayRef.current.scrollTop = e.currentTarget.scrollTop;
                        overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
                      }
                    }}
                    placeholder="Paste AI-generated text here... Markdown and formatting will be removed automatically!"
                    className={`w-full h-96 sm:h-[600px] p-3 sm:p-4 border-2 border-gray-600 rounded-xl resize-none focus:border-[#4a9d6f] focus:outline-none transition-colors font-mono text-sm bg-gray-900 text-white placeholder-gray-500 ${
                      showFindReplace && findText && matchPositions.length > 0 ? 'text-transparent caret-white' : ''
                    }`}
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: lineHeight,
                      wordWrap: wordWrap ? 'break-word' : 'normal',
                      whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                    }}
                  />
                  {/* Highlighting overlay - only show when actively searching with matches */}
                  {showFindReplace && findText && matchPositions.length > 0 && (
                    <div
                      ref={overlayRef}
                      className="absolute inset-0 pointer-events-none overflow-auto rounded-xl p-3 sm:p-4 font-mono text-sm whitespace-pre-wrap break-words text-white"
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: lineHeight,
                        wordWrap: wordWrap ? 'break-word' : 'normal',
                        whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                      onScroll={(e) => {
                        // Prevent circular sync - only sync if textarea scroll is different
                        if (textareaRef.current && Math.abs(textareaRef.current.scrollTop - e.currentTarget.scrollTop) > 1) {
                          textareaRef.current.scrollTop = e.currentTarget.scrollTop;
                          textareaRef.current.scrollLeft = e.currentTarget.scrollLeft;
                        }
                      }}
                      onWheel={(e) => {
                        // Allow wheel events to pass through to textarea
                        if (textareaRef.current) {
                          textareaRef.current.scrollTop += e.deltaY;
                          if (overlayRef.current) {
                            overlayRef.current.scrollTop = textareaRef.current.scrollTop;
                          }
                        }
                      }}
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          const text = isFormatting ? input : (showOriginal && output ? input : (output || input));
                          let highlighted = '';
                          let lastIndex = 0;
                          
                          matchPositions.forEach((match, index) => {
                            // Add text before match
                            highlighted += escapeHtml(text.substring(lastIndex, match.start));
                            
                            // Add highlighted match
                            const isCurrent = index === matchIndex;
                            highlighted += `<mark class="${isCurrent ? 'bg-[#4a9d6f] text-white px-0.5 rounded' : 'bg-yellow-500/50 text-yellow-200 px-0.5 rounded'}">${escapeHtml(text.substring(match.start, match.end))}</mark>`;
                            
                            lastIndex = match.end;
                          });
                          
                          // Add remaining text
                          highlighted += escapeHtml(text.substring(lastIndex));
                          
                          return highlighted;
                        })(),
                      }}
                    />
                  )}
                </div>
                <p className="text-gray-400 mt-2 text-center" style={{ fontSize: '12px' }}>Remove markdown formatting and convert AI text to clean, human-readable format</p>
              </>
            ) : (
              renderOutput()
            )}

            {/* Find/Replace Panel */}
            {showFindReplace && (
              <div className="mt-4 pt-4 border-t border-gray-600 p-4 sm:p-5 bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl shadow-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-600/50">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Find and Replace
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFindText('');
                        setReplaceText('');
                        setMatchPositions([]);
                        setMatchIndex(-1);
                        setTotalMatches(0);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                      title="Clear"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowFindReplace(false)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">Find</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4a9d6f] transition-colors">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        ref={findInputRef}
                        type="text"
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            findNext();
                          } else if (e.key === 'Enter' && e.shiftKey) {
                            e.preventDefault();
                            findPrevious();
                          } else if (e.key === 'Escape') {
                            setShowFindReplace(false);
                          }
                        }}
                        placeholder="Text to find..."
                        className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-600 rounded-lg text-sm focus:outline-none focus:border-[#4a9d6f] focus:ring-2 focus:ring-[#4a9d6f]/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all duration-200"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-800/50 rounded px-1">
                        <button
                          onClick={findPrevious}
                          disabled={totalMatches === 0}
                          className="p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded"
                          title="Previous (Shift+Enter)"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={findNext}
                          disabled={totalMatches === 0}
                          className="p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded"
                          title="Next (Enter)"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">Replace</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4a9d6f] transition-colors">
                        <Replace className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            replaceCurrent();
                          }
                        }}
                        placeholder="Replace with..."
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-600 rounded-lg text-sm focus:outline-none focus:border-[#4a9d6f] focus:ring-2 focus:ring-[#4a9d6f]/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={caseSensitive}
                          onChange={(e) => setCaseSensitive(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          caseSensitive 
                            ? 'bg-[#4a9d6f] border-[#4a9d6f]' 
                            : 'bg-gray-900 border-gray-600 group-hover:border-gray-500'
                        }`}>
                          {caseSensitive && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5">
                        <CaseSensitive className="w-3.5 h-3.5" />
                        Case sensitive
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={wholeWord}
                          onChange={(e) => setWholeWord(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          wholeWord 
                            ? 'bg-[#4a9d6f] border-[#4a9d6f]' 
                            : 'bg-gray-900 border-gray-600 group-hover:border-gray-500'
                        }`}>
                          {wholeWord && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span>Whole word</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={useRegex}
                          onChange={(e) => setUseRegex(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          useRegex 
                            ? 'bg-[#4a9d6f] border-[#4a9d6f]' 
                            : 'bg-gray-900 border-gray-600 group-hover:border-gray-500'
                        }`}>
                          {useRegex && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5">
                        <Regex className="w-3.5 h-3.5" />
                        Regex
                      </span>
                    </label>
                    {useRegex && findText && (
                      <span className="text-xs text-yellow-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                        Regex mode active
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-2">
                    {findText && (
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        {totalMatches > 0 ? (
                          <span className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">
                            {totalMatches} match{totalMatches !== 1 ? 'es' : ''} found
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700 text-gray-500">
                            No matches found
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={replaceCurrent}
                        disabled={!findText || !output || matchIndex === -1}
                        className="px-3 sm:px-4 py-2 bg-[#4a9d6f] text-white rounded-lg hover:bg-[#176641] disabled:bg-gray-600 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                        title="Replace current (Ctrl+Enter)"
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => {
                          replaceCurrent();
                          setTimeout(() => findNext(), 50);
                        }}
                        disabled={!findText || !output || matchIndex === -1}
                        className="px-3 sm:px-4 py-2 bg-[#4a9d6f] text-white rounded-lg hover:bg-[#176641] disabled:bg-gray-600 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        Replace & Next
                      </button>
                      <button
                        onClick={performFindReplace}
                        disabled={!findText || !output}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#da651e] to-[#c55a1a] text-white rounded-lg hover:from-[#b8541a] hover:to-[#a04915] disabled:bg-gray-600 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        Replace All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Templates Panel */}
            {showTemplates && (
              <div className="mt-4 pt-4 border-t border-gray-600 p-4 sm:p-5 bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl shadow-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-600/50">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Formatting Templates
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFontSize(14);
                        setLineHeight(1.6);
                        setParagraphSpacing(1);
                        setWordWrap(true);
                        setShowLineNumbers(false);
                        setDisplayMode('plain');
                      }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                      title="Reset to defaults"
                      aria-label="Reset formatting options to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                      title="Close"
                      aria-label="Close templates panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {templates.map((template) => {
                    const isActive = 
                      displayMode === template.config.displayMode &&
                      fontSize === template.config.fontSize &&
                      Math.abs(lineHeight - template.config.lineHeight) < 0.01 &&
                      Math.abs(paragraphSpacing - template.config.paragraphSpacing) < 0.01 &&
                      wordWrap === template.config.wordWrap &&
                      showLineNumbers === template.config.showLineNumbers;
                    
                    return (
                      <button
                        key={template.name}
                        onClick={() => {
                          loadConfig(template.config as FormattingConfig);
                          setShowTemplates(false);
                        }}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-[#4a9d6f]/20 border-2 border-[#4a9d6f]'
                            : 'bg-gray-900 border border-gray-600 hover:bg-gray-800 hover:border-[#4a9d6f]'
                        }`}
                        aria-label={`Apply ${template.name} template: ${template.description}`}
                      >
                        <div className="font-medium text-xs sm:text-sm text-white">{template.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                      </button>
                    );
                  })}
                </div>
                {savedConfigs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-300 mb-2">Saved Configurations</h4>
                    <div className="flex flex-wrap gap-2">
                      {savedConfigs.map((saved, idx) => {
                        const isActive = 
                          displayMode === saved.config.displayMode &&
                          fontSize === saved.config.fontSize &&
                          Math.abs(lineHeight - saved.config.lineHeight) < 0.01 &&
                          Math.abs(paragraphSpacing - saved.config.paragraphSpacing) < 0.01 &&
                          wordWrap === saved.config.wordWrap &&
                          showLineNumbers === saved.config.showLineNumbers;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              loadConfig(saved.config);
                              setShowTemplates(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                              isActive
                                ? 'bg-[#4a9d6f]/20 border-2 border-[#4a9d6f] text-white'
                                : 'bg-gray-900 border border-gray-600 hover:bg-gray-800 hover:border-[#4a9d6f] text-gray-300'
                            }`}
                            aria-label={`Apply saved configuration: ${saved.name}`}
                          >
                            {saved.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Formatting Controls Panel */}
            {showFormattingControls && (
              <div className="mt-4 pt-4 border-t border-gray-600 p-4 sm:p-5 bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl shadow-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-600/50">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Formatting Options
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFontSize(14);
                        setLineHeight(1.6);
                        setParagraphSpacing(1);
                        setWordWrap(true);
                        setShowLineNumbers(false);
                        setDisplayMode('plain');
                      }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                      title="Reset to defaults"
                      aria-label="Reset formatting options to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowFormattingControls(false)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                      title="Close"
                      aria-label="Close formatting options panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* Display Mode & Presets Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Display Mode</label>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setDisplayMode('plain')}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            displayMode === 'plain' 
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Plain
                        </button>
                        <button
                          onClick={() => setDisplayMode('formatted')}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            displayMode === 'formatted' 
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Formatted
                        </button>
                        <button
                          onClick={() => setDisplayMode('rich')}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            displayMode === 'rich' 
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Rich
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Presets</label>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setFontSize(12);
                            setLineHeight(1.4);
                            setParagraphSpacing(0.8);
                          }}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            fontSize === 12 && Math.abs(lineHeight - 1.4) < 0.01 && Math.abs(paragraphSpacing - 0.8) < 0.01
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => {
                            setFontSize(14);
                            setLineHeight(1.6);
                            setParagraphSpacing(1);
                          }}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            fontSize === 14 && Math.abs(lineHeight - 1.6) < 0.01 && Math.abs(paragraphSpacing - 1) < 0.01
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Medium
                        </button>
                        <button
                          onClick={() => {
                            setFontSize(16);
                            setLineHeight(1.8);
                            setParagraphSpacing(1.2);
                          }}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            fontSize === 16 && Math.abs(lineHeight - 1.8) < 0.01 && Math.abs(paragraphSpacing - 1.2) < 0.01
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Large
                        </button>
                        <button
                          onClick={() => {
                            setFontSize(14);
                            setLineHeight(2.2);
                            setParagraphSpacing(1.5);
                          }}
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                            fontSize === 14 && Math.abs(lineHeight - 2.2) < 0.01 && Math.abs(paragraphSpacing - 1.5) < 0.01
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Spacious
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Typography Controls - Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* Font Size */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Font Size</span>
                        <span className="text-[10px] font-semibold text-[#4a9d6f]">{fontSize}px</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                          className="p-1 bg-gray-900 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-gray-300"
                          aria-label="Decrease font size"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                          aria-label="Font size"
                        />
                        <button
                          onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                          className="p-1 bg-gray-900 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-gray-300"
                          aria-label="Increase font size"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Height */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Line Height</span>
                        <span className="text-[10px] font-semibold text-[#4a9d6f]">{lineHeight.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        aria-label="Line height"
                      />
                    </div>

                    {/* Paragraph Spacing */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Para Spacing</span>
                        <span className="text-[10px] font-semibold text-[#4a9d6f]">{paragraphSpacing.toFixed(1)}rem</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={paragraphSpacing}
                        onChange={(e) => setParagraphSpacing(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        aria-label="Paragraph spacing"
                      />
                    </div>
                  </div>

                  {/* Layout Options - Inline */}
                  <div className="flex items-center gap-3 pt-1 border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">Word Wrap</span>
                      <button
                        onClick={() => setWordWrap(!wordWrap)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          wordWrap ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={wordWrap}
                        aria-label="Toggle word wrap"
                      >
                        <div
                          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            wordWrap ? 'translate-x-[22px]' : 'translate-x-0.5'
                          } top-0.5`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">Line Numbers</span>
                      <button
                        onClick={() => setShowLineNumbers(!showLineNumbers)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          showLineNumbers ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={showLineNumbers}
                        aria-label="Toggle line numbers"
                      >
                        <div
                          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            showLineNumbers ? 'translate-x-[22px]' : 'translate-x-0.5'
                          } top-0.5`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar at Bottom */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap mt-4 pt-4 border-t border-gray-600">
              {/* History Controls */}
              <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  const newState = !showFindReplace;
                  setShowFindReplace(newState);
                  if (newState) {
                    setShowTemplates(false);
                    setShowFormattingControls(false);
                  }
                }}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  showFindReplace 
                    ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Find and Replace"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const newState = !showTemplates;
                  setShowTemplates(newState);
                  if (newState) {
                    setShowFindReplace(false);
                    setShowFormattingControls(false);
                  }
                }}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  showTemplates 
                    ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Templates"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const newState = !showFormattingControls;
                  setShowFormattingControls(newState);
                  if (newState) {
                    setShowFindReplace(false);
                    setShowTemplates(false);
                  }
                }}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  showFormattingControls 
                    ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Formatting Options"
              >
                <Type className="w-4 h-4" />
              </button>

              {/* Text Formatting Toolbar - only show when output exists */}
              {output && (
                <div className="flex items-center gap-1 border-l border-gray-600 pl-2 ml-2">
                  <button
                    onClick={() => applyTextFormatting('bold')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('italic')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('underline')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('strikethrough')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Text Transformations - only show when output exists */}
              {output && (
                <div className="flex items-center gap-1 border-l border-gray-600 pl-2 ml-2">
                  <button
                    onClick={() => transformText('sentenceCase')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Sentence Case"
                  >
                    <span className="text-[10px] font-medium" style={{ lineHeight: 0 }}>Aa</span>
                  </button>
                  <button
                    onClick={() => transformText('titleCase')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Title Case"
                  >
                    <span className="text-[10px] font-medium" style={{ lineHeight: 0 }}>Aa B</span>
                  </button>
                  <button
                    onClick={() => transformText('uppercase')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="UPPERCASE"
                  >
                    <CaseUpper className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => transformText('lowercase')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="lowercase"
                    >
                    <CaseLower className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => transformText('removeExtraSpaces')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500 px-0.5"
                    title="Trim Spaces"
                  >
                    <span className="text-[10px]" style={{ lineHeight: 0 }}>Trim</span>
                  </button>
                  <button
                    onClick={() => transformText('removeEmptyLines')}
                    className="flex items-center justify-center w-9 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500 px-0.5"
                    title="Remove Empty Lines"
                  >
                    <span className="text-[10px]" style={{ lineHeight: 0 }}>Empty</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Info Section */}
        <div className="mt-6 sm:mt-8 bg-gray-800/50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700 mx-4 sm:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* What Gets Removed */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">What gets removed:</h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                  <span>Bold, italic, headers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                  <span>Markdown links & code blocks</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                  <span>Bullet points & list markers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                  <span>Blockquotes & horizontal rules</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                  <span>AI meta-commentary</span>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Additional features:</h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>AI detection with confidence score</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Undo/redo (Ctrl+Z/Y)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Text transformations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Find & replace (Ctrl+F)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Formatting templates & saved configs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Multiple display modes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Comparison views & full-screen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isFullScreen ? (
    <div className="fixed inset-0 z-50 bg-gray-900 overflow-auto">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-3 sm:p-4 flex items-center justify-between z-10">
        <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#4a9d6f]" />
          AI Text Formatter
        </h1>
        <button
          onClick={() => setIsFullScreen(false)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Exit full screen"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>
      {mainContent}
    </div>
  ) : (
    <div className="min-h-screen bg-gray-900">
      {mainContent}
    </div>
  );
}

