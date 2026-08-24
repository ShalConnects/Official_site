import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Download, CheckCircle, XCircle, ArrowLeft, AlertCircle, Key } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import LoadingScreen from '../components/LoadingScreen';
import { usePageTitle } from '../hooks/usePageTitle';
import { isStoreContext } from '../utils/storeUtils';

interface TransactionData {
  id: string;
  status: string;
  customer_email: string;
  items: Array<{
    product_id: string;
    price_id: string;
  }>;
  created_at: string;
}

const TRANSACTION_ID_STEPS = [
  { step: 1, title: 'Check your inbox', caption: 'Look for the Paddle receipt email.', image: '/images/download-help/step1-inbox.png' },
  { step: 2, title: 'Open the email', caption: 'Find and open the receipt. Look for the attachment.', image: '/images/download-help/step2-attachment.png' },
  { step: 3, title: 'Find the Transaction ID', caption: 'Open the attachment. The Transaction ID is clearly marked.', image: '/images/download-help/step3-transaction-id.png' },
  { step: 4, title: 'Paste and verify', caption: 'Copy the Transaction ID, paste it below, and click Verify.', image: '/images/download-help/step4-verify.png' },
];

function resolveTransactionId(searchParams: URLSearchParams): string | null {
  const fromUrl = [
    searchParams.get('transaction'),
    searchParams.get('_ptxn'),
    searchParams.get('txn'),
    searchParams.get('transaction_id'),
    searchParams.get('id'),
  ].find((id) => id);

  if (fromUrl) return fromUrl;

  const hash = window.location.hash;
  const hashMatch = hash.match(/[?&](?:transaction|_ptxn|txn|transaction_id|id)=([^&]+)/);
  if (hashMatch) return decodeURIComponent(hashMatch[1]);

  return null;
}

function pluginBackPath(productSlug: string | null, isStoreSubdomain: boolean): string {
  if (productSlug) {
    return isStoreSubdomain ? `/${productSlug}` : `/store/${productSlug}`;
  }
  return isStoreSubdomain ? '/variation-images-pro' : '/store/variation-images-pro';
}

