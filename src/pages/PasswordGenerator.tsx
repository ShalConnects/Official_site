import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, AlertCircle, History, X } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;
  
  if (!charset) {
    return 'Select at least one character type';
  }
  
  // Remove similar characters if option is enabled
  if (options.excludeSimilar) {
    SIMILAR_CHARS.split('').forEach(char => {
      charset = charset.replace(char, '');
    });
  }
  
  // Remove ambiguous characters if option is enabled
  if (options.excludeAmbiguous) {
    AMBIGUOUS_CHARS.split('').forEach(char => {
      charset = charset.replace(char, '');
    });
  }
  
  if (!charset) {
    return 'No characters available with current options';
  }
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

function calculateStrength(password: string, options: PasswordOptions): { score: number; label: string; color: string } {
  if (!password || password.includes('Select') || password.includes('No characters')) {
    return { score: 0, label: 'Invalid', color: 'gray' };
  }
  
  let score = 0;
  
  // Length score (0-40 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;
  
  // Character variety (0-40 points)
  if (options.includeLowercase && /[a-z]/.test(password)) score += 10;
  if (options.includeUppercase && /[A-Z]/.test(password)) score += 10;
  if (options.includeNumbers && /[0-9]/.test(password)) score += 10;
  if (options.includeSymbols && /[^a-zA-Z0-9]/.test(password)) score += 10;
  
  // Bonus for longer passwords (0-20 points)
  if (password.length > 16) score += 10;
  if (password.length > 24) score += 10;
  
  let label: string;
  let color: string;
  
  if (score < 30) {
    label = 'Weak';
    color = 'red';
  } else if (score < 50) {
    label = 'Fair';
    color = 'orange';
  } else if (score < 70) {
    label = 'Good';
    color = 'yellow';
  } else if (score < 90) {
    label = 'Strong';
    color = 'green';
  } else {
    label = 'Very Strong';
    color = 'green';
  }
  
  return { score: Math.min(score, 100), label, color };
}

