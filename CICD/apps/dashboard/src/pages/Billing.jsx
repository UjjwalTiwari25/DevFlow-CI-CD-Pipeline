import { useState } from 'react';
import { Check, Zap } from 'lucide-react';

export default function Billing() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Simulate redirect to Stripe checkout
    setTimeout(() => {
      alert("Redirecting to Stripe Checkout...");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Billing & Plans</h1>
          <p className="subtitle">Manage your subscription and usage limits.</p>
        </div>
      </div>

      <div className="panels-grid" style={{ marginTop: 40, alignItems: 'start' }}>
        
        {/* FREE PLAN */}
        <div className="panel" style={{ border: '2px solid var(--border)' }}>
          <div className="panel-title" style={{ fontSize: 24, marginBottom: 8 }}>Free Trial</div>
          <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>$0<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}>/mo</span></div>
          
          <div className="detail-rows" style={{ marginBottom: 32 }}>
            <div className="detail-row"><Check size={16} color="var(--success)" /> Up to 5 Repositories</div>
            <div className="detail-row"><Check size={16} color="var(--success)" /> 30-Day Trial Period</div>
            <div className="detail-row"><Check size={16} color="var(--success)" /> Basic CI/CD Pipelines</div>
            <div className="detail-row" style={{ color: 'var(--text-dim)' }}><Check size={16} color="var(--border)" /> No Priority Support</div>
          </div>
          
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled>
            Current Plan
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="panel" style={{ border: '2px solid var(--primary)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -12, right: 24, background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>RECOMMENDED</div>
          <div className="panel-title" style={{ fontSize: 24, marginBottom: 8, color: 'var(--primary)' }}>Pro</div>
          <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>$29<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}>/mo</span></div>
          
          <div className="detail-rows" style={{ marginBottom: 32 }}>
            <div className="detail-row"><Check size={16} color="var(--primary)" /> Unlimited Repositories</div>
            <div className="detail-row"><Check size={16} color="var(--primary)" /> Advanced Security Scanning</div>
            <div className="detail-row"><Check size={16} color="var(--primary)" /> Parallel Job Execution</div>
            <div className="detail-row"><Check size={16} color="var(--primary)" /> Priority Support</div>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleUpgrade} disabled={loading}>
            <Zap size={16} /> {loading ? 'Processing...' : 'Upgrade to Pro'}
          </button>
        </div>

      </div>
    </div>
  );
}
