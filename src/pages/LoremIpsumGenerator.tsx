import React, { useState, useCallback, useMemo } from 'react';
import { FileText, Copy, Check, RefreshCw, ChevronDown, Settings, Type } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

const LOREM_IPSUM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis',
  'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum',
  'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non',
  'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum'
];

function generateLoremIpsum(
  paragraphs: number,
  wordsPerParagraph: number,
  startWithLorem: boolean,
  format: 'plain' | 'html' | 'markdown' | 'json' = 'plain',
  variableSentenceLength: boolean = false,
  capitalization: 'sentence' | 'title' | 'uppercase' = 'sentence'
): string {
  const result: string[] = [];
  
  for (let p = 0; p < paragraphs; p++) {
    let paragraphText = '';
    
    if (variableSentenceLength) {
      // Generate sentences with variable length
      let wordsUsed = 0;
      const sentences: string[] = [];
      
      while (wordsUsed < wordsPerParagraph) {
        const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words per sentence
        const remainingWords = wordsPerParagraph - wordsUsed;
        const actualLength = Math.min(sentenceLength, remainingWords);
        
        const sentenceWords: string[] = [];
        
        // First sentence of first paragraph starts with "Lorem ipsum dolor sit amet" if requested
        if (p === 0 && startWithLorem && sentences.length === 0) {
          sentenceWords.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
          for (let w = 5; w < actualLength; w++) {
            const randomWord = LOREM_IPSUM_WORDS[Math.floor(Math.random() * LOREM_IPSUM_WORDS.length)];
            sentenceWords.push(randomWord);
          }
        } else {
          for (let w = 0; w < actualLength; w++) {
            const randomWord = LOREM_IPSUM_WORDS[Math.floor(Math.random() * LOREM_IPSUM_WORDS.length)];
            sentenceWords.push(randomWord);
          }
        }
        
        // Capitalize first word
        if (sentenceWords.length > 0) {
          sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1);
        }
        
        sentences.push(sentenceWords.join(' ') + '.');
        wordsUsed += actualLength;
      }
      
      paragraphText = sentences.join(' ');
    } else {
      // Original paragraph generation
      const paragraphWords: string[] = [];
      
      if (p === 0 && startWithLorem) {
        paragraphWords.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        for (let w = 5; w < wordsPerParagraph; w++) {
          const randomWord = LOREM_IPSUM_WORDS[Math.floor(Math.random() * LOREM_IPSUM_WORDS.length)];
          paragraphWords.push(randomWord);
        }
      } else {
        for (let w = 0; w < wordsPerParagraph; w++) {
          const randomWord = LOREM_IPSUM_WORDS[Math.floor(Math.random() * LOREM_IPSUM_WORDS.length)];
          paragraphWords.push(randomWord);
        }
      }
      
      // Capitalize first word
      if (paragraphWords.length > 0) {
        paragraphWords[0] = paragraphWords[0].charAt(0).toUpperCase() + paragraphWords[0].slice(1);
      }
      
      paragraphText = paragraphWords.join(' ') + '.';
    }
    
    // Apply capitalization style
    switch (capitalization) {
      case 'uppercase':
        paragraphText = paragraphText.toUpperCase();
        break;
      case 'title':
        paragraphText = paragraphText.split(' ').map((word, idx) => {
          if (idx === 0 || word.length > 3) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
          return word.toLowerCase();
        }).join(' ');
        break;
      default:
        // sentence case (already handled)
        break;
    }
    
    result.push(paragraphText);
  }
  
  // Format the output
  switch (format) {
    case 'html':
      return result.map(p => `<p>${p}</p>`).join('\n');
    case 'markdown':
      return result.map(p => `${p}\n`).join('\n');
    case 'json':
      return JSON.stringify(result, null, 2);
    default:
      return result.join('\n\n');
  }
}