export default function PasswordGenerator() {
  usePageTitle('Password Generator - Secure Password Creator');
  
  useMetaTags({
    title: 'Password Generator - Secure Password Creator | ShalConnects',
    description: 'Generate strong, secure passwords with customizable options. Control length, character types, and security settings.',
    keywords: 'password generator, secure password, random password, password creator, strong password',
    ogTitle: 'Password Generator - Secure Password Creator',
    ogDescription: 'Generate strong, secure passwords with customizable options.',
    ogImage: '/logo.png',
    twitterTitle: 'Password Generator - Secure Password Creator',
    twitterDescription: 'Generate strong, secure passwords with customizable options.',
    twitterImage: '/logo.png'
  });

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const strength = useMemo(() => calculateStrength(password, options), [password, options]);

  const handleGenerate = useCallback(async () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
    
    // Add to history
    if (newPassword && !newPassword.includes('Select') && !newPassword.includes('No characters')) {
      setPasswordHistory(prev => {
        const updated = [newPassword, ...prev.filter(p => p !== newPassword)];
        return updated.slice(0, 20); // Keep last 20
      });
    }
    
    // Auto-copy on generate
    if (newPassword && !newPassword.includes('Select') && !newPassword.includes('No characters')) {
      try {
        await navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setToastMessage('Password generated and copied!');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setCopied(false);
        }, 3000);
      } catch (err) {
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = newPassword;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setToastMessage('Password generated and copied!');
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            setCopied(false);
          }, 3000);
        } catch (fallbackErr) {
          setToastMessage('Password generated!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    }
  }, [options]);

  // Load password history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('passwordGeneratorHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setPasswordHistory(Array.isArray(parsed) ? parsed.slice(0, 20) : []); // Keep last 20
      } catch (err) {
        setPasswordHistory([]);
      }
    }
  }, []);

  // Save password history to localStorage
  useEffect(() => {
    if (passwordHistory.length > 0) {
      localStorage.setItem('passwordGeneratorHistory', JSON.stringify(passwordHistory));
    }
  }, [passwordHistory]);

  // Generate password on mount and when options change
  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = async () => {
    if (password && !password.includes('Select') && !password.includes('No characters')) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setToastMessage('Password copied to clipboard!');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setCopied(false);
        }, 3000);
      } catch (err) {
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = password;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setToastMessage('Password copied to clipboard!');
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            setCopied(false);
          }, 3000);
        } catch (fallbackErr) {
          setToastMessage('Failed to copy password');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    }
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectFromHistory = (historyPassword: string) => {
    setPassword(historyPassword);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setPasswordHistory([]);
    localStorage.removeItem('passwordGeneratorHistory');
    setShowHistory(false);
  };

  const strengthColors = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500'
  };

  const strengthTextColors = {
    red: 'text-red-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    gray: 'text-gray-400'
  };

  return (
    <PageLayout title="Password Generator">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Toast Notification */}
        {showToast && (
          <div 
            className="fixed top-2 right-2 sm:top-4 sm:right-4 left-2 sm:left-auto px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-xs sm:text-sm md:text-base transition-all duration-300 transform bg-purple-500 text-white translate-x-0 animate-[slideIn_0.3s_ease-out]"
            style={{
              animation: 'slideIn 0.3s ease-out, checkmarkPop 0.5s ease-out 0.2s'
            }}
          >
            <Check className="w-4 h-4 sm:w-5 sm:h-5" style={{ animation: 'checkmarkPop 0.5s ease-out' }} />
            <span>{toastMessage}</span>
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base px-2">
            Generate strong, secure passwords with customizable options
          </p>
        </div>

        {/* Password Display and Options Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Password Display */}
          <div className="bg-gray-800/50 p-3 sm:p-4 md:p-5 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <label className="text-xs sm:text-sm font-medium text-gray-300">Generated Password</label>
              </div>
              {passwordHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 text-xs sm:text-sm"
                  aria-label="View password history"
                >
                  <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
            </div>
            
            <div className="space-y-2 mb-2 sm:mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 pr-10 sm:pr-12 text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={handleCopy}
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white p-1.5 sm:p-2 rounded transition-colors flex items-center justify-center"
                  aria-label="Copy password"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
              <button
                onClick={handleGenerate}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm"
                aria-label="Generate new password"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Generate</span>
              </button>
            </div>

            {/* Password History */}
            {showHistory && passwordHistory.length > 0 && (
              <div className="mt-3 sm:mt-4 bg-gray-700/50 rounded-lg p-2 sm:p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Recent Passwords ({passwordHistory.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                      aria-label="Clear history"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      aria-label="Close history"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 max-h-40 sm:max-h-48 overflow-y-auto">
                  {passwordHistory.map((historyPassword, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectFromHistory(historyPassword)}
                      className="flex items-center justify-between p-2 bg-gray-600/50 rounded cursor-pointer hover:bg-gray-600 transition-colors group"
                    >
                      <code className="text-xs sm:text-sm font-mono text-gray-300 group-hover:text-white transition-colors flex-1 truncate">
                        {historyPassword}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(historyPassword).then(() => {
                            setToastMessage('Password copied!');
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 2000);
                          });
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Copy password"
                      >
                        <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strength Indicator */}
            {password && !password.includes('Select') && !password.includes('No characters') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Password Strength:</span>
                  <span className={`font-semibold ${strengthTextColors[strength.color as keyof typeof strengthTextColors]}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${strengthColors[strength.color as keyof typeof strengthColors]}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="bg-gray-800/50 p-3 sm:p-4 md:p-5 rounded-lg border border-gray-700/50">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            Options
          </h2>

          <div className="space-y-2.5 sm:space-y-3">
            {/* Length */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-300">
                  Password Length
                </label>
                <span className="text-xs sm:text-sm font-semibold text-white bg-gray-700 px-2 py-0.5 rounded">
                  {options.length}
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                value={options.length}
                onChange={(e) => updateOption('length', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-0.5">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Types and Security Options Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Character Types */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                  Character Types
                </label>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                      Uppercase Letters (A-Z)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                      Lowercase Letters (a-z)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                      Numbers (0-9)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                      Symbols (!@#$%...)
                    </span>
                  </label>
                </div>
              </div>

              {/* Security Options */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                  Security Options
                </label>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.excludeSimilar}
                      onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                        Exclude Similar Characters
                      </span>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Excludes i, l, 1, L, o, 0, O</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                        Exclude Ambiguous Characters
                      </span>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Excludes { } [ ] ( ) / \ ' " ` ~ , ; : . &lt; &gt;</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Warning if no character types selected */}
            {!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-2 sm:p-2.5 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-yellow-400">
                  Please select at least one character type to generate a password.
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
}

