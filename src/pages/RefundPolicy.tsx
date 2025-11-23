import PageLayout from '../components/PageLayout';

export default function RefundPolicy() {
  return (
    <PageLayout title="Refund Policy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Refund Policy</h1>
        <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
            <p>
              ShalConnects offers refunds for digital products and services under the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Digital Products (Plugins):</strong> Refunds are available within 30 days of purchase if the product does not work as described or is defective.</li>
              <li><strong>Custom Development Services:</strong> Refunds are handled on a case-by-case basis depending on project stage and completion.</li>
              <li><strong>Consultation Services:</strong> Refunds are not available for completed consultation sessions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How to Request a Refund</h2>
            <p>To request a refund, please:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact us at support@shalconnects.com</li>
              <li>Include your order number or transaction ID</li>
              <li>Explain the reason for your refund request</li>
              <li>We will review your request within 5 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Processing Time</h2>
            <p>
              Once approved, refunds will be processed within 5-10 business days. The refund will be issued to the original payment method used for the purchase.
            </p>
          </section>

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
        </div>
      </div>
    </PageLayout>
  );
}

