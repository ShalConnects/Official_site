import React, { useState, useCallback, useMemo } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, AlertCircle } from 'lucide-react';
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

  const handleGenerate = useCallback(() => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
  }, [options]);

  // Generate password on mount and when options change
  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = async () => {
    if (password && !password.includes('Select') && !password.includes('No characters')) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg px-2">
            Generate strong, secure passwords with customizable options
          </p>
        </div>

        {/* Password Display */}
        <div className="bg-gray-800/50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-gray-700/50 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Key className="w-5 h-5 text-indigo-400" />
            <label className="text-sm sm:text-base font-medium text-gray-300">Generated Password</label>
          </div>
          
          <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 sm:py-3.5 text-white font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={handleCopy}
            />
            <button
              onClick={handleCopy}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              aria-label="Copy password"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleGenerate}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              aria-label="Generate new password"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Generate</span>
            </button>
          </div>

          {/* Strength Indicator */}
          {password && !password.includes('Select') && !password.includes('No characters') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Password Strength:</span>
                <span className={`font-semibold ${strengthTextColors[strength.color as keyof typeof strengthTextColors]}`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${strengthColors[strength.color as keyof typeof strengthColors]}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-gray-800/50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Options
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Length */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm sm:text-base font-medium text-gray-300">
                  Password Length
                </label>
                <span className="text-sm sm:text-base font-semibold text-white bg-gray-700 px-3 py-1 rounded-lg">
                  {options.length}
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                value={options.length}
                onChange={(e) => updateOption('length', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Types */}
            <div>
              <label className="text-sm sm:text-base font-medium text-gray-300 mb-3 block">
                Character Types
              </label>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.includeUppercase}
                    onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                    Uppercase Letters (A-Z)
                  </span>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.includeLowercase}
                    onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                    Lowercase Letters (a-z)
                  </span>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.includeNumbers}
                    onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                    Numbers (0-9)
                  </span>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.includeSymbols}
                    onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                    Symbols (!@#$%...)
                  </span>
                </label>
              </div>
            </div>

            {/* Security Options */}
            <div>
              <label className="text-sm sm:text-base font-medium text-gray-300 mb-3 block">
                Security Options
              </label>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.excludeSimilar}
                    onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                      Exclude Similar Characters
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Excludes i, l, 1, L, o, 0, O</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.excludeAmbiguous}
                    onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                      Exclude Ambiguous Characters
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Excludes { } [ ] ( ) / \ ' " ` ~ , ; : . &lt; &gt;</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Warning if no character types selected */}
            {!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-400">
                  Please select at least one character type to generate a password.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

