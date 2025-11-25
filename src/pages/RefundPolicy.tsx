import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function RefundPolicy() {
  usePageTitle('Refund Policy - Variation Images Pro');

  return (
    <div style={{ background: '#f9f9f9', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#2271b1', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
        <h1 style={{ color: '#2271b1', marginBottom: '30px' }}>Refund Policy</h1>
        <p style={{ marginBottom: '15px' }}><strong>Last Updated:</strong> November 2025</p>
        
        <div style={{ background: '#fff3cd', padding: '15px', borderLeft: '4px solid #ffc107', margin: '20px 0' }}>
          <strong>30-Day Money-Back Guarantee:</strong> We offer a full refund within 30 days of purchase if you're not satisfied with WooCommerce Variation Images Pro.
        </div>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>1. Refund Eligibility</h2>
        <p style={{ marginBottom: '15px' }}>You are eligible for a refund if:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>You request a refund within 30 days of purchase</li>
          <li>The Plugin does not work as described</li>
          <li>You experience technical issues we cannot resolve</li>
          <li>The Plugin is incompatible with your setup (after we've attempted to help)</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>2. How to Request a Refund</h2>
        <p style={{ marginBottom: '15px' }}>To request a refund:</p>
        <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Email us at <strong>hello@shalconnects.com</strong></li>
          <li>Include your order number or purchase email</li>
          <li>Briefly explain the reason for the refund request</li>
        </ol>
        <p style={{ marginBottom: '15px' }}>We will process your refund within 5-7 business days.</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>3. Refund Processing</h2>
        <p style={{ marginBottom: '15px' }}>Refunds will be issued to the original payment method used for purchase. Processing time depends on your payment provider (typically 5-10 business days).</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>4. What Happens After Refund</h2>
        <p style={{ marginBottom: '15px' }}>After a refund is processed:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Your license will be deactivated</li>
          <li>You must remove the Plugin from your websites</li>
          <li>You will no longer receive updates or support</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>5. Non-Refundable Situations</h2>
        <p style={{ marginBottom: '15px' }}>Refunds may not be available if:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>More than 30 days have passed since purchase</li>
          <li>You've violated our Terms & Conditions</li>
          <li>The issue is due to third-party conflicts (themes, other plugins) that we cannot control</li>
        </ul>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>6. Support Before Refund</h2>
        <p style={{ marginBottom: '15px' }}>We encourage you to contact our support team (hello@shalconnects.com) before requesting a refund. Many issues can be resolved quickly, and we're happy to help!</p>
        
        <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>7. Contact</h2>
        <p style={{ marginBottom: '15px' }}>For refund requests or questions, contact us at <strong>hello@shalconnects.com</strong></p>
      </div>
    </div>
  );
}
