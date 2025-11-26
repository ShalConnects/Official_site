import React, { useState, useCallback, useMemo } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export default function ColorPicker() {
  usePageTitle('Color Picker/Converter - Color Format Converter');
  
  useMetaTags({
    title: 'Color Picker/Converter - HEX, RGB, HSL Converter | ShalConnects',
    description: 'Pick colors and convert between HEX, RGB, and HSL formats. Visual color picker with real-time conversion.',
    keywords: 'color picker, color converter, HEX to RGB, RGB to HSL, color tool, hex converter',
    ogTitle: 'Color Picker/Converter - HEX, RGB, HSL Converter',
    ogDescription: 'Pick colors and convert between HEX, RGB, and HSL formats.',
    ogImage: '/logo.png',
    twitterTitle: 'Color Picker/Converter - HEX, RGB, HSL Converter',
    twitterDescription: 'Pick colors and convert between HEX, RGB, and HSL formats.',
    twitterImage: '/logo.png'
  });

  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState<HSL>({ h: 238, s: 87, l: 67 });
  const [copied, setCopied] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const updateFromHex = useCallback((newHex: string) => {
    setHex(newHex);
    const rgbValue = hexToRgb(newHex);
    if (rgbValue) {
      setRgb(rgbValue);
      const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
      setHsl(hslValue);
    }
  }, []);

  const updateFromRgb = useCallback((newRgb: RGB) => {
    setRgb(newRgb);
    const hexValue = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(hexValue);
    const hslValue = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHsl(hslValue);
  }, []);

  const updateFromHsl = useCallback((newHsl: HSL) => {
    setHsl(newHsl);
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbValue);
    const hexValue = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
    setHex(hexValue);
  }, []);

  const handleCopy = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(format);
      setToastMessage(`${format} copied!`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setCopied(null);
      }, 2000);
    } catch (err) {
      setToastMessage('Failed to copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const colorPreview = useMemo(() => {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }, [rgb]);

  return (
    <PageLayout title="Color Picker/Converter">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Toast Notification */}
        {showToast && (
          <div 
            className="fixed top-2 right-2 sm:top-4 sm:right-4 left-2 sm:left-auto px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-xs sm:text-sm md:text-base transition-all duration-300 transform bg-amber-500 text-white translate-x-0 animate-[slideIn_0.3s_ease-out]"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            Color Picker/Converter
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base px-2">
            Pick colors and convert between HEX, RGB, and HSL formats
          </p>
        </div>

        {/* Color Preview */}
        <div className="mb-4 sm:mb-6">
          <div 
            className="w-full h-32 sm:h-40 md:h-48 rounded-lg border-2 border-gray-700 shadow-lg transition-all duration-300"
            style={{ backgroundColor: colorPreview }}
          />
        </div>

        {/* Color Formats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* HEX */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                HEX
              </label>
              <button
                onClick={() => handleCopy(hex, 'HEX')}
                className="text-amber-400 hover:text-amber-300 transition-colors"
                aria-label="Copy HEX"
              >
                {copied === 'HEX' ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#?[0-9A-Fa-f]{0,6}$/.test(value.replace('#', ''))) {
                  const hexValue = value.startsWith('#') ? value : `#${value}`;
                  if (hexValue.length === 7) {
                    updateFromHex(hexValue);
                  } else {
                    setHex(hexValue);
                  }
                }
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="#000000"
            />
          </div>

          {/* RGB */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-300">RGB</label>
              <button
                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                className="text-amber-400 hover:text-amber-300 transition-colors"
                aria-label="Copy RGB"
              >
                {copied === 'RGB' ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 w-8">R:</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => updateFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 w-8">G:</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => updateFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 w-8">B:</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => updateFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* HSL */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-300">HSL</label>
              <button
                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                className="text-amber-400 hover:text-amber-300 transition-colors"
                aria-label="Copy HSL"
              >
                {copied === 'HSL' ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 w-8">H:</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => updateFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 w-8">S:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => updateFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 w-8">L:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => updateFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Native Color Picker */}
        <div className="mt-4 sm:mt-6 bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
          <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
            Visual Color Picker
          </label>
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full h-12 sm:h-16 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </PageLayout>
  );
}

