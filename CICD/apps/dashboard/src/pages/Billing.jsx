import { useState } from 'react';
import PricingCards from '../components/PricingCards';

export default function Billing() {
  const handleUpgrade = (planType) => {
    window.dispatchEvent(new Event('req_start'));
    // Simulate API call for upgrading plan
    setTimeout(() => {
      window.dispatchEvent(new Event('req_end'));
      alert(`Successfully redirected to checkout for ${planType} plan!`);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1>Subscription Plans</h1>
          <p className="subtitle">Choose the perfect plan for your continuous delivery needs.</p>
        </div>
      </div>

      <PricingCards onUpgrade={handleUpgrade} />
      
      <div style={{ marginTop: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>All plans include a 14-day free trial. No credit card required to start.</p>
      </div>
    </div>
  );
}
