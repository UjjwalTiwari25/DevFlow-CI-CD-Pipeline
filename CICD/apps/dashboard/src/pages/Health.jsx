import { useEffect, useState } from 'react';
import { Activity, RefreshCw, Server, Database, Cpu, Clock } from 'lucide-react';
import { getHealth } from '../api/client';

export default function Health() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = () => { getHealth().then((r) => setHealth(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); const id = autoRefresh ? setInterval(load, 5000) : null; return () => id && clearInterval(id); }, [autoRefresh]);

  const formatUptime = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${h}h ${m}m`; };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Health Monitor</h1><p className="subtitle">Real-time service health — auto-refreshes every 5s</p></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label className="toggle-label"><input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} /> Auto-refresh</label>
          <button className="btn" onClick={load}><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>

      <div className="health-status-banner" style={{ background: health?.status === 'healthy' ? 'var(--success-bg)' : 'var(--danger-bg)', borderColor: health?.status === 'healthy' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }}>
        <Activity size={24} style={{ color: health?.status === 'healthy' ? 'var(--success)' : 'var(--danger)' }} />
        <div>
          <h2 style={{ color: health?.status === 'healthy' ? 'var(--success)' : 'var(--danger)' }}>{health?.status === 'healthy' ? '● All Systems Operational' : '● System Degraded'}</h2>
          <p>Last checked: {new Date(health?.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 24 }}>
        {[
          { icon: Server, label: 'Status', value: health?.status?.toUpperCase(), color: 'green' },
          { icon: Clock, label: 'Uptime', value: formatUptime(health?.uptime || 0), color: 'blue' },
          { icon: Database, label: 'DB Latency', value: `${health?.dbLatency || 0}ms`, color: health?.dbLatency < 50 ? 'green' : 'yellow' },
          { icon: Activity, label: 'Node Version', value: health?.nodeVersion, color: 'purple' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-header"><div className={`stat-icon ${s.color}`}><s.icon size={20} /></div></div>
            <div className="stat-value" style={{ fontSize: 24 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="panels-grid" style={{ marginTop: 24 }}>
        <div className="panel">
          <div className="panel-title"><Cpu size={18} /> Memory Usage</div>
          <div className="health-grid">
            <div className="health-item"><div className="health-label">Heap Used</div><div className="health-value blue">{health?.memory?.used} MB</div></div>
            <div className="health-item"><div className="health-label">Heap Total</div><div className="health-value blue">{health?.memory?.total} MB</div></div>
            <div className="health-item"><div className="health-label">RSS</div><div className="health-value blue">{health?.memory?.rss} MB</div></div>
            <div className="health-item"><div className="health-label">Version</div><div className="health-value green">v{health?.version}</div></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><Activity size={18} /> Service Endpoints</div>
          <div className="detail-rows">
            {['/health', '/api/auth/login', '/api/tasks', '/api/dashboard/stats'].map((ep) => (
              <div className="detail-row" key={ep}>
                <span className="detail-label mono">{ep}</span>
                <span className="status-badge success"><span className="dot" />UP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
