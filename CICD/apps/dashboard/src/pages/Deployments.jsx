import { useEffect, useState } from 'react';
import { Rocket, RefreshCw, RotateCcw, Filter } from 'lucide-react';
import { getDeployments, triggerDeploy, rollbackDeploy, getRepos } from '../api/client';
import { useAppEvents } from '../components/EventContext';
import { useToast } from '../components/ToastContext';

export default function Deployments() {
  const [data, setData] = useState({ deployments: [], pagination: {} });
  const [repos, setRepos] = useState([]);
  const [filter, setFilter] = useState({ status: '', environment: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { addToast } = useToast();

  const load = (page = 1, silently = false) => {
    if (!silently) setLoading(true);
    const q = new URLSearchParams({ page, limit: 15, ...Object.fromEntries(Object.entries(filter).filter(([, v]) => v)) });
    getDeployments(q.toString()).then((r) => setData(r.data)).finally(() => { if (!silently) setLoading(false); });
  };

  const { lastEvent } = useAppEvents();

  useEffect(() => { 
    load(); 
    getRepos().then((r) => setRepos(r.data)); 
  }, [filter, data.pagination.page]);

  useEffect(() => {
    if (lastEvent) load(data.pagination.page || 1, true);
  }, [lastEvent]);

  const handleDeploy = async (repoId) => {
    if (actionLoading) return;
    setActionLoading('deploy');
    try {
      await triggerDeploy(repoId);
      addToast('Deployment triggered successfully', 'success');
      load();
    } catch (err) {
      addToast(err.message || 'Failed to trigger deployment', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRollback = async (e, id) => {
    e.stopPropagation();
    if (actionLoading) return;
    setActionLoading(id);
    try {
      await rollbackDeploy(id);
      addToast('Rollback initiated', 'success');
      load();
    } catch (err) {
      addToast(err.message || 'Failed to rollback deployment', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = { LIVE: 'success', DEPLOYING: 'running', FAILED: 'failed', ROLLED_BACK: 'queued', PENDING: 'queued' };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Deployments</h1><p className="subtitle">{data.pagination.total || 0} total deployments</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {repos[0] && <button className="btn btn-primary" disabled={actionLoading === 'deploy'} onClick={() => handleDeploy(repos[0].id)}><Rocket size={14} className={actionLoading === 'deploy' ? 'spin' : ''} /> Deploy Now</button>}
          <button className="btn" onClick={() => load()}><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>

      <div className="filter-bar">
        <Filter size={16} />
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All Statuses</option>
          {['PENDING', 'DEPLOYING', 'LIVE', 'FAILED', 'ROLLED_BACK'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="page-loading">Loading...</div> : (
        <div className="data-table-wrapper">
          <div className="data-table">
            <div className="table-header six-col"><div>Version</div><div>Repository</div><div>Environment</div><div>Status</div><div>Triggered</div><div>Actions</div></div>
            {data.deployments.map((d) => (
              <div className="table-row six-col" key={d.id}>
                <div className="cell-primary"><span className="cell-title">{d.version}</span><span className="cell-sub">{d.commitSha.slice(0, 7)}</span></div>
                <div className="cell-sub">{d.repository?.name}</div>
                <div><span className="branch-badge">{d.environment}</span></div>
                <div><span className={`status-badge ${statusColors[d.status]}`}><span className="dot" />{d.status}</span></div>
                <div className="cell-sub">{d.triggeredBy} · {new Date(d.createdAt).toLocaleString()}</div>
                <div>
                  {d.status === 'LIVE' && <button className="btn sm danger" disabled={actionLoading === d.id} onClick={(e) => handleRollback(e, d.id)}><RotateCcw size={12} className={actionLoading === d.id ? 'spin' : ''} /> {actionLoading === d.id ? '...' : 'Rollback'}</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.pagination.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => (
            <button key={i} className={`btn sm ${data.pagination.page === i + 1 ? 'btn-primary' : ''}`} onClick={() => load(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