export default function LoremIpsumGenerator() {
  usePageTitle('Lorem Ipsum Generator - Placeholder Text Generator');
  
  useMetaTags({
    title: 'Lorem Ipsum Generator - Placeholder Text Generator | ShalConnects',
    description: 'Generate placeholder text for your designs and layouts. Customize paragraphs, words, and sentences.',
    keywords: 'lorem ipsum, placeholder text, dummy text, text generator, lorem ipsum generator',
    ogTitle: 'Lorem Ipsum Generator - Placeholder Text Generator',
    ogDescription: 'Generate placeholder text for your designs and layouts.',
    ogImage: '/logo.png',
    twitterTitle: 'Lorem Ipsum Generator - Placeholder Text Generator',
    twitterDescription: 'Generate placeholder text for your designs and layouts.',
    twitterImage: '/logo.png'
  });

  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [textFormat, setTextFormat] = useState<'plain' | 'html' | 'markdown' | 'json'>('plain');
  const [variableSentenceLength, setVariableSentenceLength] = useState(false);
  const [capitalization, setCapitalization] = useState<'sentence' | 'title' | 'uppercase'>('sentence');
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCapitalizationMenu, setShowCapitalizationMenu] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Small delay for visual feedback
    setTimeout(() => {
      const generated = generateLoremIpsum(paragraphs, wordsPerParagraph, startWithLorem, textFormat, variableSentenceLength, capitalization);
      setText(generated);
      setCopied(false);
      setIsGenerating(false);
    }, 150);
  }, [paragraphs, wordsPerParagraph, startWithLorem, textFormat, variableSentenceLength, capitalization]);

  // Word count calculation
  const wordCount = useMemo(() => {
    if (!text) return 0;
    try {
      let plainText = text;
      if (textFormat === 'json') {
        try {
          const parsed = JSON.parse(text);
          plainText = Array.isArray(parsed) ? parsed.join(' ') : String(parsed);
        } catch {
          plainText = text;
        }
      } else if (textFormat === 'html') {
        plainText = text.replace(/<[^>]*>/g, ' ');
      }
      return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    } catch {
      return 0;
    }
  }, [text, textFormat]);

  // Generate on mount
  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showCopyMenu && !target.closest('.copy-menu-container')) {
        setShowCopyMenu(false);
      }
      if (showCapitalizationMenu && !target.closest('.capitalization-menu-container')) {
        setShowCapitalizationMenu(false);
      }
    };
    if (showCopyMenu || showCapitalizationMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCopyMenu, showCapitalizationMenu]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        handleGenerate();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && event.target instanceof HTMLTextAreaElement) {
        // Allow default copy behavior in textarea
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  const handleCopy = async (format?: 'plain' | 'html' | 'markdown') => {
    if (text) {
      try {
        let textToCopy = text;
        
        if (format) {
          // Convert to requested format
          const plainText = textFormat === 'json' 
            ? JSON.parse(text).join('\n\n')
            : textFormat === 'html'
            ? text.replace(/<p>/g, '').replace(/<\/p>/g, '')
            : textFormat === 'markdown'
            ? text.replace(/\n\n/g, '\n').trim()
            : text;
            
          switch (format) {
            case 'html':
              textToCopy = plainText.split('\n\n').map((p: string) => `<p>${p}</p>`).join('\n');
              break;
            case 'markdown':
              textToCopy = plainText.split('\n\n').map((p: string) => `${p}\n`).join('\n');
              break;
            default:
              textToCopy = plainText;
          }
        }
        
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setShowToast(true);
        setShowCopyMenu(false);
        setTimeout(() => {
          setShowToast(false);
          setCopied(false);
        }, 2000);
      } catch (err) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }
  };

  return (
    <PageLayout title="Lorem Ipsum Generator">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Toast Notification */}
        {showToast && (
          <div 
            className="fixed top-2 right-2 sm:top-4 sm:right-4 left-2 sm:left-auto max-w-[calc(100vw-1rem)] sm:max-w-none px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-xs sm:text-sm md:text-base transition-all duration-300 transform bg-pink-500 text-white translate-x-0 animate-[slideIn_0.3s_ease-out]"
            style={{
              animation: 'slideIn 0.3s ease-out, checkmarkPop 0.5s ease-out 0.2s'
            }}
          >
            <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ animation: 'checkmarkPop 0.5s ease-out' }} />
            <span className="truncate">{copied ? 'Text copied!' : 'Failed to copy'}</span>
          </div>
        )}

        {/* Add CSS animations */}
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
        `}</style>

        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-pink-400 to-rose-600 bg-clip-text text-transparent">
            Lorem Ipsum Generator
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base px-2">
            Generate placeholder text for your designs and layouts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Options */}
          <div className="lg:col-span-1 bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <h2 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
              Options
            </h2>

            <div className="space-y-2 sm:space-y-2.5">
              {/* Paragraphs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    Paragraphs
                  </label>
                  <span className="text-xs sm:text-sm font-semibold text-white bg-gray-700 px-2 py-0.5 rounded">
                    {paragraphs}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              {/* Words per Paragraph */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    Words per Paragraph
                  </label>
                  <span className="text-xs sm:text-sm font-semibold text-white bg-gray-700 px-2 py-0.5 rounded">
                    {wordsPerParagraph}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={wordsPerParagraph}
                  onChange={(e) => setWordsPerParagraph(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  <span>10</span>
                  <span>200</span>
                </div>
              </div>

              {/* Start with Lorem */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={startWithLorem}
                    onChange={(e) => setStartWithLorem(e.target.checked)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-pink-500 focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                    Start with "Lorem ipsum"
                  </span>
                </label>
              </div>

              {/* Variable Sentence Length */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={variableSentenceLength}
                    onChange={(e) => setVariableSentenceLength(e.target.checked)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-pink-500 focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                    Variable sentence length
                  </span>
                </label>
              </div>

              {/* Capitalization */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-1.5 block">
                  Capitalization
                </label>
                <div className="relative capitalization-menu-container">
                  <button
                    type="button"
                    onClick={() => setShowCapitalizationMenu(!showCapitalizationMenu)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-gray-500 transition-colors flex items-center justify-between"
                    aria-label="Select capitalization"
                    aria-expanded={showCapitalizationMenu}
                  >
                    <span>
                      {capitalization === 'sentence' ? 'Sentence Case' : 
                       capitalization === 'title' ? 'Title Case' : 
                       'UPPERCASE'}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                        showCapitalizationMenu ? 'transform rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {showCapitalizationMenu && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden max-w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setCapitalization('sentence');
                          setShowCapitalizationMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors ${
                          capitalization === 'sentence'
                            ? 'bg-pink-500/20 text-pink-400 font-medium'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        Sentence Case
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCapitalization('title');
                          setShowCapitalizationMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors ${
                          capitalization === 'title'
                            ? 'bg-pink-500/20 text-pink-400 font-medium'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        Title Case
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCapitalization('uppercase');
                          setShowCapitalizationMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors ${
                          capitalization === 'uppercase'
                            ? 'bg-pink-500/20 text-pink-400 font-medium'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        UPPERCASE
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm transform hover:scale-105 active:scale-95"
                aria-label="Generate text"
                title="Press Ctrl+G (Cmd+G on Mac) to generate"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </button>
              <p className="text-[10px] text-gray-500 text-center">Press Ctrl+G to generate</p>
            </div>
          </div>

          {/* Generated Text */}
          <div className="lg:col-span-2 bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">Generated Text</span>
                </label>
                {wordCount > 0 && (
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-[10px] sm:text-xs font-medium rounded-full border border-pink-500/30 whitespace-nowrap">
                    {wordCount} words
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="relative copy-menu-container">
                  <button
                    onClick={() => setShowCopyMenu(!showCopyMenu)}
                    className="text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1 text-xs sm:text-sm"
                    aria-label="Copy text"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                  {showCopyMenu && !copied && (
                    <div className="absolute right-0 sm:right-0 left-auto sm:left-auto top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px] max-w-[calc(100vw-2rem)]">
                      <button
                        onClick={() => handleCopy('plain')}
                        className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Copy as Plain Text
                      </button>
                      <button
                        onClick={() => handleCopy('html')}
                        className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Copy as HTML
                      </button>
                      <button
                        onClick={() => handleCopy('markdown')}
                        className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Copy as Markdown
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <textarea
              value={text}
              readOnly
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none leading-relaxed overflow-auto"
              placeholder="Generated lorem ipsum text will appear here..."
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

