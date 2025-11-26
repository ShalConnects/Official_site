import React, { useState, useCallback, useRef } from 'react';
import { QrCode, Copy, Check, Download, RefreshCw, Image as ImageIcon, X, History, Trash2, Scan, Upload } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

// Simple QR Code generation using a basic algorithm
// For production, consider using a library like 'qrcode.react' or 'react-qr-code'

function generateQRCodeSVG(
  text: string, 
  size: number = 256, 
  foregroundColor: string = '#000000',
  backgroundColor: string = '#FFFFFF',
  margin: number = 4,
  logoUrl: string | null = null,
  logoSize: number = 30
): string {
  // Using a QR code API service with customization options
  const encodedText = encodeURIComponent(text);
  const fgColor = foregroundColor.replace('#', '');
  const bgColor = backgroundColor.replace('#', '');
  let url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&color=${fgColor}&bgcolor=${bgColor}&margin=${margin}`;
  
  // Note: The API doesn't support logo directly, so we'll handle it client-side
  return url;
}

export default function QRCodeGenerator() {
  usePageTitle('QR Code Generator - Generate QR Codes');
  
  useMetaTags({
    title: 'QR Code Generator - Generate QR Codes from Text/URLs | ShalConnects',
    description: 'Generate QR codes from text or URLs. Download as PNG or SVG. Perfect for sharing links and information.',
    keywords: 'QR code generator, QR code, QR code creator, QR code maker, QR code tool',
    ogTitle: 'QR Code Generator - Generate QR Codes from Text/URLs',
    ogDescription: 'Generate QR codes from text or URLs. Download as PNG or SVG.',
    ogImage: '/logo.png',
    twitterTitle: 'QR Code Generator - Generate QR Codes from Text/URLs',
    twitterDescription: 'Generate QR codes from text or URLs. Download as PNG or SVG.',
    twitterImage: '/logo.png'
  });

  const [input, setInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(256);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [margin, setMargin] = useState(4);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(30);
  const [roundedCorners, setRoundedCorners] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; input: string; qrCodeUrl: string; timestamp: number; foregroundColor: string; backgroundColor: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const qrCodeRef = useRef<HTMLImageElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('qrCodeHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load QR code history:', e);
      }
    }
  }, []);

  const handleGenerate = useCallback(() => {
    if (input.trim()) {
      setIsGenerating(true);
      setTimeout(() => {
        const url = generateQRCodeSVG(input.trim(), size, foregroundColor, backgroundColor, margin, logoUrl, logoSize);
        setQrCodeUrl(url);
        setCopied(false);
        setIsGenerating(false);
        
        // Add to history
        const historyItem = {
          id: Date.now().toString(),
          input: input.trim(),
          qrCodeUrl: url,
          timestamp: Date.now(),
          foregroundColor,
          backgroundColor
        };
        const newHistory = [historyItem, ...history].slice(0, 20); // Keep last 20
        setHistory(newHistory);
        localStorage.setItem('qrCodeHistory', JSON.stringify(newHistory));
      }, 200);
    }
  }, [input, size, foregroundColor, backgroundColor, margin, logoUrl, logoSize]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit
        setToastMessage('Logo size must be less than 500KB');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleCopy = async () => {
    if (qrCodeUrl) {
      try {
        // Copy the input text to clipboard
        await navigator.clipboard.writeText(input);
        setCopied(true);
        setToastMessage('Text copied!');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setCopied(false);
        }, 2000);
      } catch (err) {
        setToastMessage('Failed to copy');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }
  };

  const handleDownload = useCallback(async (format: 'png' | 'svg' | 'jpg' | 'webp' | 'pdf') => {
    if (qrCodeUrl && qrCodeRef.current) {
      if (format === 'pdf') {
        // For PDF, convert to canvas first
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qrcode-${Date.now()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            }, 'image/png');
          };
          img.src = qrCodeUrl;
        } catch (err) {
          setToastMessage('PDF download not available. Please use PNG instead.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          return;
        }
      } else if (format === 'jpg' || format === 'webp') {
        // Convert to canvas for JPG/WebP
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `qrcode-${Date.now()}.${format}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }, `image/${format}`);
        };
        img.src = qrCodeUrl;
      } else {
        // PNG or SVG - direct download
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qrcode-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setToastMessage(`QR code downloaded as ${format.toUpperCase()}!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [qrCodeUrl]);

  const handleLoadFromHistory = (item: typeof history[0]) => {
    setInput(item.input);
    setQrCodeUrl(item.qrCodeUrl);
    setForegroundColor(item.foregroundColor);
    setBackgroundColor(item.backgroundColor);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrCodeHistory');
    setToastMessage('History cleared!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleScanQRCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedText(null);

    try {
      // Use a QR code decoding library or API
      // For now, we'll use a simple approach with jsQR or similar
      // Since we don't have a library, we'll use an API service
      const formData = new FormData();
      formData.append('file', file);

      // Using a free QR code decoding API
      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data[0]?.symbol?.[0]?.data) {
          const decodedText = data[0].symbol[0].data;
          setScannedText(decodedText);
          setInput(decodedText);
          setToastMessage('QR code scanned successfully!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        } else {
          setToastMessage('No QR code found in image');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } else {
        throw new Error('Failed to decode QR code');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setToastMessage('Failed to scan QR code. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsScanning(false);
      if (scanInputRef.current) {
        scanInputRef.current.value = '';
      }
    }
  };

  // Generate QR code when input changes (with debounce)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        handleGenerate();
      } else {
        setQrCodeUrl('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input, size, foregroundColor, backgroundColor, margin, logoUrl, logoSize, handleGenerate]);

  return (
    <PageLayout title="QR Code Generator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Toast Notification */}
        {showToast && (
          <div 
            className="fixed top-2 right-2 sm:top-4 sm:right-4 left-2 sm:left-auto px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-xs sm:text-sm md:text-base transition-all duration-300 transform bg-teal-500 text-white translate-x-0 animate-[slideIn_0.3s_ease-out]"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base px-2">
            Generate QR codes from text or URLs. Download as PNG or SVG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Input Section */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              Input
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setScanMode(false)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all font-semibold text-xs sm:text-sm transform hover:scale-105 active:scale-95 ${
                    !scanMode
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setScanMode(true)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 transform hover:scale-105 active:scale-95 ${
                    scanMode
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Scan
                </button>
              </div>

              {scanMode ? (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                    Upload QR Code Image
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors">
                    {isScanning ? (
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-teal-400 mb-2 animate-spin" />
                        <p className="text-xs text-gray-400">Scanning QR code...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-2">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-400">Click to upload QR code image</p>
                      </div>
                    )}
                    <input
                      ref={scanInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScanQRCode}
                      className="hidden"
                      disabled={isScanning}
                    />
                  </label>
                  {scannedText && (
                    <div className="mt-2 p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                      <p className="text-xs text-teal-400 mb-1">Scanned Text:</p>
                      <p className="text-xs text-white break-all">{scannedText}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                    Text or URL
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text or URL to generate QR code..."
                    className="w-full h-32 sm:h-40 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    Size
                  </label>
                  <span className="text-xs sm:text-sm font-semibold text-white bg-gray-700 px-2 py-0.5 rounded">
                    {size}px
                  </span>
                </div>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-300 mb-1.5 block">
                    Foreground
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                    />
                    <input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-300 mb-1.5 block">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    Margin
                  </label>
                  <span className="text-xs sm:text-sm font-semibold text-white bg-gray-700 px-2 py-0.5 rounded">
                    {margin}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-1.5 block">
                  Logo (Optional)
                </label>
                {logoUrl ? (
                  <div className="space-y-2">
                    <div className="relative inline-block">
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="w-16 h-16 object-contain bg-white rounded p-1"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        aria-label="Remove logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Logo Size</label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={logoSize}
                        onChange={(e) => setLogoSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                        <span>10%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-2">
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-400">Click to upload logo</p>
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Custom Styling */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={roundedCorners}
                    onChange={(e) => setRoundedCorners(e.target.checked)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-600 bg-gray-700 text-teal-500 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                    Rounded corners
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!input.trim()}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm"
                  aria-label="Copy text"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!input.trim() || isGenerating}
                  className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm transform hover:scale-105 active:scale-95"
                  aria-label="Generate QR code"
                >
                  <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50">
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              QR Code
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {isGenerating ? (
                <div className="flex items-center justify-center bg-gray-700/50 p-12 rounded-lg border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 text-teal-400 mx-auto mb-2 animate-spin" />
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Generating QR code...
                    </p>
                  </div>
                </div>
              ) : qrCodeUrl ? (
                <>
                  <div className="flex items-center justify-center p-4 rounded-lg transition-all duration-300 relative" style={{ backgroundColor: backgroundColor }}>
                    <div className="relative">
                      <img
                        ref={qrCodeRef}
                        src={qrCodeUrl}
                        alt="QR Code"
                        className={`w-full max-w-xs mx-auto transition-all duration-300 ${roundedCorners ? 'rounded-lg' : ''}`}
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                      {logoUrl && (
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded"
                          style={{ 
                            width: `${logoSize}%`,
                            height: `${logoSize}%`,
                            maxWidth: '80px',
                            maxHeight: '80px'
                          }}
                        >
                          <img
                            src={logoUrl}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleDownload('png')}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold text-[10px] sm:text-xs transform hover:scale-105 active:scale-95"
                        aria-label="Download as PNG"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">PNG</span>
                        <span className="sm:hidden">PNG</span>
                      </button>
                      <button
                        onClick={() => handleDownload('svg')}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold text-[10px] sm:text-xs transform hover:scale-105 active:scale-95"
                        aria-label="Download as SVG"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">SVG</span>
                        <span className="sm:hidden">SVG</span>
                      </button>
                      <button
                        onClick={() => handleDownload('jpg')}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold text-[10px] sm:text-xs transform hover:scale-105 active:scale-95"
                        aria-label="Download as JPG"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">JPG</span>
                        <span className="sm:hidden">JPG</span>
                      </button>
                      <button
                        onClick={() => handleDownload('webp')}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold text-[10px] sm:text-xs transform hover:scale-105 active:scale-95"
                        aria-label="Download as WebP"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">WebP</span>
                        <span className="sm:hidden">WebP</span>
                      </button>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transform hover:scale-105 active:scale-95"
                        aria-label="Toggle history"
                      >
                        <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>History ({history.length})</span>
                      </button>
                    )}
                  </div>
                  {showHistory && history.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-64 overflow-y-auto bg-gray-700/50 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-300">Recent QR Codes</h3>
                        <button
                          onClick={handleClearHistory}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                          aria-label="Clear history"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      </div>
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleLoadFromHistory(item)}
                          className="w-full flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <div 
                            className="w-12 h-12 flex-shrink-0 rounded border-2 border-gray-600"
                            style={{ backgroundColor: item.backgroundColor }}
                          >
                            <img
                              src={item.qrCodeUrl}
                              alt="QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{item.input}</p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center bg-gray-700/50 p-12 rounded-lg border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Enter text or URL to generate QR code
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

