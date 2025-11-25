import PageLayout from '../components/PageLayout';
import { isStoreContext } from '../utils/storeUtils';

export default function TermsOfService() {
  const isStore = isStoreContext();
  
  return (
    <PageLayout title="Terms of Service">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Terms {isStore ? '& Conditions' : 'of Service'}</h1>
        <p className="text-gray-400 mb-6">Last updated: November 2025</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{isStore ? '1. Agreement to Terms' : 'Company Information'}</h2>
            {isStore ? (
              <p>
                By purchasing and using our WordPress plugins and themes (the "Products"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not purchase or use our Products.
              </p>
            ) : (
              <>
                <p>
                  <strong>Trading Name/Brand:</strong> ShalConnects<br />
                  <strong>Website:</strong> shalconnects.com<br />
                  <strong>Email:</strong> support@shalconnects.com<br />
                  <strong>Business Owner:</strong> Shalauddin Kader
                </p>
                <p className="mt-4">
                  These Terms of Service ("Terms") govern your use of the website and services provided by ShalConnects ("we," "us," or "our"). ShalConnects is the trading name for the digital agency operated by Shalauddin Kader.
                </p>
              </>
            )}
          </section>

          {isStore && (
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Company Information</h2>
              <p>
                <strong>Vendor:</strong> Shalauddin Kader (trading as ShalConnects)<br />
                <strong>Products:</strong> WordPress Plugins and Themes<br />
                <strong>Contact:</strong> hello@shalconnects.com
              </p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{isStore ? '3. License Grant' : '1. Agreement to Terms'}</h2>
            {isStore ? (
              <p>
                Upon purchase, you are granted a non-exclusive, non-transferable license to use the purchased product (plugin or theme) on unlimited websites owned or operated by you.
              </p>
            ) : (
              <p>
                By accessing or using shalconnects.com ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
              </p>
            )}
          </section>

          {!isStore && (
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
          )}

          {isStore ? (
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. License Restrictions</h2>
              <p>You may NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Redistribute, resell, or sublicense the product</li>
                <li>Share your license key with others</li>
                <li>Remove copyright notices or branding</li>
                <li>Use the product for illegal purposes</li>
              </ul>
            </section>
          ) : (
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
          )}

          {isStore ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Updates</h2>
                <p>Your purchase includes lifetime updates for the version you purchased. Major version upgrades may require a new purchase.</p>
              </section>
              <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Support</h2>
              <p>Technical support is provided via email (hello@shalconnects.com) for the duration of your license. Support does not include custom development or modifications beyond the product's intended functionality.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Refund Policy</h2>
                <p>We offer a 30-day money-back guarantee. See our <a href="/refund" className="text-blue-400 hover:underline">Refund Policy</a> for details.</p>
              </section>
              <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Warranty</h2>
              <p>Our products are provided "as is" without warranty of any kind. We do not guarantee that the product will meet your requirements or be error-free.</p>
              </section>
              <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p>In no event shall ShalConnects be liable for any indirect, incidental, or consequential damages arising from the use of our products.</p>
              </section>
              <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of our products after changes constitutes acceptance of the new terms.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Contact</h2>
                <p>For questions about these terms, contact us at hello@shalconnects.com</p>
              </section>
            </>
          ) : (
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
          )}

          {!isStore && (
            <>
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
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

