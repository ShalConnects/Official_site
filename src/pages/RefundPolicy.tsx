import PageLayout from '../components/PageLayout';
import { isStoreContext } from '../utils/storeUtils';

export default function RefundPolicy() {
  const isStore = isStoreContext();
  
  return (
    <PageLayout title="Refund Policy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Refund Policy</h1>
        <p className="text-gray-400 mb-6">Last updated: November 2025</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          {isStore && (
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-white font-semibold">
                30-Day Money-Back Guarantee: We offer a full refund within 30 days of purchase if you're not satisfied with our WordPress plugins or themes.
              </p>
            </div>
          )}
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
            {isStore ? (
              <p>You are eligible for a refund if:</p>
            ) : (
              <p>
                ShalConnects offers refunds for digital products and services under the following conditions:
              </p>
            )}
            <ul className="list-disc pl-6 space-y-2">
              {isStore ? (
                <>
                  <li>You request a refund within 30 days of purchase</li>
                  <li>The product does not work as described</li>
                  <li>You experience technical issues we cannot resolve</li>
                  <li>The product is incompatible with your setup (after we've attempted to help)</li>
                </>
              ) : (
                <>
                  <li><strong>Digital Products (Plugins):</strong> Refunds are available within 30 days of purchase if the product does not work as described or is defective.</li>
                  <li><strong>Custom Development Services:</strong> Refunds are handled on a case-by-case basis depending on project stage and completion.</li>
                  <li><strong>Consultation Services:</strong> Refunds are not available for completed consultation sessions.</li>
                </>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How to Request a Refund</h2>
            <p>To request a refund:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Email us at <strong>hello@shalconnects.com</strong></li>
              <li>Include your order number or purchase email</li>
              <li>Briefly explain the reason for the refund request</li>
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
                <h2 className="text-2xl font-semibold text-white mb-4">5. Non-Refundable Situations</h2>
                <p>Refunds may not be available if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>More than 30 days have passed since purchase</li>
                  <li>You've violated our Terms & Conditions</li>
                  <li>The issue is due to third-party conflicts (themes, other plugins) that we cannot control</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Support Before Refund</h2>
                <p>We encourage you to contact our support team (hello@shalconnects.com) before requesting a refund. Many issues can be resolved quickly, and we're happy to help!</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Contact</h2>
                <p>For refund requests or questions, contact us at <strong>hello@shalconnects.com</strong></p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Non-Refundable Items</h2>
                <p>The following are not eligible for refunds:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Products that have been downloaded and used for more than 30 days</li>
                  <li>Custom development work that has been completed and delivered</li>
                  <li>Services that have been fully rendered</li>
                  <li>Products purchased during special promotions or sales (unless otherwise stated)</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Chargebacks</h2>
                <p>
                  If you file a chargeback or dispute with your payment provider, we reserve the right to suspend your account and access to our services until the dispute is resolved.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Technical Issues</h2>
                <p>
                  If you experience technical issues with a product, please contact our support team first. We will work with you to resolve the issue. If we cannot resolve the issue, a refund will be issued.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
                <p>
                  For refund requests or questions about this policy, please contact us:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> support@shalconnects.com<br />
                  <strong>Website:</strong> shalconnects.com
                </p>
              </section>
            </>
          )}

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Chargebacks</h2>
            <p>
              If you file a chargeback or dispute with your payment provider, we reserve the right to suspend your account and access to our services until the dispute is resolved.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Technical Issues</h2>
            <p>
              If you experience technical issues with a product, please contact our support team first. We will work with you to resolve the issue. If we cannot resolve the issue, a refund will be issued.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p>
              For refund requests or questions about this policy, please contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> support@shalconnects.com<br />
              <strong>Website:</strong> shalconnects.com
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

