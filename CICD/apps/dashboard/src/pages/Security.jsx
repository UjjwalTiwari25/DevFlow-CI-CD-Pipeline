import { useEffect, useState } from 'react';
import { Shield, RefreshCw, Filter, AlertTriangle } from 'lucide-react';
import { getSecurityScans } from '../api/client';

export default function Security() {
  const [data, setData] = useState({ scans: [], pagination: {} });
  const [filter, setFilter] = useState({ status: '', scanType: '' });
  const [loading, setLoading] = useState(true);

  const load = (page = 1) => {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 20, ...Object.fromEntries(Object.entries(filter).filter(([, v]) => v)) });
    getSecurityScans(q.toString()).then((r) => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const scanIcons = { dependency: '📦', filesystem: '🔍', container: '🐳', sast: '🛡️', secrets: '🔑' };
  const totals = data.scans.reduce((a, s) => ({ c: a.c + s.criticalCount, h: a.h + s.highCount, m: a.m + s.mediumCount, l: a.l + s.lowCount }), { c: 0, h: 0, m: 0, l: 0 });

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Security</h1><p className="subtitle">{data.pagination.total || 0} scan results</p></div>
        <button className="btn" onClick={() => load()}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-header"><div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><AlertTriangle size={20} /></div></div><div className="stat-value" style={{ color: totals.c ? '#ef4444' : 'var(--success)' }}>{totals.c}</div><div className="stat-label">Critical</div></div>
        <div className="stat-card"><div className="stat-header"><div className="stat-icon yellow"><AlertTriangle size={20} /></div></div><div className="stat-value" style={{ color: totals.h ? '#f59e0b' : 'var(--success)' }}>{totals.h}</div><div className="stat-label">High</div></div>
        <div className="stat-card"><div className="stat-header"><div className="stat-icon blue"><Shield size={20} /></div></div><div className="stat-value">{totals.m}</div><div className="stat-label">Medium</div></div>
        <div className="stat-card"><div className="stat-header"><div className="stat-icon green"><Shield size={20} /></div></div><div className="stat-value">{totals.l}</div><div className="stat-label">Low</div></div>
      </div>

      <div className="filter-bar">
        <Filter size={16} />
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All Statuses</option>
          {['PENDING', 'RUNNING', 'PASSED', 'FAILED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filter.scanType} onChange={(e) => setFilter({ ...filter, scanType: e.target.value })}>
          <option value="">All Types</option>
          {['dependency', 'filesystem', 'container', 'sast', 'secrets'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <div className="page-loading">Loading...</div> : (
        <div className="data-table">
          <div className="table-header six-col"><div>Scanner</div><div>Repository</div><div>Type</div><div>Status</div><div>Vulnerabilities</div><div>Date</div></div>
          {data.scans.map((s) => (
            <div className="table-row six-col" key={s.id}>
              <div className="cell-primary"><span className="cell-title">{scanIcons[s.scanType]} {s.scanner}</span></div>
              <div className="cell-sub">{s.repository?.name}</div>
              <div><span className="branch-badge">{s.scanType}</span></div>
              <div><span className={`status-badge ${s.status === 'PASSED' ? 'success' : s.status === 'FAILED' ? 'failed' : 'running'}`}><span className="dot" />{s.status}</span></div>
              <div className="vuln-counts">
                {s.criticalCount > 0 && <span className="vuln critical">{s.criticalCount}C</span>}
                {s.highCount > 0 && <span className="vuln high">{s.highCount}H</span>}
                {s.mediumCount > 0 && <span className="vuln medium">{s.mediumCount}M</span>}
                {s.lowCount > 0 && <span className="vuln low">{s.lowCount}L</span>}
                {!s.criticalCount && !s.highCount && !s.mediumCount && !s.lowCount && <span className="vuln clean">Clean</span>}
              </div>
              <div className="cell-sub">{new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
