import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Activity, Clock, Zap, ArrowUpRight, ArrowDownRight, GitBranch, Shield, Rocket } from 'lucide-react';
import { getStats, getPipelines, getDeployments } from '../api/client';

function formatDuration(s) { return s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—'; }

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pipelines, setPipelines] = useState([]);
  const [deploys, setDeploys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = (silently = false) => {
    if (!silently) setLoading(true);
    Promise.all([
      getStats().then((r) => setStats(r.data)),
      getPipelines('limit=5').then((r) => setPipelines(r.data.pipelines)),
      getDeployments('limit=5').then((r) => setDeploys(r.data.deployments)),
    ]).catch((err) => {
      setError(err.message || 'Failed to load dashboard data. Please try again.');
    }).finally(() => { if (!silently) setLoading(false); });
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;
  if (error) return (
    <div className="page">
      <div className="page-header"><div><h1>Dashboard</h1><p className="subtitle">Overview of your CI/CD platform</p></div></div>
      <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
        <strong>Error:</strong> {error}
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Dashboard</h1><p className="subtitle">Overview of your CI/CD platform</p></div>
      </div>

      <div className="stats-grid">
        {[
          { icon: CheckCircle2, color: 'green', value: stats?.totalRuns || 0, label: 'Total Runs' },
          { icon: Activity, color: 'blue', value: `${stats?.successRate || 0}%`, label: 'Success Rate' },
          { icon: Clock, color: 'yellow', value: formatDuration(stats?.avgDuration), label: 'Avg Duration' },
          { icon: Zap, color: 'purple', value: stats?.deploysToday || 0, label: 'Deploys Today' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-header">
              <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
              {s.trend && <span className={`stat-trend ${s.up ? 'up' : 'down'}`}>{s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.trend}</span>}
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <div className="section-title"><GitBranch size={20} /> Recent Pipelines</div>
        <button className="btn" onClick={() => navigate('/dashboard/pipelines')}>View All</button>
      </div>
      <div className="data-table">
        <div className="table-header four-col"><div>Commit</div><div>Branch</div><div>Status</div><div>Duration</div></div>
        {pipelines.map((p) => (
          <div className="table-row four-col" key={p.id} onClick={() => navigate(`/dashboard/pipelines/${p.id}`)}>
            <div className="cell-primary"><span className="cell-title">{p.commitMsg}</span><span className="cell-sub">{p.commitSha.slice(0, 7)}</span></div>
            <div><span className="branch-badge"><GitBranch size={12} /> {p.branch}</span></div>
            <div><span className={`status-badge ${p.status.toLowerCase()}`}><span className="dot" />{p.status}</span></div>
            <div className="cell-mono">{formatDuration(p.duration)}</div>
          </div>
        ))}
      </div>

      <div className="panels-grid" style={{ marginTop: 24 }}>
        <div className="panel">
          <div className="panel-title"><Rocket size={18} /> Recent Deployments</div>
          <div className="timeline">
            {deploys.map((d) => (
              <div className="timeline-item" key={d.id}>
                <div className={`timeline-dot ${d.status.toLowerCase()}`} />
                <div className="timeline-title">{d.version} — {d.status}</div>
                <div className="timeline-meta">{d.commitSha.slice(0, 7)} · {d.repository?.name} · {new Date(d.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><Shield size={18} /> Quick Stats</div>
          <div className="health-grid">
            <div className="health-item"><div className="health-label">Repositories</div><div className="health-value blue">{stats?.totalRepos || 0}</div></div>
            <div className="health-item"><div className="health-label">Active Scans</div><div className="health-value green">{stats?.activeScans || 0}</div></div>
            <div className="health-item"><div className="health-label">Success Rate</div><div className="health-value green">{stats?.successRate || 0}%</div></div>
            <div className="health-item"><div className="health-label">Deploys Today</div><div className="health-value blue">{stats?.deploysToday || 0}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