export default function DownloadPage() {
  usePageTitle('Download');
  const isStoreSubdomain = isStoreContext();

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [manualTransactionId, setManualTransactionId] = useState('');
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const verifiedTxnRef = useRef<string | null>(null);

  const verifyTransaction = useCallback(async (txnId: string) => {
    try {
      setLoading(true);
      setError(null);
      setActiveTransactionId(txnId);

      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(
        `${apiUrl}/verify-transaction?transaction=${encodeURIComponent(txnId)}&_t=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Verification API not found. Please contact support.');
        }
        const errorData = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Verification failed: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        valid?: boolean;
        message?: string;
        downloadToken?: string;
        productSlug?: string | null;
        transaction?: TransactionData | null;
      };

      if (data.valid && data.transaction && data.downloadToken) {
        setTransaction(data.transaction);
        setVerified(true);
        setProductSlug(data.productSlug || null);
        setDownloadUrl(
          `/api/download?transaction=${encodeURIComponent(txnId)}&token=${encodeURIComponent(data.downloadToken)}`
        );
        verifiedTxnRef.current = txnId;
      } else {
        const status = data.transaction?.status || 'unknown';

        if (!data.transaction) {
          setError(data.message || 'Transaction not found. Please verify your transaction ID is correct.');
        } else if (status === 'pending') {
          setError(
            'Your payment is still processing. Please wait a few minutes and refresh this page, or check your email for the download link once payment is confirmed.'
          );
        } else if (status === 'unknown') {
          setError(
            data.message ||
              `Unable to determine transaction status. Please contact support with transaction ID: ${txnId}`
          );
        } else {
          setError(
            data.message ||
              `Transaction verification failed. Status: ${status}. Please contact support with transaction ID: ${txnId}`
          );
        }
      }
    } catch (err: unknown) {
      console.error('Verification error:', err);
      const message = err instanceof Error ? err.message : null;
      setError(
        message ||
          'Unable to verify transaction. Please check your email for the download link, or contact support with your transaction ID.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let txnId = resolveTransactionId(searchParams);

    if (!txnId) {
      const storedId = sessionStorage.getItem('paddle_transaction_id');
      if (storedId) {
        sessionStorage.removeItem('paddle_transaction_id');
        txnId = storedId;
      }
    }

    if (!txnId) {
      setError(
        'No transaction ID found. If you just completed a purchase, please check your email for the download link, or contact support with your transaction details.'
      );
      setLoading(false);
      return;
    }

    if (verifiedTxnRef.current === txnId) {
      setLoading(false);
      return;
    }

    verifyTransaction(txnId);
  }, [searchParams, verifyTransaction]);

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualTransactionId.trim();
    if (trimmed) {
      verifiedTxnRef.current = null;
      setVerified(false);
      setTransaction(null);
      setDownloadUrl(null);
      verifyTransaction(trimmed);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Download">
        <LoadingScreen variant="full" message="Verifying your purchase..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Download">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-gray-800/50 rounded-xl border border-red-500/50 p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Verification Failed</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            {activeTransactionId && (
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Transaction ID:</p>
                <p className="font-mono text-sm text-gray-300 break-all">{activeTransactionId}</p>
              </div>
            )}

            {!activeTransactionId && (
              <>
                <div className="bg-gray-900/50 rounded-lg p-6 text-left mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Enter Transaction ID</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Paste the Transaction ID from your receipt below and click Verify.
                  </p>
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <input
                      type="text"
                      value={manualTransactionId}
                      onChange={(e) => setManualTransactionId(e.target.value)}
                      placeholder="Enter transaction ID (e.g., txn_01...)"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-lg font-medium text-white"
                      style={{ backgroundColor: '#176641' }}
                    >
                      Verify Transaction
                    </button>
                  </form>
                </div>
                <div className="h-[350px] overflow-y-auto rounded-lg border-0">
                  <p className="text-gray-300 text-sm sm:text-base mb-4">
                    You&apos;ll receive an email with your receipt. Open the receipt and look for the{' '}
                    <strong className="text-white">Transaction ID</strong> — you&apos;ll use it below to get
                    your download.
                  </p>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-gray-400" />
                    How to find your Transaction ID
                  </h3>
                  <div className="space-y-6 pr-2">
                    {TRANSACTION_ID_STEPS.map(({ step, title, caption, image }, i) => (
                      <div
                        key={step}
                        className="download-step bg-gray-900/50 rounded-lg p-4 sm:p-5 border border-gray-700/50"
                        style={{ animationDelay: `${i * 0.08}s` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white">
                            {step}
                          </span>
                          <h4 className="text-base font-semibold text-white">{title}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{caption}</p>
                        <img src={image} alt={title} className="rounded-lg border border-gray-700/50 w-full max-w-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTransactionId && (
              <div className="bg-gray-900/50 rounded-lg p-6 text-left mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Try another Transaction ID</h3>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={manualTransactionId}
                    onChange={(e) => setManualTransactionId(e.target.value)}
                    placeholder="Enter transaction ID (e.g., txn_01...)"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg font-medium text-white"
                    style={{ backgroundColor: '#176641' }}
                  >
                    Verify Transaction
                  </button>
                </form>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 mt-2.5">
              <Link
                to={pluginBackPath(productSlug, isStoreSubdomain)}
                className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center gap-2"
                style={{ backgroundColor: '#176641' }}
              >
                <ArrowLeft size={18} />
                Back to Plugin Page
              </Link>
              <a
                href="mailto:hello@shalconnects.com"
                className="px-6 py-3 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (verified && transaction) {
    return (
      <PageLayout title="Download">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#176641' }} />
              <h1 className="text-3xl font-bold mb-2">Purchase Verified!</h1>
              <p className="text-gray-400">Thank you for your purchase. You can now download the Pro version.</p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Purchase Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="font-mono text-gray-300">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-gray-300">{transaction.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 capitalize">{transaction.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Purchase Date:</span>
                  <span className="text-gray-300">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleDownload}
                className="w-full px-8 py-4 rounded-lg font-medium text-white text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 bg-gradient-theme"
              >
                <Download size={20} />
                Download Pro Version
              </button>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold text-blue-400 mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      {transaction.status === 'pending' && (
                        <li className="text-yellow-400 font-semibold">
                          Payment is still processing — download will work once confirmed
                        </li>
                      )}
                      <li>Keep the ZIP file - do not extract before uploading</li>
                      <li>The plugin is ready to use immediately after installation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Installation Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                  <li>Log in to your WordPress admin dashboard</li>
                  <li>
                    Navigate to <strong className="text-white">Plugins → Add New</strong>
                  </li>
                  <li>
                    Click <strong className="text-white">&quot;Upload Plugin&quot;</strong> button
                  </li>
                  <li>Select the downloaded ZIP file (do not extract it)</li>
                  <li>
                    Click <strong className="text-white">&quot;Install Now&quot;</strong>
                  </li>
                  <li>The plugin will be ready to use immediately after installation</li>
                </ol>
              </div>

              <div className="pt-4">
                <Link
                  to={pluginBackPath(productSlug, isStoreSubdomain)}
                  className="text-center block text-gray-400 hover:text-gray-300 transition-colors text-sm"
                >
                  ← Back to Plugin Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return null;
}
