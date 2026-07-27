import { Check, Zap, Shield, Server } from 'lucide-react';
import './PricingCards.css';

export default function PricingCards({ onUpgrade }) {
  return (
    <div className="pricing-grid">
      {/* Basic Plan */}
      <div className="pricing-card">
        <div className="pricing-header">
          <div className="pricing-icon basic"><Server size={24} /></div>
          <h3 className="pricing-title">Basic</h3>
          <p className="pricing-desc">For individuals and small teams starting out.</p>
        </div>
        <div className="pricing-price">
          <span className="currency">$</span>0<span className="period">/mo</span>
        </div>
        <div className="pricing-features">
          <div className="feature-item"><Check size={18} className="feature-icon" /> Up to 3 Repositories</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> 100 Build Minutes</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> Basic CI/CD Pipelines</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> Community Support</div>
        </div>
        <button className="btn btn-full pricing-btn basic-btn" onClick={() => onUpgrade?.('basic')}>
          Get Started
        </button>
      </div>

      {/* Premium Plan */}
      <div className="pricing-card premium">
        <div className="premium-badge">RECOMMENDED</div>
        <div className="pricing-header">
          <div className="pricing-icon premium"><Zap size={24} /></div>
          <h3 className="pricing-title">Premium</h3>
          <p className="pricing-desc">For growing teams that need more power and speed.</p>
        </div>
        <div className="pricing-price">
          <span className="currency">$</span>29<span className="period">/mo</span>
        </div>
        <div className="pricing-features">
          <div className="feature-item"><Check size={18} className="feature-icon premium-icon" /> Unlimited Repositories</div>
          <div className="feature-item"><Check size={18} className="feature-icon premium-icon" /> 2,000 Build Minutes</div>
          <div className="feature-item"><Check size={18} className="feature-icon premium-icon" /> Parallel Job Execution</div>
          <div className="feature-item"><Check size={18} className="feature-icon premium-icon" /> Advanced Security Scans</div>
          <div className="feature-item"><Check size={18} className="feature-icon premium-icon" /> Priority Email Support</div>
        </div>
        <button className="btn btn-full btn-primary pricing-btn" onClick={() => onUpgrade?.('premium')}>
          Upgrade to Premium
        </button>
      </div>

      {/* Enterprise Plan */}
      <div className="pricing-card">
        <div className="pricing-header">
          <div className="pricing-icon enterprise"><Shield size={24} /></div>
          <h3 className="pricing-title">Enterprise</h3>
          <p className="pricing-desc">For large organizations with strict security needs.</p>
        </div>
        <div className="pricing-price">
          <span className="currency">$</span>99<span className="period">/mo</span>
        </div>
        <div className="pricing-features">
          <div className="feature-item"><Check size={18} className="feature-icon" /> Custom Build Runners</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> Unlimited Build Minutes</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> SSO & SAML Login</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> Custom Compliance Rules</div>
          <div className="feature-item"><Check size={18} className="feature-icon" /> 24/7 Dedicated Support</div>
        </div>
        <button className="btn btn-full pricing-btn enterprise-btn" onClick={() => onUpgrade?.('enterprise')}>
          Contact Sales
        </button>
      </div>
    </div>
  );
}
