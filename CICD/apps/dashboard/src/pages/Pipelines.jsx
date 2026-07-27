import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, RefreshCw, Filter } from 'lucide-react';
import { getPipelines, rerunPipeline } from '../api/client';

function formatDuration(s) { return s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—'; }
function timeAgo(d) { const s = Math.floor((Date.now() - new Date(d)) / 1000); if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; }

export default function Pipelines() {
  const [data, setData] = useState({ pipelines: [], pagination: {} });
  const [filter, setFilter] = useState({ status: '', branch: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = (page = 1) => {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 15, ...Object.fromEntries(Object.entries(filter).filter(([, v]) => v)) });
    getPipelines(q.toString()).then((r) => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleRerun = async (e, id) => {
    e.stopPropagation();
    await rerunPipeline(id);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Pipelines</h1><p className="subtitle">{data.pagination.total || 0} total pipeline runs</p></div>
        <button className="btn" onClick={() => load()}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="filter-bar">
        <Filter size={16} />
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All Statuses</option>
          {['QUEUED', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Filter by branch..." value={filter.branch} onChange={(e) => setFilter({ ...filter, branch: e.target.value })} />
      </div>

      {loading ? <div className="page-loading">Loading...</div> : (
        <div className="data-table-wrapper">
          <div className="data-table">
            <div className="table-header six-col"><div>Commit</div><div>Repository</div><div>Branch</div><div>Status</div><div>Duration</div><div>Actions</div></div>
            {data.pipelines.map((p) => (
              <div className="table-row six-col" key={p.id} onClick={() => navigate(`/dashboard/pipelines/${p.id}`)}>
                <div className="cell-primary"><span className="cell-title">{p.commitMsg}</span><span className="cell-sub">{p.commitSha.slice(0, 7)} · {timeAgo(p.startedAt)}</span></div>
                <div className="cell-sub">{p.repository?.name}</div>
                <div><span className="branch-badge"><GitBranch size={12} /> {p.branch}</span></div>
                <div><span className={`status-badge ${p.status.toLowerCase()}`}><span className="dot" />{p.status}</span></div>
                <div className="cell-mono">{formatDuration(p.duration)}</div>
                <div><button className="btn sm" onClick={(e) => handleRerun(e, p.id)}><RefreshCw size={12} /> Re-run</button></div>
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
