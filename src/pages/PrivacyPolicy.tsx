import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function PrivacyPolicy() {
  usePageTitle('Privacy Policy - Variation Images Pro');

  return (
    <div style={{ background: '#f9f9f9', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#2271b1', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
        <h1 style={{ color: '#2271b1', marginBottom: '30px' }}>Privacy Policy</h1>
        <p style={{ marginBottom: '15px' }}><strong>Last Updated:</strong> November 2025</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>1. Information We Collect</h2>
        <p style={{ marginBottom: '15px' }}>When you purchase WooCommerce Variation Images Pro, we collect:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Name and email address (for order processing and support)</li>
          <li>Payment information (processed securely by Paddle, our payment processor)</li>
          <li>Website URL (optional, for license validation)</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>2. How We Use Your Information</h2>
        <p style={{ marginBottom: '15px' }}>We use collected information to:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Process your purchase and deliver the Plugin</li>
          <li>Provide technical support</li>
          <li>Send important updates about the Plugin</li>
          <li>Comply with legal obligations</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>3. Payment Processing</h2>
        <p style={{ marginBottom: '15px' }}>Payments are processed by Paddle (paddle.com). We do not store your payment card details. Paddle's privacy policy applies to payment transactions.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>4. Data Storage</h2>
        <p style={{ marginBottom: '15px' }}>Your information is stored securely and is only accessible to authorized personnel. We retain your information for as long as necessary to provide support and comply with legal obligations.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>5. Data Sharing</h2>
        <p style={{ marginBottom: '15px' }}>We do not sell, trade, or rent your personal information. We may share information only with:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Payment processors (Paddle) for transaction processing</li>
          <li>Service providers who assist in our operations (under strict confidentiality)</li>
          <li>Legal authorities if required by law</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>6. Your Rights</h2>
        <p style={{ marginBottom: '15px' }}>You have the right to:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>7. Cookies</h2>
        <p style={{ marginBottom: '15px' }}>Our website may use cookies to improve your experience. You can disable cookies in your browser settings.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>8. Third-Party Links</h2>
        <p style={{ marginBottom: '15px' }}>Our website may contain links to third-party sites (e.g., WordPress.org). We are not responsible for their privacy practices.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>9. Contact</h2>
        <p style={{ marginBottom: '15px' }}>For privacy-related questions, contact us at hello@shalconnects.com</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>10. Changes to Privacy Policy</h2>
        <p style={{ marginBottom: '15px' }}>We may update this policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.</p>
      </div>
    </div>
  );
}
