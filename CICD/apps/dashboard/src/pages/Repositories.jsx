import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, Plus, Trash2, ExternalLink, RefreshCw, Play } from 'lucide-react';

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
import { getRepos, getGithubRepos, createRepo, deleteRepo, triggerPipeline } from '../api/client';
import { useToast } from '../components/ToastContext';

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [triggeringId, setTriggeringId] = useState(null);
  const { addToast } = useToast();

  const load = () => { setLoading(true); setError(null); getRepos().then((r) => setRepos(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleShowForm = async () => {
    setShowForm(!showForm);
    if (!showForm && githubRepos.length === 0) {
      setLoadingGithub(true);
      try {
        const res = await getGithubRepos();
        setGithubRepos(res.data);
      } catch (err) {
        if (err.message?.toLowerCase().includes('token')) {
          setError('Your GitHub session has expired. Please logout and login again.');
        } else {
          setError('Failed to fetch repositories from GitHub. Ensure your deployment is updated and try again.');
        }
      } finally {
        setLoadingGithub(false);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form || actionLoading) return;
    setActionLoading(true);
    setError(null);
    try {
      await createRepo(form);
      addToast('Repository connected successfully', 'success');
      setForm(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || 'Failed to connect repository');
      addToast('Failed to connect repository', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => { 
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteRepo(id); 
      addToast('Repository deleted', 'success');
      load(); 
    } catch (err) {
      addToast('Failed to delete repository', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTrigger = async (id) => {
    if (triggeringId) return;
    setTriggeringId(id);
    try {
      await triggerPipeline(id);
      addToast('Pipeline triggered successfully', 'success');
      load();
    } catch (err) {
      addToast(err.message || 'Failed to trigger pipeline', 'error');
    } finally {
      setTriggeringId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Repositories</h1><p className="subtitle">{repos.length} connected repositories</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handleShowForm}><Plus size={14} /> Add Repository</button>
          <button className="btn" onClick={load}><RefreshCw size={14} /></button>
        </div>
      </div>

      {showForm && (
        <div className="panel" style={{ marginBottom: 20 }}>
          {error && <div style={{ padding: 12, marginBottom: 16, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6 }}>{error}</div>}
          {loadingGithub ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: '10px' }} />
              <p>Fetching your repositories from GitHub...</p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="repo-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>
                  <GithubIcon size={16} /> Select a GitHub Repository to Connect
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select 
                    onChange={(e) => {
                      const repo = githubRepos.find(r => r.fullName === e.target.value);
                      setForm(repo);
                    }}
                    value={form?.fullName || ''}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '15px', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Choose a repository...</option>
                    {githubRepos.map(r => (
                      <option key={r.fullName} value={r.fullName}>{r.fullName}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary" disabled={!form || actionLoading} style={{ padding: '12px 24px', height: '45px' }}>
                    {actionLoading ? <RefreshCw size={16} className="spin" /> : <Plus size={16} />} 
                    {actionLoading ? 'Connecting...' : 'Connect Repo'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? <div className="page-loading">Loading...</div> : (
        <div className="repo-grid">
          {repos.map((r) => (
            <div className="repo-card" key={r.id} onClick={() => navigate(`/dashboard/repos/${r.id}/pipelines`)} style={{ cursor: 'pointer' }}>
              <div className="repo-header">
                <div className="repo-icon"><FolderGit2 size={20} /></div>
                <div className="repo-actions">
                  {r.lastWebhookReceivedAt && <span title={`Last Webhook: ${new Date(r.lastWebhookReceivedAt).toLocaleString()}`} style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 8, background: '#10b981' }} />}
                  <button title="Trigger Pipeline" className="btn sm" disabled={triggeringId === r.id} onClick={(e) => { e.stopPropagation(); handleTrigger(r.id); }}><Play size={12} className={triggeringId === r.id ? 'spin' : ''} /></button>
                  <a href={r.url} target="_blank" rel="noreferrer" className="btn sm" onClick={(e) => e.stopPropagation()}><ExternalLink size={12} /></a>
                  <button className="btn sm danger" disabled={deletingId === r.id} onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}><Trash2 size={12} className={deletingId === r.id ? 'spin' : ''} /></button>
                </div>
              </div>
              <h3 className="repo-name">{r.name}</h3>
              <p className="repo-full">{r.fullName}</p>
              <div className="repo-meta">
                <span className="repo-lang">{r.language}</span>
                <span className={`status-dot-sm ${r.isActive ? 'active' : ''}`} />
              </div>
              <div className="repo-stats">
                <div><span className="stat-num">{r._count?.pipelines || 0}</span><span className="stat-lbl">Runs</span></div>
                <div><span className="stat-num">{r._count?.deployments || 0}</span><span className="stat-lbl">Deploys</span></div>
                <div><span className="stat-num">{r._count?.scans || 0}</span><span className="stat-lbl">Scans</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
