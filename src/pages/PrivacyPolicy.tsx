import PageLayout from '../components/PageLayout';
import { isStoreContext } from '../utils/storeUtils';

export default function PrivacyPolicy() {
  const isStore = isStoreContext();
  
  return (
    <PageLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-6">Last updated: November 2025</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. {isStore ? 'Information We Collect' : 'Introduction'}</h2>
            {isStore ? (
              <p>When you purchase our WordPress plugins or themes, we collect:</p>
            ) : (
              <p>
                ShalConnects ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website shalconnects.com.
              </p>
            )}
            <ul className="list-disc pl-6 space-y-2">
              {isStore ? (
                <>
                  <li>Name and email address (for order processing and support)</li>
                  <li>Payment information (processed securely by Paddle, our payment processor)</li>
                  <li>Website URL (optional, for license validation)</li>
                </>
              ) : (
                <>
                  <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you voluntarily provide</li>
                  <li><strong>Payment Data:</strong> Payment information is processed securely through Paddle, our payment processor. We do not store credit card information.</li>
                  <li><strong>Usage Data:</strong> Information about how you access and use our website</li>
                  <li><strong>Device Data:</strong> Information about your device, including IP address, browser type, and operating system</li>
                </>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. {isStore ? 'How We Use Your Information' : 'Information We Collect'}</h2>
            {isStore ? (
              <p>We use collected information to:</p>
            ) : (
              <p>We may collect information about you in a variety of ways:</p>
            )}
            <ul className="list-disc pl-6 space-y-2">
              {isStore ? (
                <>
                  <li>Process your purchase and deliver the product</li>
                  <li>Provide technical support</li>
                  <li>Send important updates about the product</li>
                  <li>Comply with legal obligations</li>
                </>
              ) : (
                <>
                  <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you voluntarily provide</li>
                  <li><strong>Payment Data:</strong> Payment information is processed securely through Paddle, our payment processor. We do not store credit card information.</li>
                  <li><strong>Usage Data:</strong> Information about how you access and use our website</li>
                  <li><strong>Device Data:</strong> Information about your device, including IP address, browser type, and operating system</li>
                </>
              )}
            </ul>
          </section>

          {!isStore && (
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{isStore ? '3. Payment Processing' : '4. Information Sharing'}</h2>
            {isStore ? (
              <p>Payments are processed by Paddle (paddle.com). We do not store your payment card details. Paddle's privacy policy applies to payment transactions.</p>
            ) : (
              <>
                <p>We do not sell, trade, or rent your personal information. We may share your information only:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who assist us in operating our website and conducting our business</li>
                  <li>With payment processors (Paddle) to process transactions</li>
                  <li>When required by law or to protect our rights</li>
                </ul>
              </>
            )}
          </section>

          {isStore ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage</h2>
                <p>Your information is stored securely and is only accessible to authorized personnel. We retain your information for as long as necessary to provide support and comply with legal obligations.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing</h2>
                <p>We do not sell, trade, or rent your personal information. We may share information only with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processors (Paddle) for transaction processing</li>
                  <li>Service providers who assist in our operations (under strict confidentiality)</li>
                  <li>Legal authorities if required by law</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                <p>Our website may use cookies to improve your experience. You can disable cookies in your browser settings.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Links</h2>
                <p>Our website may contain links to third-party sites (e.g., WordPress.org). We are not responsible for their privacy practices.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
                <p>For privacy-related questions, contact us at hello@shalconnects.com</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Privacy Policy</h2>
                <p>We may update this policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> support@shalconnects.com<br />
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

