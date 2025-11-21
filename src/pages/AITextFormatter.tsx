import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Copy, Check, Wand2, Settings, Sparkles, Type, Eye, FileText, Minus, Plus, RotateCcw, Zap, Maximize2, Minimize2, Search, Replace, History, Undo2, Redo2, Save, Download, Upload, CaseSensitive, CaseLower, CaseUpper, AlignLeft, Trash2, X } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const [aiDetected, setAiDetected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
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
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<Array<{name: string; config: FormattingConfig}>>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Performance: Debounce refs
  const formatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const detectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ input: inputText, output: outputText, timestamp: Date.now() });
      // Keep only last 50 entries
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevEntry = history[historyIndex - 1];
      setInput(prevEntry.input);
      setOutput(prevEntry.output);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextEntry = history[historyIndex + 1];
      setInput(nextEntry.input);
      setOutput(nextEntry.output);
      setHistoryIndex(prev => prev + 1);
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

  // Save current configuration
  const saveCurrentConfig = useCallback(() => {
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

  const formatText = () => {
    let formatted = input;

    // Remove meta-commentary first (before markdown processing)
    formatted = removeMetaCommentary(formatted);

    // Remove markdown bold (**text** or __text__)
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '$1');
    formatted = formatted.replace(/__(.+?)__/g, '$1');

    // Remove markdown italic (*text* or _text_)
    formatted = formatted.replace(/\*(.+?)\*/g, '$1');
    formatted = formatted.replace(/_(.+?)_/g, '$1');

    // Remove markdown headers (# ## ###)
    formatted = formatted.replace(/^#{1,6}\s+/gm, '');

    // Remove markdown links ([text](url) -> text)
    formatted = formatted.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Convert lists to readable format (better than just removing markers)
    // Convert bullet lists: "- Item" or "* Item" -> "• Item"
    formatted = formatted.replace(/^[\*\-\+]\s+(.+)$/gm, '• $1');
    // Convert numbered lists: "1. Item" -> "1. Item" (keep the number)
    // Already readable, but ensure proper spacing
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');

    // Remove code blocks (``` or `)
    formatted = formatted.replace(/```[\s\S]*?```/g, '');
    formatted = formatted.replace(/`(.+?)`/g, '$1');

    // Remove blockquotes (>)
    formatted = formatted.replace(/^>\s+/gm, '');

    // Remove horizontal rules (--- or ***)
    formatted = formatted.replace(/^[\-\*]{3,}$/gm, '');

    // Better paragraph handling - preserve intentional line breaks
    // Clean up excessive line breaks (more than 2 consecutive)
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Ensure proper spacing between paragraphs
    formatted = formatted.split('\n').map(line => line.trim()).join('\n');
    
    // Add spacing between list items and paragraphs
    formatted = formatted.replace(/([^\n])\n([•\d])/g, '$1\n\n$2');
    formatted = formatted.replace(/([•\d].+)\n([^\n•\d])/g, '$1\n\n$2');

    // Trim whitespace
    formatted = formatted.trim();

    setOutput(formatted);
    addToHistory(input, formatted);
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
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setCopied(false);
    setAiDetected(false);
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Text transformation functions
  const transformText = useCallback((transformType: string) => {
    if (!output) return;
    
    let transformed = output;
    
    switch (transformType) {
      case 'sentenceCase':
        transformed = output.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/gi, (char) => char.toUpperCase());
        break;
      case 'titleCase':
        transformed = output.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        break;
      case 'uppercase':
        transformed = output.toUpperCase();
        break;
      case 'lowercase':
        transformed = output.toLowerCase();
        break;
      case 'removeExtraSpaces':
        transformed = output.replace(/\s+/g, ' ').trim();
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

  // Find and replace
  const performFindReplace = useCallback(() => {
    if (!findText || !output) return;
    
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const replaced = output.replace(regex, replaceText);
    
    setOutput(replaced);
    addToHistory(input, replaced);
    setShowFindReplace(false);
  }, [findText, replaceText, output, input, caseSensitive, addToHistory]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && autoFormat) {
      const isAIText = detectAIText(pastedText);
      if (isAIText) {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = input;
        const newValue = currentValue.substring(0, start) + pastedText + currentValue.substring(end);
        
        setInput(newValue);
        setAiDetected(true);
        
        // Format the new input using the same enhanced formatting logic
        let formatted = newValue;
        
        // Remove meta-commentary first (before markdown processing)
        formatted = removeMetaCommentary(formatted);
        
        // Remove markdown bold (**text** or __text__)
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '$1');
        formatted = formatted.replace(/__(.+?)__/g, '$1');

        // Remove markdown italic (*text* or _text_)
        formatted = formatted.replace(/\*(.+?)\*/g, '$1');
        formatted = formatted.replace(/_(.+?)_/g, '$1');

        // Remove markdown headers (# ## ###)
        formatted = formatted.replace(/^#{1,6}\s+/gm, '');

        // Remove markdown links ([text](url) -> text)
        formatted = formatted.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

        // Convert lists to readable format (better than just removing markers)
        // Convert bullet lists: "- Item" or "* Item" -> "• Item"
        formatted = formatted.replace(/^[\*\-\+]\s+(.+)$/gm, '• $1');
        // Convert numbered lists: "1. Item" -> "1. Item" (keep the number)
        formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');

        // Remove code blocks (``` or `)
        formatted = formatted.replace(/```[\s\S]*?```/g, '');
        formatted = formatted.replace(/`(.+?)`/g, '$1');

        // Remove blockquotes (>)
        formatted = formatted.replace(/^>\s+/gm, '');

        // Remove horizontal rules (--- or ***)
        formatted = formatted.replace(/^[\-\*]{3,}$/gm, '');

        // Better paragraph handling - preserve intentional line breaks
        // Clean up excessive line breaks (more than 2 consecutive)
        formatted = formatted.replace(/\n{3,}/g, '\n\n');
        
        // Ensure proper spacing between paragraphs
        formatted = formatted.split('\n').map(line => line.trim()).join('\n');
        
        // Add spacing between list items and paragraphs
        formatted = formatted.replace(/([^\n])\n([•\d])/g, '$1\n\n$2');
        formatted = formatted.replace(/([•\d].+)\n([^\n•\d])/g, '$1\n\n$2');

        // Trim whitespace
        formatted = formatted.trim();

        setOutput(formatted);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    // Performance: Debounced AI detection for large texts
    if (newValue) {
      debouncedDetectAI(newValue);
    } else {
      setAiDetected(false);
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

  // Diff calculation helper
  const calculateDiff = useMemo(() => {
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
      <div className={`${isFullScreen ? 'h-full overflow-auto' : 'max-w-6xl mx-auto'}`}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#4a9d6f]" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">AI Text Formatter</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-400 px-4">Remove markdown formatting and convert AI text to clean, human-readable format</p>
        </div>

        {/* Settings Toggle */}
        <div className="flex justify-center mb-4 sm:mb-6 px-4">
          <div className="bg-gray-800/50 rounded-xl shadow-md p-3 sm:p-4 border border-gray-700 flex items-center gap-2 sm:gap-3">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs sm:text-sm font-medium text-gray-300">Auto-format on paste</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoFormat}
                  onChange={(e) => setAutoFormat(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${autoFormat ? 'bg-[#4a9d6f]' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${autoFormat ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-[#4a9d6f] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top text-sm sm:text-base">
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>AI text formatted automatically!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-0">
          {/* Input Section */}
          <div className="bg-gray-800/50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Input (AI Text)</h2>
                {aiDetected && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-[#4a9d6f]/20 text-[#4a9d6f] rounded-full text-xs font-medium border border-[#4a9d6f]/30">
                    <Sparkles className="w-3 h-3" />
                    AI Detected
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-400">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder="Paste your AI-generated text here...&#10;&#10;**Bold text**, *italic*, bullet points, etc. will be cleaned up!"
              className="w-full h-64 sm:h-96 p-3 sm:p-4 border-2 border-gray-600 rounded-xl resize-none focus:border-[#4a9d6f] focus:outline-none transition-colors font-mono text-sm bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Output (Clean Text)</h2>
            </div>

            {/* Find/Replace Panel */}
            {showFindReplace && (
              <div className="mb-4 p-3 sm:p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#4a9d6f]" />
                    Find and Replace
                  </h3>
                  <button
                    onClick={() => setShowFindReplace(false)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Find</label>
                    <input
                      type="text"
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                      placeholder="Text to find..."
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9d6f] bg-gray-900 text-white placeholder-gray-500"
                      onKeyDown={(e) => e.key === 'Enter' && performFindReplace()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Replace</label>
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      placeholder="Replace with..."
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9d6f] bg-gray-900 text-white placeholder-gray-500"
                      onKeyDown={(e) => e.key === 'Enter' && performFindReplace()}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                  <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="rounded bg-gray-900 border-gray-600"
                    />
                    <span className="flex items-center gap-1">
                      <CaseSensitive className="w-3 h-3" />
                      Case sensitive
                    </span>
                  </label>
                  <button
                    onClick={performFindReplace}
                    disabled={!findText || !output}
                    className="px-4 py-2 bg-[#4a9d6f] text-white rounded-lg hover:bg-[#176641] disabled:bg-gray-600 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors"
                  >
                    Replace All
                  </button>
                </div>
              </div>
            )}

            {/* Templates Panel */}
            {showTemplates && (
              <div className="mb-4 p-3 sm:p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#4a9d6f]" />
                    Formatting Templates
                  </h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => {
                        loadConfig(template.config as FormattingConfig);
                        setShowTemplates(false);
                      }}
                      className="p-3 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-left transition-colors"
                    >
                      <div className="font-medium text-xs sm:text-sm text-white">{template.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
                {savedConfigs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-300 mb-2">Saved Configurations</h4>
                    <div className="flex flex-wrap gap-2">
                      {savedConfigs.map((saved, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            loadConfig(saved.config);
                            setShowTemplates(false);
                          }}
                          className="px-3 py-1.5 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs sm:text-sm text-gray-300 transition-colors"
                        >
                          {saved.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Formatting Controls Panel */}
            {showFormattingControls && (
              <div className="mb-4 p-4 sm:p-5 bg-gray-700/50 rounded-xl border border-gray-600 shadow-sm">
                {/* Presets and Reset */}
                <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#4a9d6f]" />
                      Quick Presets
                    </h3>
                    <button
                      onClick={() => {
                        setFontSize(14);
                        setLineHeight(1.6);
                        setParagraphSpacing(1);
                        setWordWrap(true);
                        setShowLineNumbers(false);
                        setDisplayMode('plain');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => {
                        setFontSize(12);
                        setLineHeight(1.4);
                        setParagraphSpacing(0.8);
                      }}
                      className="px-2 sm:px-3 py-2 text-xs font-medium bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] hover:text-[#4a9d6f] transition-colors"
                      title="Compact: Small font, tight spacing"
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => {
                        setFontSize(14);
                        setLineHeight(1.6);
                        setParagraphSpacing(1);
                      }}
                      className="px-2 sm:px-3 py-2 text-xs font-medium bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] hover:text-[#4a9d6f] transition-colors"
                      title="Medium: Balanced settings"
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => {
                        setFontSize(16);
                        setLineHeight(1.8);
                        setParagraphSpacing(1.2);
                      }}
                      className="px-2 sm:px-3 py-2 text-xs font-medium bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] hover:text-[#4a9d6f] transition-colors"
                      title="Large: Big font, spacious"
                    >
                      Large
                    </button>
                    <button
                      onClick={() => {
                        setFontSize(14);
                        setLineHeight(2.2);
                        setParagraphSpacing(1.5);
                      }}
                      className="px-2 sm:px-3 py-2 text-xs font-medium bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] hover:text-[#4a9d6f] transition-colors"
                      title="Spacious: Extra line and paragraph spacing"
                    >
                      Spacious
                    </button>
                  </div>
                </div>

                {/* Section: Display Mode */}
                <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-600">
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#4a9d6f]" />
                    Display Mode
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setDisplayMode('plain')}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        displayMode === 'plain' 
                          ? 'bg-[#4a9d6f] text-white shadow-md' 
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600 hover:border-[#4a9d6f]'
                      }`}
                      title="Plain text view (textarea)"
                    >
                      <FileText className="w-4 h-4 inline mr-1.5" />
                      Plain
                    </button>
                    <button
                      onClick={() => setDisplayMode('formatted')}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        displayMode === 'formatted' 
                          ? 'bg-[#4a9d6f] text-white shadow-md' 
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600 hover:border-[#4a9d6f]'
                      }`}
                      title="Formatted preview with styling"
                    >
                      <Eye className="w-4 h-4 inline mr-1.5" />
                      Formatted
                    </button>
                    <button
                      onClick={() => setDisplayMode('rich')}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        displayMode === 'rich' 
                          ? 'bg-[#4a9d6f] text-white shadow-md' 
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600 hover:border-[#4a9d6f]'
                      }`}
                      title="Rich HTML preview"
                    >
                      <Type className="w-4 h-4 inline mr-1.5" />
                      Rich
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Section: Typography */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Type className="w-4 h-4 text-[#4a9d6f]" />
                      Typography
                    </h3>

                    {/* Font Size */}
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Font Size: <span className="text-[#4a9d6f] font-semibold">{fontSize}px</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                          className="p-1.5 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 transition-colors text-gray-300"
                          title="Decrease font size"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        />
                        <button
                          onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                          className="p-1.5 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 transition-colors text-gray-300"
                          title="Increase font size"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Line Height */}
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Line Height: <span className="text-[#4a9d6f] font-semibold">{lineHeight.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        title="Adjust line spacing"
                      />
                    </div>

                    {/* Paragraph Spacing */}
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Paragraph Spacing: <span className="text-[#4a9d6f] font-semibold">{paragraphSpacing.toFixed(1)}rem</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={paragraphSpacing}
                        onChange={(e) => setParagraphSpacing(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        title="Adjust spacing between paragraphs"
                      />
                    </div>
                  </div>

                  {/* Section: Layout */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#4a9d6f]" />
                      Layout
                    </h3>

                    {/* Word Wrap Toggle */}
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600 flex items-center justify-between">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-300 block">Word Wrap</label>
                        <p className="text-xs text-gray-500 mt-0.5">Wrap long lines</p>
                      </div>
                      <button
                        onClick={() => setWordWrap(!wordWrap)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          wordWrap ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                        }`}
                        title={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            wordWrap ? 'translate-x-5' : 'translate-x-0'
                          } mt-0.5 ml-0.5`}
                        />
                      </button>
                    </div>

                    {/* Line Numbers Toggle */}
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600 flex items-center justify-between">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-300 block">Line Numbers</label>
                        <p className="text-xs text-gray-500 mt-0.5">Show line numbers</p>
                      </div>
                      <button
                        onClick={() => setShowLineNumbers(!showLineNumbers)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          showLineNumbers ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                        }`}
                        title={showLineNumbers ? 'Hide line numbers' : 'Show line numbers'}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            showLineNumbers ? 'translate-x-5' : 'translate-x-0'
                          } mt-0.5 ml-0.5`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Output Display */}
            {renderOutput()}

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

              {/* View Controls */}
              <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
                <button
                  onClick={() => setShowSideBySide(!showSideBySide)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    showSideBySide 
                      ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  title="Side-by-side view"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    showDiff 
                      ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  title="Show diff view"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Full screen mode"
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowFindReplace(!showFindReplace)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Find and Replace"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Templates"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={saveCurrentConfig}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Save configuration"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowFormattingControls(!showFormattingControls)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  showFormattingControls 
                    ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Formatting Options"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4a9d6f] text-white rounded-lg hover:bg-[#176641] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Text Transformations Panel */}
            {output && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#4a9d6f]" />
                  Text Transformations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  <button onClick={() => transformText('sentenceCase')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Sentence case">Sentence Case</button>
                  <button onClick={() => transformText('titleCase')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Title case">Title Case</button>
                  <button onClick={() => transformText('uppercase')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="UPPERCASE"><CaseUpper className="w-3 h-3 inline mr-1" />UPPER</button>
                  <button onClick={() => transformText('lowercase')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="lowercase"><CaseLower className="w-3 h-3 inline mr-1" />lower</button>
                  <button onClick={() => transformText('removeExtraSpaces')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Remove extra spaces">Trim Spaces</button>
                  <button onClick={() => transformText('removeDuplicateLines')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Remove duplicate lines">Remove Duplicates</button>
                  <button onClick={() => transformText('sortLines')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Sort lines alphabetically">Sort Lines</button>
                  <button onClick={() => transformText('reverseLines')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Reverse line order">Reverse Lines</button>
                  <button onClick={() => transformText('removeEmptyLines')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Remove empty lines">Remove Empty</button>
                  <button onClick={() => transformText('trimLines')} className="px-2 sm:px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-[#4a9d6f] text-xs font-medium text-gray-300 transition-colors" title="Trim all lines">Trim Lines</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-4 sm:px-0">
          <button
            onClick={formatText}
            disabled={!input}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#4a9d6f] to-[#176641] text-white rounded-xl font-semibold hover:from-[#176641] hover:to-[#4a9d6f] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            title="Or press Ctrl+Shift+F"
          >
            Format Text
          </button>
          <button
            onClick={clearAll}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 border-2 border-gray-600 transition-all text-sm sm:text-base"
          >
            Clear All
          </button>
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

