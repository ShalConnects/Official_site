import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link2, Copy, Check, ArrowLeftRight, AlertCircle, Info } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

type EncodingMode = 'encode' | 'decode';
type EncodingType = 'full' | 'partial';

export default function URLEncoderDecoder() {
  usePageTitle('URL Encoder/Decoder');
  useMetaTags({
    title: 'URL Encoder/Decoder - Free Tool | ShalConnects',
    description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format and vice versa. Free URL encoding/decoding tool.',
    keywords: 'url encoder, url decoder, percent encoding, url encoding, url decoding, encode url, decode url, free tool',
    ogTitle: 'URL Encoder/Decoder - Free Tool',
    ogDescription: 'Encode and decode URLs instantly. Free URL encoding/decoding tool.',
    ogImage: '/logo.png',
    twitterTitle: 'URL Encoder/Decoder - Free Tool',
    twitterDescription: 'Encode and decode URLs instantly.',
    twitterImage: '/logo.png'
  });

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<EncodingMode>('encode');
  const [encodingType, setEncodingType] = useState<EncodingType>('full');
  const [autoDetect, setAutoDetect] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyFormat, setCopyFormat] = useState<'text' | 'html' | 'code'>('text');
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  // Close copy menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
        setShowCopyMenu(false);
      }
    };

    if (showCopyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCopyMenu]);

  // Auto-detect if input is encoded
  const isEncoded = useMemo(() => {
    if (!input.trim()) return false;
    // Check if input contains percent-encoded patterns
    return /%[0-9A-Fa-f]{2}/.test(input);
  }, [input]);

  // Auto-switch mode based on detection
  React.useEffect(() => {
    if (autoDetect && input.trim()) {
      if (isEncoded && mode !== 'decode') {
        setMode('decode');
      } else if (!isEncoded && mode !== 'encode') {
        setMode('encode');
      }
    }
  }, [input, isEncoded, autoDetect, mode]);

  // Validation function
  const validateInput = useCallback((text: string, isDecode: boolean): { isValid: boolean; error: string | null } => {
    if (!text.trim()) {
      return { isValid: true, error: null };
    }

    if (isDecode) {
      // Check for invalid percent encoding patterns
      const invalidPattern = /%[^0-9A-Fa-f]|%[0-9A-Fa-f][^0-9A-Fa-f]/;
      if (invalidPattern.test(text)) {
        return { isValid: false, error: 'Invalid percent encoding detected. Check for malformed % sequences.' };
      }
      
      // Check for incomplete percent encoding (e.g., %2 or %)
      const incompletePattern = /%[0-9A-Fa-f]?$/;
      if (incompletePattern.test(text)) {
        return { isValid: false, error: 'Incomplete percent encoding at the end of string.' };
      }
    }

    // Check for extremely long input (performance)
    if (text.length > 100000) {
      return { isValid: false, error: 'Input is too long. Maximum length is 100,000 characters.' };
    }

    return { isValid: true, error: null };
  }, []);

  // Debounced processing for large inputs
  const processInput = useCallback((text: string, currentMode: EncodingMode, currentEncodingType: EncodingType) => {
    if (!text.trim()) {
      setError(null);
      setIsProcessing(false);
      return '';
    }

    // Validate input first
    const validation = validateInput(text, currentMode === 'decode');
    if (!validation.isValid) {
      setError(validation.error);
      setIsProcessing(false);
      return '';
    }

    // For very large inputs, show processing indicator
    if (text.length > 10000) {
      setIsProcessing(true);
    }

    try {
      if (currentMode === 'encode') {
        if (currentEncodingType === 'full') {
          // Use encodeURIComponent for full encoding (includes special chars like &, =, etc.)
          const encoded = encodeURIComponent(text);
          setError(null);
          setIsProcessing(false);
          return encoded;
        } else {
          // Use encodeURI for partial encoding (preserves /, ?, =, etc.)
          try {
            const encoded = encodeURI(text);
            setError(null);
            setIsProcessing(false);
            return encoded;
          } catch (e) {
            // If encodeURI fails (invalid characters), fall back to encodeURIComponent
            const encoded = encodeURIComponent(text);
            setError(null);
            setIsProcessing(false);
            return encoded;
          }
        }
      } else {
        // Decode - try both methods with better error handling
        try {
          const decoded = decodeURIComponent(text);
          setError(null);
          setIsProcessing(false);
          return decoded;
        } catch (e) {
          // Try decodeURI as fallback
          try {
            const decoded = decodeURI(text);
            setError(null);
            setIsProcessing(false);
            return decoded;
          } catch (e2) {
            const errorMessage = e instanceof Error ? e.message : 'Invalid encoded string';
            setError(`Decoding failed: ${errorMessage}. The string may contain invalid percent-encoded sequences.`);
            setIsProcessing(false);
            return '';
          }
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
      setError(errorMessage);
      setIsProcessing(false);
      return '';
    }
  }, [validateInput]);

  const [output, setOutput] = useState('');

  // Process input with debouncing for large inputs
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setError(null);
      setIsProcessing(false);
      return;
    }

    // For small inputs, process immediately
    if (input.length < 1000) {
      const result = processInput(input, mode, encodingType);
      setOutput(result);
      return;
    }

    // For larger inputs, debounce with a short delay
    setIsProcessing(true);
    debounceTimerRef.current = setTimeout(() => {
      const result = processInput(input, mode, encodingType);
      setOutput(result);
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [input, mode, encodingType, processInput]);

  const getCopyText = useCallback((format: 'text' | 'html' | 'code'): string => {
    if (!output) return '';
    
    switch (format) {
      case 'html':
        return `<a href="${output}">${output}</a>`;
      case 'code':
        return `\`${output}\``;
      case 'text':
      default:
        return output;
    }
  }, [output]);

  const handleCopy = useCallback(async (format: 'text' | 'html' | 'code' = copyFormat) => {
    if (!output) return;
    
    try {
      const textToCopy = getCopyText(format);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setShowCopyMenu(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [output, copyFormat, getCopyText]);

  const handleClear = useCallback(() => {
    setInput('');
    setError(null);
  }, []);

  const handleSwap = useCallback(() => {
    if (output) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
      setError(null);
    }
  }, [output, mode]);

  // URL Parsing and Analysis
  const urlAnalysis = useMemo(() => {
    if (!output.trim() || mode !== 'decode') return null;
    
    const urlToAnalyze = output.trim();
    
    try {
      const urlObj = new URL(urlToAnalyze);
      
      const queryParams: { [key: string]: string } = {};
      urlObj.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      
      return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || 'default',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : null,
        origin: urlObj.origin,
        href: urlObj.href,
        isValid: true
      };
    } catch (e) {
      // Try to parse as relative URL or partial URL
      try {
        const testUrl = urlToAnalyze.startsWith('http') ? urlToAnalyze : `https://example.com${urlToAnalyze.startsWith('/') ? '' : '/'}${urlToAnalyze}`;
        const urlObj = new URL(testUrl);
        return {
          protocol: 'unknown',
          hostname: 'unknown',
          port: 'unknown',
          pathname: urlObj.pathname,
          search: urlObj.search,
          hash: urlObj.hash,
          queryParams: null,
          origin: 'unknown',
          href: urlToAnalyze,
          isValid: false,
          note: 'Could not fully parse URL. Showing partial analysis.'
        };
      } catch {
        return {
          isValid: false,
          note: 'Not a valid URL format'
        };
      }
    }
  }, [output, mode]);

  return (
    <PageLayout title="Fun Project">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-4 sm:mb-6">
            <Link2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            URL Encoder/Decoder
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Encode URLs to percent-encoded format or decode them back to readable text. Perfect for handling special characters in URLs.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMode('encode')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                mode === 'encode'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                mode === 'decode'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Decode
            </button>
          </div>
          
          {/* Encoding Type Toggle (only show when encoding) */}
          {mode === 'encode' && (
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setEncodingType('full')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  encodingType === 'full'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Full
              </button>
              <button
                onClick={() => setEncodingType('partial')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  encodingType === 'partial'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Partial
              </button>
            </div>
          )}
          
          {/* Auto-detect Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-400">Auto-detect</span>
          </label>
        </div>
        

        {/* Input and Output Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
              {mode === 'encode' ? 'Enter URL or Text to Encode' : 'Enter Encoded URL to Decode'}
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world&lang=en' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den'}
                className="w-full h-32 sm:h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none font-mono text-sm"
              />
              {input && (
                <button
                  onClick={handleClear}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear input"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
              {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
            </label>
            <div className="relative" ref={copyMenuRef}>
              <textarea
                value={output}
                readOnly
                placeholder={mode === 'encode' ? 'Encoded result will appear here...' : 'Decoded result will appear here...'}
                className="w-full h-32 sm:h-40 p-4 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none font-mono text-sm"
              />
              {output && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {/* Copy Format Dropdown Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCopyMenu(!showCopyMenu);
                    }}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700/50"
                    aria-label="Copy options"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  {/* Copy Button */}
                  <button
                    onClick={() => {
                      handleCopy(copyFormat);
                      setShowCopyMenu(false);
                    }}
                    className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-lg"
                    aria-label="Copy"
                    title={copied ? 'Copied!' : 'Copy'}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Copy Format Dropdown */}
                  {showCopyMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                      <button
                        onClick={() => {
                          setCopyFormat('text');
                          handleCopy('text');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-between"
                      >
                        <span>Copy as Text</span>
                        {copyFormat === 'text' && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                      <button
                        onClick={() => {
                          setCopyFormat('html');
                          handleCopy('html');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-between"
                      >
                        <span>Copy as HTML</span>
                        {copyFormat === 'html' && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                      <button
                        onClick={() => {
                          setCopyFormat('code');
                          handleCopy('code');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-between"
                      >
                        <span>Copy as Code</span>
                        {copyFormat === 'code' && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    </div>
                  )}
                </div>
              )}
              {isProcessing && (
                <div className="absolute top-2 right-2 flex items-center gap-2 text-cyan-400 text-xs bg-gray-800/90 px-2 py-1 rounded">
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
            {error && (
              <div className="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Error: {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {output && (
          <div className="flex justify-center gap-4 mb-6 sm:mb-8">
            <button
              onClick={handleSwap}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              aria-label="Swap input and output"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="text-sm">Swap</span>
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              aria-label="Toggle comparison view"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm">{showComparison ? 'Hide' : 'Show'} Comparison</span>
            </button>
          </div>
        )}

        {/* Visual Comparison View */}
        {showComparison && output && (
          <div className="mb-6 sm:mb-8 bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Visual Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Original</label>
                <div className="p-3 bg-gray-900 rounded border border-gray-700 font-mono text-sm text-gray-300 break-all max-h-40 overflow-y-auto">
                  {input || '(empty)'}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Length: {input.length} characters
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {mode === 'encode' ? 'Encoded' : 'Decoded'}
                </label>
                <div className="p-3 bg-gray-900 rounded border border-gray-700 font-mono text-sm text-white break-all max-h-40 overflow-y-auto">
                  {output || '(empty)'}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Length: {output.length} characters
                  {mode === 'encode' && (
                    <span className="ml-2 text-cyan-400">
                      (+{output.length - input.length} chars)
                    </span>
                  )}
                </div>
              </div>
            </div>
            {mode === 'encode' && (
              <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded text-sm text-cyan-300">
                <strong>Encoding Info:</strong> {encodingType === 'full' 
                  ? 'Full encoding - All special characters are encoded' 
                  : 'Partial encoding - Some characters (/, ?, =) are preserved'}
              </div>
            )}
          </div>
        )}


        {/* URL Analysis Section */}
        {urlAnalysis && mode === 'decode' && (
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="flex items-center gap-2 w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Info className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">URL Analysis</span>
              <span className="ml-auto text-gray-400 text-sm">
                {showAnalysis ? 'Hide' : 'Show'}
              </span>
            </button>
            
            {showAnalysis && (
              <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                {urlAnalysis.isValid ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm">Protocol:</span>
                      <div className="text-white font-mono text-sm mt-1">{urlAnalysis.protocol}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Hostname:</span>
                      <div className="text-white font-mono text-sm mt-1">{urlAnalysis.hostname}</div>
                    </div>
                    {urlAnalysis.port !== 'default' && (
                      <div>
                        <span className="text-gray-400 text-sm">Port:</span>
                        <div className="text-white font-mono text-sm mt-1">{urlAnalysis.port}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 text-sm">Path:</span>
                      <div className="text-white font-mono text-sm mt-1 break-all">{urlAnalysis.pathname || '/'}</div>
                    </div>
                    {urlAnalysis.search && (
                      <div>
                        <span className="text-gray-400 text-sm">Query String:</span>
                        <div className="text-white font-mono text-sm mt-1 break-all">{urlAnalysis.search}</div>
                      </div>
                    )}
                    {urlAnalysis.queryParams && (
                      <div>
                        <span className="text-gray-400 text-sm">Query Parameters:</span>
                        <div className="mt-2 space-y-1">
                          {Object.entries(urlAnalysis.queryParams).map(([key, value]) => (
                            <div key={key} className="flex flex-wrap gap-2 text-sm">
                              <span className="text-cyan-400 font-mono">{key}:</span>
                              <span className="text-white font-mono break-all">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {urlAnalysis.hash && (
                      <div>
                        <span className="text-gray-400 text-sm">Hash/Fragment:</span>
                        <div className="text-white font-mono text-sm mt-1 break-all">{urlAnalysis.hash}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 text-sm">Full URL:</span>
                      <div className="text-white font-mono text-xs mt-1 break-all">{urlAnalysis.href}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    {urlAnalysis.note || 'Unable to parse URL'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-4 text-white">How it works</h3>
          <div className="space-y-3 text-gray-400 text-sm sm:text-base">
            <p>
              <strong className="text-white">Encode:</strong> Converts special characters (spaces, symbols, etc.) to percent-encoded format. 
              For example, a space becomes <code className="bg-gray-900 px-1 py-0.5 rounded">%20</code>.
            </p>
            <p>
              <strong className="text-white">Decode:</strong> Converts percent-encoded characters back to their original form. 
              Useful for reading encoded URLs or fixing malformed encoding.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-4">
              <strong>Note:</strong> This tool uses <code className="bg-gray-900 px-1 py-0.5 rounded">encodeURIComponent</code> for encoding, 
              which encodes all special characters including <code className="bg-gray-900 px-1 py-0.5 rounded">/</code>, <code className="bg-gray-900 px-1 py-0.5 rounded">?</code>, and <code className="bg-gray-900 px-1 py-0.5 rounded">=</code>.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

