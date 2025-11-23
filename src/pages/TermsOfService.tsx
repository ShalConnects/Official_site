import PageLayout from '../components/PageLayout';

export default function TermsOfService() {
  return (
    <PageLayout title="Terms of Service">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Company Information</h2>
            <p>
              <strong>Trading Name/Brand:</strong> ShalConnects<br />
              <strong>Website:</strong> shalconnects.com<br />
              <strong>Email:</strong> support@shalconnects.com<br />
              <strong>Business Owner:</strong> [Your Legal Name], CEO
            </p>
            <p className="mt-4">
              These Terms of Service ("Terms") govern your use of the website and services provided by ShalConnects ("we," "us," or "our"). ShalConnects is the trading name for the digital agency operated by [Your Legal Name].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using shalconnects.com ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on ShalConnects' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Products and Services</h2>
            <p>
              We offer digital products and services, including WordPress plugins and web development services. All purchases are subject to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment terms as specified at the time of purchase</li>
              <li>Our refund policy (see Refund Policy page)</li>
              <li>License terms specific to each product</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
            <p>
              All payments are processed securely through Paddle, our payment processor. By making a purchase, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate payment information</li>
              <li>Pay all charges incurred by your account</li>
              <li>Comply with all applicable payment terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by ShalConnects and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Prohibited Uses</h2>
            <p>You may not use the Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For any unlawful purpose</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, or laws</li>
              <li>To transmit any viruses or malicious code</li>
              <li>To infringe upon the rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer</h2>
            <p>
              The materials on ShalConnects' website are provided on an 'as is' basis. ShalConnects makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              In no event shall ShalConnects or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ShalConnects' website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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

