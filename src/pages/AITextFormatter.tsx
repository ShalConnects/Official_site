import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, Wand2, Sparkles, Type, Eye, FileText, Minus, Plus, RotateCcw, Minimize2, Search, Replace, Undo2, Redo2, CaseSensitive, CaseLower, CaseUpper, X, ChevronUp, ChevronDown, Regex, Bold, Italic, Underline, Strikethrough, Star, Brain, Settings, BarChart3, Trash2, Download } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import {
  type DisplayMode,
  type HistoryEntry,
  type FormattingConfig,
  type LearningData,
  EMPTY_LEARNING_DATA,
  escapeHtml,
  formatForRichPreview,
  detectAIText,
} from '../utils/aiTextFormat';
import { formatAiText, type EmDashReplacement } from '../utils/aiTextFormatPipeline';

export default function AITextFormatter() {
  usePageTitle('AI Text Formatter');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [, setCopied] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [, setAiConfidence] = useState(0);
  const [, setAiPatterns] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'formatting' | 'success' | 'copied' | 'correct' | 'incorrect'>('formatting');
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
  
  // Learning system state
  const [learningData, setLearningData] = useState<LearningData>(EMPTY_LEARNING_DATA);
  const learningDataRef = useRef<LearningData>(learningData);
  
  // Keep ref in sync with state
  useEffect(() => {
    learningDataRef.current = learningData;
  }, [learningData]);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [showLearningDataView, setShowLearningDataView] = useState(false);
  const [lastFormattedInput, setLastFormattedInput] = useState('');
  const [lastFormattedOutput, setLastFormattedOutput] = useState('');
  const outputTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isUpdatingLearningDataRef = useRef(false);
  const emDashReplacementsRef = useRef<EmDashReplacement[]>([]);
  
  // New formatting options state
  type SpacingMode = 'compact' | 'standard' | 'spacious';
  type ListStyle = 'bullet' | 'dash' | 'asterisk';
  type NumberedStyle = 'dot' | 'paren' | 'paren2';
  type HeaderSpacing = 'always' | 'never' | 'smart';
  type OutputFormat = 'plain' | 'markdown' | 'html';
  
  const [spacingMode, setSpacingMode] = useState<SpacingMode>('standard');
  const [preserveBold, setPreserveBold] = useState(false);
  const [preserveItalic, setPreserveItalic] = useState(false);
  const [listStyle, setListStyle] = useState<ListStyle>('bullet');
  const [numberedStyle, setNumberedStyle] = useState<NumberedStyle>('dot');
  const [headerSpacing, setHeaderSpacing] = useState<HeaderSpacing>('smart');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('plain');
  const [smartParagraphs, setSmartParagraphs] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Performance: Debounce refs
  const formatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyIndexRef = useRef(-1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Get pattern confidence from learning data (use ref to avoid re-renders)
  const getPatternConfidence = useCallback((patternId: string): number => {
    const patternPerf = learningDataRef.current.patternPerformance.find(p => p.pattern === patternId);
    if (patternPerf && patternPerf.matches > 0) {
      return patternPerf.confidence;
    }
    return 0.5; // Default confidence for new patterns
  }, []);

  // Check if pattern is disabled by user (use ref to avoid re-renders)
  const isPatternDisabled = useCallback((patternId: string): boolean => {
    return learningDataRef.current.userPreferences.disabledPatterns.includes(patternId);
  }, []);



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

  // Load learning data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiFormatterLearningData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLearningData(parsed);
      } catch (e) {
        console.error('Failed to load learning data', e);
      }
    }
  }, []);

  // Save learning data to localStorage
  const saveLearningData = useCallback((data: LearningData) => {
    try {
      localStorage.setItem('aiFormatterLearningData', JSON.stringify(data));
      learningDataRef.current = data; // Update ref immediately
      setLearningData(data); // Update state (for UI updates)
    } catch (e) {
      console.error('Failed to save learning data', e);
    }
  }, []);

  // Track which patterns matched during formatting
  const trackPatternMatches = useCallback((text: string, formatted: string): string[] => {
    const matchedPatterns: string[] = [];
    const originalLines = text.split('\n');
    const formattedLines = formatted.split('\n');
    
    // Compare to find what was removed (likely meta-commentary)
    const originalText = originalLines.join('\n');
    const formattedText = formattedLines.join('\n');
    
    // Find removed sections
    const removedSections = originalText.split(formattedText).filter(s => s.trim().length > 0);
    
    // Check removed sections against known patterns
    const introPatterns = [
      /^(alright|okay|ok)\s+[a-z]+[,\s]/i,
      /^here'?s\s+(a|the|your)\s+(tightened|cleaned|short|punchy|corporate|version|draft)/i,
      /^say\s+less/i,
      /^here\s+you\s+go/i,
    ];
    
    const closingPatterns = [
      /^if\s+you\s+want/i,
      /^let\s+me\s+know\s+if/i,
      /^i\s+can\s+(also\s+)?make\s+it\s+more/i,
      /^make\s+it\s+more\s+(casual|formal|concise|punchy|professional)/i,
    ];
    
    removedSections.forEach(section => {
      const lines = section.split('\n');
      lines.forEach(line => {
        introPatterns.forEach((pattern, idx) => {
          if (pattern.test(line.trim())) {
            matchedPatterns.push(`intro-${idx}`);
          }
        });
        closingPatterns.forEach((pattern, idx) => {
          if (pattern.test(line.trim())) {
            matchedPatterns.push(`closing-${idx}`);
          }
        });
      });
    });
    
    // Track em dash replacements
    const emDashReplacements = emDashReplacementsRef.current;
    if (emDashReplacements && emDashReplacements.length > 0) {
      emDashReplacements.forEach((replacement, idx) => {
        matchedPatterns.push(`emdash-${replacement.context}-${idx}`);
      });
    }
    
    return matchedPatterns;
  }, []);

  // Learn from user corrections
  const learnFromCorrection = useCallback((originalOutput: string, correctedOutput: string, matchedPatterns: string[]) => {
    if (!originalOutput || !correctedOutput || originalOutput === correctedOutput) return;
    
    const updatedData = { ...learningData };
    
    // Find what was added back (false positive - pattern incorrectly removed content)
    const addedBack = correctedOutput.length > originalOutput.length ? 
      correctedOutput.replace(originalOutput, '').trim() : '';
    
    // Find what was removed (false negative - pattern missed meta-commentary)
    const removed = originalOutput.length > correctedOutput.length ?
      originalOutput.replace(correctedOutput, '').trim() : '';
    
    // Update pattern performance
    matchedPatterns.forEach(patternId => {
      const existing = updatedData.patternPerformance.find(p => p.pattern === patternId);
      
      // Check if this is an em dash pattern
      const isEmDashPattern = patternId.startsWith('emdash-');
      
      if (addedBack && existing) {
        // Pattern incorrectly matched - false positive
        existing.incorrectMatches += 1;
        existing.matches += 1;
        existing.confidence = existing.correctMatches / (existing.matches || 1);
      } else if (removed && existing) {
        // Pattern should have matched but didn't - false negative
        existing.matches += 1;
        existing.correctMatches += 1;
        existing.confidence = existing.correctMatches / existing.matches;
      } else if (existing) {
        // Pattern correctly matched
        existing.matches += 1;
        existing.correctMatches += 1;
        existing.confidence = existing.correctMatches / existing.matches;
        existing.lastUsed = Date.now();
      } else {
        // New pattern
        const parts = patternId.split('-');
        let type: 'intro' | 'closing' | 'keyword' | 'emdash' = 'keyword';
        if (isEmDashPattern) {
          type = 'emdash';
        } else if (parts[0] === 'intro') {
          type = 'intro';
        } else if (parts[0] === 'closing') {
          type = 'closing';
        }
        
        updatedData.patternPerformance.push({
          pattern: patternId,
          type: type,
          matches: 1,
          correctMatches: removed ? 1 : 0,
          incorrectMatches: addedBack ? 1 : 0,
          lastUsed: Date.now(),
          confidence: removed ? 1 : 0.5
        });
      }
    });
    
    // Save correction for analysis
    if (addedBack || removed) {
      // Extract em dash replacements for this correction
      const emDashReplacements = emDashReplacementsRef.current || [];
      const emDashPatterns = matchedPatterns.filter(p => p.startsWith('emdash-'));
      
      updatedData.userCorrections.push({
        originalText: originalOutput,
        correctedText: correctedOutput,
        removedPatterns: removed ? matchedPatterns : [],
        keptPatterns: addedBack ? matchedPatterns : [],
        timestamp: Date.now(),
        emDashReplacements: emDashPatterns.length > 0 ? emDashReplacements : undefined
      });
      
      // Keep only last 100 corrections
      if (updatedData.userCorrections.length > 100) {
        updatedData.userCorrections = updatedData.userCorrections.slice(-100);
      }
    }
    
    updatedData.lastUpdated = Date.now();
    saveLearningData(updatedData);
  }, [learningData, saveLearningData]);

  // Detect output changes and learn from corrections
  useEffect(() => {
    if (!lastFormattedOutput || !output || output === lastFormattedOutput) return;
    
    // User has edited the output - learn from the correction
    const matchedPatterns = trackPatternMatches(lastFormattedInput, lastFormattedOutput);
    learnFromCorrection(lastFormattedOutput, output, matchedPatterns);
  }, [output, lastFormattedOutput, lastFormattedInput, trackPatternMatches, learnFromCorrection]);

  // Handle explicit feedback
  const handleFeedback = useCallback((feedback: 'correct' | 'incorrect', e?: React.MouseEvent) => {
    // Prevent any event propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (!lastFormattedInput || !lastFormattedOutput) {
      return;
    }
    
    // Set flag to prevent handleInputChange from triggering during update
    // Set it immediately before any async operations
    isUpdatingLearningDataRef.current = true;
    
    // Use requestAnimationFrame to defer the update and prevent re-render side effects
    requestAnimationFrame(() => {
      // Use the ref to get current data without causing re-renders
      const currentData = learningDataRef.current;
      const matchedPatterns = trackPatternMatches(lastFormattedInput, lastFormattedOutput);
      const updatedData = { ...currentData };
      let learnedSomething = false;
      
      if (matchedPatterns.length > 0) {
        matchedPatterns.forEach(patternId => {
          // Find or create pattern performance entry
          let patternPerf = updatedData.patternPerformance.find(p => p.pattern === patternId);
          
          if (!patternPerf) {
            const parts = patternId.split('-');
            let type: 'intro' | 'closing' | 'keyword' | 'emdash' = 'keyword';
            if (patternId.startsWith('emdash-')) {
              type = 'emdash';
            } else if (parts[0] === 'intro') {
              type = 'intro';
            } else if (parts[0] === 'closing') {
              type = 'closing';
            }
            patternPerf = {
              pattern: patternId,
              type: type,
              matches: 0,
              correctMatches: 0,
              incorrectMatches: 0,
              lastUsed: Date.now(),
              confidence: 0.5
            };
            updatedData.patternPerformance.push(patternPerf);
          }
          
          // Update based on feedback
          patternPerf.matches += 1;
          if (feedback === 'correct') {
            patternPerf.correctMatches += 1;
          } else {
            patternPerf.incorrectMatches += 1;
          }
          patternPerf.confidence = patternPerf.correctMatches / patternPerf.matches;
          patternPerf.lastUsed = Date.now();
          learnedSomething = true;
          
          // Add to feedback history
          updatedData.patternFeedback.push({
            pattern: patternId,
            type: patternPerf.type,
            feedback,
            context: lastFormattedInput.substring(0, 100), // First 100 chars for context
            timestamp: Date.now()
          });
        });
      } else {
        // No patterns matched, but still record general feedback
        updatedData.patternFeedback.push({
          pattern: 'general',
          type: 'intro',
          feedback,
          context: lastFormattedInput.substring(0, 100),
          timestamp: Date.now()
        });
      }
      
      // Keep only last 200 feedback entries
      if (updatedData.patternFeedback.length > 200) {
        updatedData.patternFeedback = updatedData.patternFeedback.slice(-200);
      }
      
      updatedData.lastUpdated = Date.now();
      
      // Update ref immediately
      learningDataRef.current = updatedData;
      
      // Save to localStorage without triggering state update immediately
      try {
        localStorage.setItem('aiFormatterLearningData', JSON.stringify(updatedData));
      } catch (e) {
        console.error('Failed to save learning data', e);
      }
      
      // Update state in next tick to avoid re-render during button click
      setTimeout(() => {
        setLearningData(updatedData);
        // Clear flag after state update completes
        setTimeout(() => {
          isUpdatingLearningDataRef.current = false;
        }, 50);
      }, 100);
      
      // Show feedback confirmation only if we learned something or got general feedback
      if (learnedSomething || matchedPatterns.length === 0) {
        setNotificationType(feedback === 'correct' ? 'correct' : 'incorrect');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
    });
  }, [lastFormattedInput, lastFormattedOutput, trackPatternMatches]);

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
    const text = textToFormat !== undefined ? textToFormat : input;
    if (!text) {
      setOutput('');
      return;
    }
    try {
      const style = {
        listStyle,
        numberedStyle,
        headerSpacing,
        spacingMode,
        preserveBold,
        preserveItalic,
        smartParagraphs,
        outputFormat,
      };
      const learning = {
        getPatternConfidence,
        isPatternDisabled,
        learningData: learningDataRef.current,
      };
      const result = formatAiText(text, style, learning);
      emDashReplacementsRef.current = result.emDashReplacements;
      setLastFormattedInput(text);
      setLastFormattedOutput(result.text);
      setOutput(result.text);
      addToHistory(text, result.text);
    } catch (error) {
      console.error('Error formatting text:', error);
      setOutput(text);
    }
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
            className="w-full h-48 sm:h-64 md:h-96 p-2.5 sm:p-3 md:p-4 border-2 border-gray-600 rounded-lg sm:rounded-xl bg-gray-900 overflow-y-auto text-white"
            style={baseStyle}
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
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(formatForRichPreview(output)) }}
            />
          </div>
        );
      case 'formatted':
        return (
          <div
            className="w-full h-48 sm:h-64 md:h-96 p-2.5 sm:p-3 md:p-4 border-2 border-gray-600 rounded-lg sm:rounded-xl bg-gray-900 overflow-y-auto font-sans text-white"
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
            <div className="relative w-full h-48 sm:h-64 md:h-96 border-2 border-gray-600 rounded-lg sm:rounded-xl bg-gray-900 overflow-hidden">
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
            className="w-full h-48 sm:h-64 md:h-96 p-2.5 sm:p-3 md:p-4 border-2 border-gray-600 rounded-lg sm:rounded-xl resize-none bg-gray-900 font-mono text-xs sm:text-sm text-white placeholder-gray-500"
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
    
    // Ignore if we're updating learning data (prevents false triggers)
    if (isUpdatingLearningDataRef.current) {
      // Restore the original value to prevent textarea from being cleared
      if (textareaRef.current && textareaRef.current.value !== input) {
        textareaRef.current.value = input || output || '';
      }
      return;
    }
    
    // Ignore if the change is clearing the textarea and we have existing content
    // This prevents accidental clears during re-renders
    if (newValue.length === 0 && (input.length > 0 || output.length > 0)) {
      // Restore the original value immediately
      const restoreValue = output || input || '';
      if (textareaRef.current) {
        // Use requestAnimationFrame to restore after React's render cycle
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.value = restoreValue;
            // Trigger a synthetic event to keep React in sync
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(textareaRef.current, restoreValue);
              const event = new Event('input', { bubbles: true });
              textareaRef.current.dispatchEvent(event);
            }
          }
        });
      }
      return;
    }
    
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

  const mainContent = (
    <div className={`${isFullScreen ? 'p-2 sm:p-4' : 'p-3 sm:p-4 md:p-6'}`}>
      <div className={`${isFullScreen ? 'h-full overflow-auto' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {/* Notification */}
        {showNotification && (
          <div 
            className={`fixed top-2 right-2 sm:top-4 sm:right-4 left-2 sm:left-auto px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-xs sm:text-sm md:text-base transition-all duration-300 transform ${
              notificationType === 'formatting' 
                ? 'bg-[#da651e] text-white animate-pulse translate-x-0' 
                : notificationType === 'correct'
                ? 'bg-green-500 text-white translate-x-0 animate-[slideIn_0.3s_ease-out]'
                : notificationType === 'incorrect'
                ? 'bg-amber-500 text-white translate-x-0 animate-[slideIn_0.3s_ease-out]'
                : 'bg-[#4a9d6f] text-white translate-x-0 animate-[slideIn_0.3s_ease-out]'
            }`}
            style={{
              animation: notificationType === 'formatting' 
                ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' 
                : notificationType === 'success' || notificationType === 'copied' || notificationType === 'correct' || notificationType === 'incorrect'
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
            ) : notificationType === 'correct' ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" style={{ animation: 'checkmarkPop 0.5s ease-out' }} />
                <span>Feedback recorded: Formatting was correct ✓</span>
              </>
            ) : notificationType === 'incorrect' ? (
              <>
                <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ animation: 'checkmarkPop 0.5s ease-out' }} />
                <span>Feedback recorded: Formatting needs improvement</span>
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
        <div className="px-2 sm:px-4 md:px-0">
          <div className="bg-gray-800/50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0 mb-0" style={{ padding: '0px 0 10px' }}>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-0">
                  {output ? 'Formatted Text' : 'AI Text Formatter'}
                </h2>
                {output && (
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-[10px] sm:text-xs font-medium border border-gray-600 transition-colors"
                    title={showOriginal ? 'Show formatted text' : 'Show original text'}
                  >
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">{showOriginal ? 'Original' : 'Formatted'}</span>
                  </button>
                )}
                {aiDetected && (
                  <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#4a9d6f]/20 text-[#4a9d6f] rounded-full text-[10px] sm:text-xs font-medium border border-[#4a9d6f]/30">
                    <Sparkles className="w-3 h-3" />
                    <span className="hidden sm:inline">AI Detected</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end sm:justify-start">
                {output && (
                  <>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy formatted text"
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 rounded-lg transition-colors"
                      title="Clear all text"
                    >
                      <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    {/* Learning Feedback Buttons */}
                    {lastFormattedOutput && output === lastFormattedOutput && (
                      <div className="flex items-center gap-1 border-l border-gray-600 pl-2 ml-1">
                        <button
                          type="button"
                          onClick={(e) => handleFeedback('correct', e)}
                          onMouseDown={(e) => e.preventDefault()}
                          className="p-1 sm:p-1.5 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Formatting was correct"
                        >
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleFeedback('incorrect', e)}
                          onMouseDown={(e) => e.preventDefault()}
                          className="p-1 sm:p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Formatting needs improvement"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    )}
                    {/* Learning Panel Toggle */}
                    <button
                      onClick={() => setShowLearningPanel(!showLearningPanel)}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 rounded-lg transition-colors"
                      title="View learning insights"
                    >
                      <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </>
                )}
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-400">{(output || input).length} chars</span>
              </div>
            </div>

            {/* Learning Panel */}
            {showLearningPanel && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Learning Insights
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Export learning data as JSON file
                        const dataStr = JSON.stringify(learningData, null, 2);
                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `ai-formatter-learning-data-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                      title="Download learning data as JSON"
                    >
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                      onClick={() => setShowLearningDataView(!showLearningDataView)}
                      className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                      title="View raw learning data"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => setShowLearningPanel(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300">Patterns Learned</span>
                      <span className="text-gray-400">{learningData.patternPerformance.length}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300">User Corrections</span>
                      <span className="text-gray-400">{learningData.userCorrections.length}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300">Feedback Received</span>
                      <span className="text-gray-400">{learningData.patternFeedback.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Updated</span>
                      <span className="text-gray-400">
                        {learningData.lastUpdated ? new Date(learningData.lastUpdated).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Raw Data View */}
                  {showLearningDataView && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="mb-2">
                        <span className="text-gray-300 font-medium">Raw Learning Data</span>
                      </div>
                      <div className="bg-gray-900 rounded p-2 max-h-64 overflow-auto">
                        <pre className="text-[10px] text-gray-400 whitespace-pre-wrap break-words">
                          {JSON.stringify(learningData, null, 2)}
                        </pre>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(learningData, null, 2));
                          setNotificationType('copied');
                          setShowNotification(true);
                          setTimeout(() => setShowNotification(false), 2000);
                        }}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy JSON
                      </button>
                    </div>
                  )}
                  
                  {/* Feedback History */}
                  {learningData.patternFeedback.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="mb-2">
                        <span className="text-gray-300 font-medium">Recent Feedback</span>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {learningData.patternFeedback
                          .slice(-5)
                          .reverse()
                          .map((feedback, idx) => (
                            <div key={idx} className="text-gray-400 text-[10px]">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                  feedback.feedback === 'correct' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {feedback.feedback === 'correct' ? '✓' : '✗'}
                                </span>
                                <span className="truncate flex-1">{feedback.pattern}</span>
                                <span className="text-gray-500">
                                  {new Date(feedback.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {learningData.patternPerformance.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-medium">Top Patterns</span>
                        <button
                          onClick={() => {
                            if (confirm('Reset all learning data? This cannot be undone.')) {
                              const resetData: LearningData = {
                                patternPerformance: [],
                                userCorrections: [],
                                patternFeedback: [],
                                userPreferences: {
                                  preferredPatterns: [],
                                  disabledPatterns: [],
                                  domainPreferences: {}
                                },
                                lastUpdated: Date.now()
                              };
                              saveLearningData(resetData);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                          title="Reset learning data"
                        >
                          <Trash2 className="w-3 h-3" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {learningData.patternPerformance
                          .sort((a, b) => b.confidence - a.confidence)
                          .slice(0, 5)
                          .map((perf) => {
                            // Format pattern name for display
                            let displayName = perf.pattern;
                            if (perf.type === 'emdash') {
                              const parts = perf.pattern.split('-');
                              if (parts.length >= 2) {
                                const context = parts[1]; // sentence, list, parenthetical, other
                                displayName = `Em Dash (${context})`;
                              } else {
                                displayName = 'Em Dash Replacement';
                              }
                            } else if (perf.type === 'intro') {
                              displayName = `Intro: ${perf.pattern}`;
                            } else if (perf.type === 'closing') {
                              displayName = `Closing: ${perf.pattern}`;
                            }
                            
                            return (
                              <div key={perf.pattern} className="flex items-center justify-between text-gray-400">
                                <span className="truncate flex-1" title={perf.pattern}>{displayName}</span>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-xs">
                                    {Math.round(perf.confidence * 100)}%
                                  </span>
                                  <button
                                    onClick={() => {
                                      const updated = { ...learningData };
                                      if (updated.userPreferences.disabledPatterns.includes(perf.pattern)) {
                                        updated.userPreferences.disabledPatterns = 
                                          updated.userPreferences.disabledPatterns.filter(p => p !== perf.pattern);
                                      } else {
                                        updated.userPreferences.disabledPatterns.push(perf.pattern);
                                      }
                                      saveLearningData(updated);
                                    }}
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      learningData.userPreferences.disabledPatterns.includes(perf.pattern)
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-green-500/20 text-green-400'
                                    }`}
                                  >
                                    {learningData.userPreferences.disabledPatterns.includes(perf.pattern) ? 'Disabled' : 'Active'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    className={`w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] p-2.5 sm:p-3 md:p-4 border-2 border-gray-600 rounded-lg sm:rounded-xl resize-none focus:border-[#4a9d6f] focus:outline-none transition-colors font-mono text-xs sm:text-sm bg-gray-900 text-white placeholder-gray-500 ${
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
                      className="absolute inset-0 pointer-events-none overflow-auto rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 font-mono text-xs sm:text-sm whitespace-pre-wrap break-words text-white"
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
                <p className="text-gray-400 mt-2 text-center text-[10px] sm:text-xs">Remove markdown formatting and convert AI text to clean, human-readable format</p>
              </>
            ) : (
              renderOutput()
            )}

            {/* Find/Replace Panel */}
            {showFindReplace && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-lg sm:rounded-xl shadow-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-600/50">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-200 uppercase tracking-wide">Find</label>
                    <div className="relative group">
                      <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4a9d6f] transition-colors">
                        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                        className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 border-2 border-gray-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#4a9d6f] focus:ring-2 focus:ring-[#4a9d6f]/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all duration-200"
                      />
                      <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1 bg-gray-800/50 rounded px-0.5 sm:px-1">
                        <button
                          onClick={findPrevious}
                          disabled={totalMatches === 0}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded"
                          title="Previous (Shift+Enter)"
                        >
                          <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button
                          onClick={findNext}
                          disabled={totalMatches === 0}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-[#4a9d6f] hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded"
                          title="Next (Enter)"
                        >
                          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-200 uppercase tracking-wide">Replace</label>
                    <div className="relative group">
                      <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4a9d6f] transition-colors">
                        <Replace className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                        className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 border-2 border-gray-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#4a9d6f] focus:ring-2 focus:ring-[#4a9d6f]/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                    <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-200 cursor-pointer group">
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
                    <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-200 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={wholeWord}
                          onChange={(e) => setWholeWord(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          wholeWord 
                            ? 'bg-[#4a9d6f] border-[#4a9d6f]' 
                            : 'bg-gray-900 border-gray-600 group-hover:border-gray-500'
                        }`}>
                          {wholeWord && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                        </div>
                      </div>
                      <span>Whole word</span>
                    </label>
                    <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-200 cursor-pointer group">
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-2">
                    {findText && (
                      <div className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5 sm:gap-2">
                        {totalMatches > 0 ? (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800/50 rounded border border-gray-700">
                            {totalMatches} match{totalMatches !== 1 ? 'es' : ''} found
                          </span>
                        ) : (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800/50 rounded border border-gray-700 text-gray-500">
                            No matches found
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <button
                        onClick={replaceCurrent}
                        disabled={!findText || !output || matchIndex === -1}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-[#4a9d6f] text-white rounded-lg hover:bg-[#176641] disabled:bg-gray-600 disabled:cursor-not-allowed text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
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
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-[#4a9d6f] text-white rounded-lg hover:bg-[#176641] disabled:bg-gray-600 disabled:cursor-not-allowed text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        <span className="hidden sm:inline">Replace & Next</span>
                        <span className="sm:hidden">R&N</span>
                      </button>
                      <button
                        onClick={performFindReplace}
                        disabled={!findText || !output}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#da651e] to-[#c55a1a] text-white rounded-lg hover:from-[#b8541a] hover:to-[#a04915] disabled:bg-gray-600 disabled:cursor-not-allowed text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        Replace All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formatting Controls Panel */}
            {showFormattingControls && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-lg sm:rounded-xl shadow-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-600/50">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white">
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
                <div className="space-y-2 sm:space-y-3">
                  {/* Display Mode & Presets Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Display Mode</label>
                      <div className="flex gap-1 sm:gap-1.5">
                        <button
                          onClick={() => setDisplayMode('plain')}
                          className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
                            displayMode === 'plain' 
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Plain
                        </button>
                        <button
                          onClick={() => setDisplayMode('formatted')}
                          className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
                            displayMode === 'formatted' 
                              ? 'bg-[#4a9d6f] text-white' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                          }`}
                        >
                          Formatted
                        </button>
                        <button
                          onClick={() => setDisplayMode('rich')}
                          className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
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
                      <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Presets</label>
                      <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                        <button
                          onClick={() => {
                            setFontSize(12);
                            setLineHeight(1.4);
                            setParagraphSpacing(0.8);
                          }}
                          className={`flex-1 min-w-[60px] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
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
                          className={`flex-1 min-w-[60px] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
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
                          className={`flex-1 min-w-[60px] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
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
                          className={`flex-1 min-w-[60px] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                    {/* Font Size */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] sm:text-[10px] text-gray-400">Font Size</span>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-[#4a9d6f]">{fontSize}px</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <button
                          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                          className="p-0.5 sm:p-1 bg-gray-900 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-gray-300"
                          aria-label="Decrease font size"
                        >
                          <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="flex-1 h-1 sm:h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                          aria-label="Font size"
                        />
                        <button
                          onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                          className="p-0.5 sm:p-1 bg-gray-900 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-gray-300"
                          aria-label="Increase font size"
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Height */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] sm:text-[10px] text-gray-400">Line Height</span>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-[#4a9d6f]">{lineHeight.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full h-1 sm:h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        aria-label="Line height"
                      />
                    </div>

                    {/* Paragraph Spacing */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] sm:text-[10px] text-gray-400">Para Spacing</span>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-[#4a9d6f]">{paragraphSpacing.toFixed(1)}rem</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={paragraphSpacing}
                        onChange={(e) => setParagraphSpacing(Number(e.target.value))}
                        className="w-full h-1 sm:h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4a9d6f]"
                        aria-label="Paragraph spacing"
                      />
                    </div>
                  </div>

                  {/* Layout Options - Inline */}
                  <div className="flex items-center gap-2 sm:gap-3 pt-1 border-t border-gray-700/50 flex-wrap">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[9px] sm:text-[10px] text-gray-400">Word Wrap</span>
                      <button
                        onClick={() => setWordWrap(!wordWrap)}
                        className={`relative w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${
                          wordWrap ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={wordWrap}
                        aria-label="Toggle word wrap"
                      >
                        <div
                          className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            wordWrap ? 'translate-x-[18px] sm:translate-x-[22px]' : 'translate-x-0.5'
                          } top-0.5`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[9px] sm:text-[10px] text-gray-400">Line Numbers</span>
                      <button
                        onClick={() => setShowLineNumbers(!showLineNumbers)}
                        className={`relative w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${
                          showLineNumbers ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={showLineNumbers}
                        aria-label="Toggle line numbers"
                      >
                        <div
                          className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            showLineNumbers ? 'translate-x-[18px] sm:translate-x-[22px]' : 'translate-x-0.5'
                          } top-0.5`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Advanced Options Section */}
                  <div className="pt-2 sm:pt-3 border-t border-gray-700/50">
                    <button
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="w-full flex items-center justify-between text-[10px] sm:text-xs font-semibold text-gray-300 hover:text-white transition-colors mb-1.5 sm:mb-2"
                    >
                      <span>Advanced Formatting Options</span>
                      <span className="text-gray-500">{showAdvancedOptions ? '−' : '+'}</span>
                    </button>
                    
                    {showAdvancedOptions && (
                      <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-3">
                        {/* Spacing Mode */}
                        <div>
                          <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Spacing Mode</label>
                          <div className="flex gap-1 sm:gap-1.5">
                            {(['compact', 'standard', 'spacious'] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => setSpacingMode(mode)}
                                className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all capitalize ${
                                  spacingMode === mode
                                    ? 'bg-[#4a9d6f] text-white'
                                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Header Spacing */}
                        <div>
                          <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Header Spacing</label>
                          <div className="flex gap-1 sm:gap-1.5">
                            {(['always', 'never', 'smart'] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => setHeaderSpacing(mode)}
                                className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all capitalize ${
                                  headerSpacing === mode
                                    ? 'bg-[#4a9d6f] text-white'
                                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* List Style */}
                        <div>
                          <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Bullet List Style</label>
                          <div className="flex gap-1 sm:gap-1.5">
                            {(['bullet', 'dash', 'asterisk'] as const).map((style) => (
                              <button
                                key={style}
                                onClick={() => setListStyle(style)}
                                className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all capitalize ${
                                  listStyle === style
                                    ? 'bg-[#4a9d6f] text-white'
                                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                                }`}
                              >
                                {style === 'bullet' ? '•' : style === 'dash' ? '−' : '*'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Numbered List Style */}
                        <div>
                          <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Numbered List Style</label>
                          <div className="flex gap-1 sm:gap-1.5">
                            {(['dot', 'paren', 'paren2'] as const).map((style) => (
                              <button
                                key={style}
                                onClick={() => setNumberedStyle(style)}
                                className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
                                  numberedStyle === style
                                    ? 'bg-[#4a9d6f] text-white'
                                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                                }`}
                              >
                                {style === 'dot' ? '1.' : style === 'paren' ? '1)' : '(1)'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Output Format */}
                        <div>
                          <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Output Format</label>
                          <div className="flex gap-1 sm:gap-1.5">
                            {(['plain', 'markdown', 'html'] as const).map((format) => (
                              <button
                                key={format}
                                onClick={() => setOutputFormat(format)}
                                className={`flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-[11px] font-medium transition-all capitalize ${
                                  outputFormat === format
                                    ? 'bg-[#4a9d6f] text-white'
                                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-600'
                                }`}
                              >
                                {format}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Formatting Preservation */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <label className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1 sm:mb-1.5 uppercase tracking-wide">Preserve Formatting</label>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[9px] sm:text-[10px] text-gray-400">Bold</span>
                            <button
                              onClick={() => setPreserveBold(!preserveBold)}
                              className={`relative w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${
                                preserveBold ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                              }`}
                              role="switch"
                              aria-checked={preserveBold}
                            >
                              <div
                                className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                  preserveBold ? 'translate-x-[18px] sm:translate-x-[22px]' : 'translate-x-0.5'
                                } top-0.5`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[9px] sm:text-[10px] text-gray-400">Italic</span>
                            <button
                              onClick={() => setPreserveItalic(!preserveItalic)}
                              className={`relative w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${
                                preserveItalic ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                              }`}
                              role="switch"
                              aria-checked={preserveItalic}
                            >
                              <div
                                className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                  preserveItalic ? 'translate-x-[18px] sm:translate-x-[22px]' : 'translate-x-0.5'
                                } top-0.5`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Smart Paragraphs */}
                        <div className="flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-gray-700/50">
                          <span className="text-[9px] sm:text-[10px] text-gray-400">Smart Paragraphs</span>
                          <button
                            onClick={() => setSmartParagraphs(!smartParagraphs)}
                            className={`relative w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${
                              smartParagraphs ? 'bg-[#4a9d6f]' : 'bg-gray-600'
                            }`}
                            role="switch"
                            aria-checked={smartParagraphs}
                          >
                            <div
                              className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                smartParagraphs ? 'translate-x-[18px] sm:translate-x-[22px]' : 'translate-x-0.5'
                              } top-0.5`}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar at Bottom */}
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 flex-wrap mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
              {/* History Controls */}
              <div className="flex items-center gap-0.5 sm:gap-1 border-r border-gray-600 pr-1 sm:pr-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-1 sm:p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1 sm:p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  const newState = !showFindReplace;
                  setShowFindReplace(newState);
                  if (newState) {
                    setShowFormattingControls(false);
                  }
                }}
                className={`p-1 sm:p-1.5 md:p-2 rounded-lg transition-colors ${
                  showFindReplace 
                    ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Find and Replace"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => {
                  const newState = !showFormattingControls;
                  setShowFormattingControls(newState);
                  if (newState) {
                    setShowFindReplace(false);
                  }
                }}
                className={`p-1 sm:p-1.5 md:p-2 rounded-lg transition-colors ${
                  showFormattingControls 
                    ? 'bg-[#4a9d6f]/20 text-[#4a9d6f]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Formatting Options"
              >
                <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Text Formatting Toolbar - only show when output exists */}
              {output && (
                <div className="flex items-center gap-0.5 sm:gap-1 border-l border-gray-600 pl-1 sm:pl-2 ml-1 sm:ml-2">
                  <button
                    onClick={() => applyTextFormatting('bold')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Bold"
                  >
                    <Bold className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('italic')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Italic"
                  >
                    <Italic className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('underline')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Underline"
                  >
                    <Underline className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('strikethrough')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              )}

              {/* Text Transformations - only show when output exists */}
              {output && (
                <div className="flex items-center gap-0.5 sm:gap-1 border-l border-gray-600 pl-1 sm:pl-2 ml-1 sm:ml-2 flex-wrap">
                  <button
                    onClick={() => transformText('sentenceCase')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Sentence Case"
                  >
                    <span className="text-[9px] sm:text-[10px] font-medium" style={{ lineHeight: 0 }}>Aa</span>
                  </button>
                  <button
                    onClick={() => transformText('titleCase')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="Title Case"
                  >
                    <span className="text-[9px] sm:text-[10px] font-medium" style={{ lineHeight: 0 }}>Aa B</span>
                  </button>
                  <button
                    onClick={() => transformText('uppercase')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="UPPERCASE"
                  >
                    <CaseUpper className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => transformText('lowercase')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500"
                    title="lowercase"
                    >
                    <CaseLower className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => transformText('removeExtraSpaces')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500 px-0.5"
                    title="Trim Spaces"
                  >
                    <span className="text-[9px] sm:text-[10px]" style={{ lineHeight: 0 }}>Trim</span>
                  </button>
                  <button
                    onClick={() => transformText('removeEmptyLines')}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors border border-gray-600 hover:border-gray-500 px-0.5"
                    title="Remove Empty Lines"
                  >
                    <span className="text-[9px] sm:text-[10px]" style={{ lineHeight: 0 }}>Empty</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Info Section */}
        <div className="mt-4 sm:mt-6 md:mt-8 bg-gray-800/50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border border-gray-700 mx-2 sm:mx-4 md:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Column 1: What Gets Removed & Future Features */}
            <div className="space-y-4 sm:space-y-6">
            {/* What Gets Removed */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3">What gets removed:</h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                    <span>Markdown formatting (bold, italic, headers)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                    <span>Links, code blocks, blockquotes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4a9d6f] font-bold">✓</span>
                    <span>AI meta-commentary</span>
                </div>
                </div>
                </div>

              {/* Future Features */}
              <div className="pt-4 sm:pt-6 border-t border-gray-700/50">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">Future features:</h3>
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded-full border border-yellow-400/30">Coming Soon</span>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-300 font-medium text-xs sm:text-sm">Full-blown text editor</div>
                      <div className="text-gray-500 text-[10px] sm:text-[11px] mt-0.5">Rich editing experience with formatting tools</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-300 font-medium text-xs sm:text-sm">Templates</div>
                      <div className="text-gray-500 text-[10px] sm:text-[11px] mt-0.5">Email, Blog, Documentation, and more</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Additional Features */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3">Additional features:</h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Spacing & formatting customization</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>List style options (bullet, dash, asterisk)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Output formats (plain, markdown, HTML)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Smart paragraph detection</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>Find & replace, undo/redo</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#da651e] font-bold">⚡</span>
                  <span>AI detection & text transformations</span>
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
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-2 sm:p-3 md:p-4 flex items-center justify-between z-10">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#4a9d6f]" />
          <span className="hidden sm:inline">AI Text Formatter</span>
          <span className="sm:hidden">AI Formatter</span>
        </h1>
        <button
          onClick={() => setIsFullScreen(false)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Exit full screen"
        >
          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      {mainContent}
    </div>
  ) : (
    <PageLayout title="AI Text Formatter" backTo={{ href: '/tools', label: 'Back to Tools' }}>
      {mainContent}
    </PageLayout>
  );
}

