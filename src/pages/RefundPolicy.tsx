import PageLayout from '../components/PageLayout';
import { isStoreContext } from '../utils/storeUtils';

export default function RefundPolicy() {
  const isStore = isStoreContext();
  
  return (
    <PageLayout title="Refund Policy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Refund Policy</h1>
        <p className="text-gray-400 mb-6">Last updated: November 2025</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          {isStore && (
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-white font-semibold">
                30-Day Money-Back Guarantee: We offer a full refund within 30 days of purchase, no questions asked.
              </p>
            </div>
          )}
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Policy</h2>
            {isStore ? (
              <p>
                We offer a 30-day money-back guarantee on all WordPress plugins and themes. If you request a refund within 30 days of your purchase date, you will receive a full refund, no questions asked.
              </p>
            ) : (
              <p>
                ShalConnects offers a 30-day money-back guarantee on all digital products (WordPress plugins and themes). If you request a refund within 30 days of your purchase date, you will receive a full refund, no questions asked.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How to Request a Refund</h2>
            <p>To request a refund:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Email us at <strong>hello@shalconnects.com</strong></li>
              <li>Include your order number or purchase email</li>
              {isStore ? (
                <li>We will process your refund promptly</li>
              ) : (
                <li>We will process your refund promptly</li>
              )}
            </ol>
            <p className="mt-4">We will process your refund within 5-7 business days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Refund Processing</h2>
            <p>
              Refunds will be issued to the original payment method used for purchase. Processing time depends on your payment provider (typically 5-10 business days).
            </p>
          </section>

          {isStore ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. What Happens After Refund</h2>
                <p>After a refund is processed:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your license will be deactivated</li>
                  <li>You must remove the product from your websites</li>
                  <li>You will no longer receive updates or support</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Contact</h2>
                <p>For refund requests or questions, contact us at <strong>hello@shalconnects.com</strong></p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. What Happens After Refund</h2>
                <p>After a refund is processed:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your license will be deactivated (for digital products)</li>
                  <li>You must remove the product from your websites (for digital products)</li>
                  <li>You will no longer receive updates or support (for digital products)</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
                <p>
                  For refund requests or questions about this policy, please contact us:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> hello@shalconnects.com<br />
                  <strong>Website:</strong> shalconnects.com
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

