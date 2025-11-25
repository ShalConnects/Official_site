import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function TermsOfService() {
  usePageTitle('Terms & Conditions - Variation Images Pro');

  return (
    <div style={{ background: '#f9f9f9', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#2271b1', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
        <h1 style={{ color: '#2271b1', marginBottom: '30px' }}>Terms & Conditions</h1>
        <p style={{ marginBottom: '15px' }}><strong>Last Updated:</strong> November 2025</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>1. Agreement to Terms</h2>
        <p style={{ marginBottom: '15px' }}>By purchasing and using WooCommerce Variation Images Pro (the "Plugin"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not purchase or use the Plugin.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>2. Company Information</h2>
        <p style={{ marginBottom: '15px' }}>
          <strong>Vendor:</strong> Shalauddin Kader (trading as ShalConnects)<br />
          <strong>Product:</strong> WooCommerce Variation Images Pro<br />
          <strong>Contact:</strong> hello@shalconnects.com
        </p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>3. License Grant</h2>
        <p style={{ marginBottom: '15px' }}>Upon purchase, you are granted a non-exclusive, non-transferable license to use the Plugin on unlimited websites owned or operated by you.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>4. License Restrictions</h2>
        <p style={{ marginBottom: '15px' }}>You may NOT:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Redistribute, resell, or sublicense the Plugin</li>
          <li>Share your license key with others</li>
          <li>Remove copyright notices or branding</li>
          <li>Use the Plugin for illegal purposes</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>5. Updates</h2>
        <p style={{ marginBottom: '15px' }}>Your purchase includes lifetime updates for the version you purchased. Major version upgrades may require a new purchase.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>6. Support</h2>
        <p style={{ marginBottom: '15px' }}>Technical support is provided via email (hello@shalconnects.com) for the duration of your license. Support does not include custom development or theme modifications.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>7. Refund Policy</h2>
        <p style={{ marginBottom: '15px' }}>We offer a 30-day money-back guarantee. See our <Link to="/refund" style={{ color: '#2271b1', textDecoration: 'none' }}>Refund Policy</Link> for details.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>8. Warranty</h2>
        <p style={{ marginBottom: '15px' }}>The Plugin is provided "as is" without warranty of any kind. We do not guarantee that the Plugin will meet your requirements or be error-free.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>9. Limitation of Liability</h2>
        <p style={{ marginBottom: '15px' }}>In no event shall ShalConnects be liable for any indirect, incidental, or consequential damages arising from the use of the Plugin.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>10. Changes to Terms</h2>
        <p style={{ marginBottom: '15px' }}>We reserve the right to modify these terms at any time. Continued use of the Plugin after changes constitutes acceptance of the new terms.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>11. Contact</h2>
        <p style={{ marginBottom: '15px' }}>For questions about these terms, contact us at hello@shalconnects.com</p>
      </div>
    </div>
  );
}
