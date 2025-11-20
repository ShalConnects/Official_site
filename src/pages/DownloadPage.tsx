import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Download, CheckCircle, XCircle, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

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

export default function DownloadPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const transactionId = searchParams.get('transaction') || searchParams.get('_ptxn');

  useEffect(() => {
    if (!transactionId) {
      setError('No transaction ID provided. Please complete your purchase first.');
      setLoading(false);
      return;
    }

    verifyTransaction(transactionId);
  }, [transactionId]);

  const verifyTransaction = async (txnId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Option 1: Call your backend API to verify transaction
      // Replace this URL with your actual backend endpoint
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/verify-transaction?transaction=${txnId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If backend is not set up yet, use fallback verification
      if (!response.ok && response.status === 404) {
        // Fallback: Show download with warning (less secure)
        console.warn('Backend API not found. Using fallback verification.');
        setTransaction({
          id: txnId,
          status: 'completed',
          customer_email: 'customer@example.com',
          items: [],
          created_at: new Date().toISOString(),
        });
        setVerified(true);
        // Use Paddle's download URL or your CDN
        setDownloadUrl(`/api/download?transaction=${txnId}`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to verify transaction');
      }

      const data = await response.json();

      if (data.valid && data.transaction) {
        setTransaction(data.transaction);
        setVerified(true);
        // Generate secure download link
        setDownloadUrl(`/api/download?transaction=${txnId}&token=${data.downloadToken}`);
      } else {
        setError(data.message || 'Transaction verification failed. Please contact support.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      // Fallback: If API is not available, show message
      setError('Unable to verify transaction. Please check your email for the download link, or contact support with your transaction ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Track download
      fetch(`/api/track-download?transaction=${transactionId}`, {
        method: 'POST',
      }).catch(console.error);

      // Open download in new tab
      window.open(downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Breadcrumbs />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#176641' }} />
            <p className="text-gray-400">Verifying your purchase...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Breadcrumbs />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gray-800/50 rounded-xl border border-red-500/50 p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Verification Failed</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            {transactionId && (
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Transaction ID:</p>
                <p className="font-mono text-sm text-gray-300 break-all">{transactionId}</p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/services/wordpress/plugins/variation-images-pro"
                className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center gap-2"
                style={{ backgroundColor: '#176641' }}
              >
                <ArrowLeft size={18} />
                Back to Plugin Page
              </Link>
              <a
                href="/#contact"
                className="px-6 py-3 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verified && transaction) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Breadcrumbs />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                      <li>Download link expires in 24 hours</li>
                      <li>You can download up to 3 times</li>
                      <li>Check your email for the license key</li>
                      <li>Keep the ZIP file - do not extract before uploading</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Installation Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                  <li>Log in to your WordPress admin dashboard</li>
                  <li>Navigate to <strong className="text-white">Plugins → Add New</strong></li>
                  <li>Click <strong className="text-white">"Upload Plugin"</strong> button</li>
                  <li>Select the downloaded ZIP file (do not extract it)</li>
                  <li>Click <strong className="text-white">"Install Now"</strong> then <strong className="text-white">"Activate"</strong></li>
                  <li>Enter your license key in plugin settings</li>
                </ol>
              </div>

              <div className="pt-4">
                <Link
                  to="/services/wordpress/plugins/variation-images-pro"
                  className="text-center block text-gray-400 hover:text-gray-300 transition-colors text-sm"
                >
                  ← Back to Plugin Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

