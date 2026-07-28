import { useEffect, useState } from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
import { getRepos, getGithubRepos, createRepo, deleteRepo } from '../api/client';

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

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
        setError('Failed to fetch repositories from GitHub');
      } finally {
        setLoadingGithub(false);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    try {
      await createRepo(form);
      setForm(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || 'Failed to create repository');
    }
  };

  const handleDelete = async (id) => { await deleteRepo(id); load(); };

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
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading repositories from GitHub...</div>
          ) : (
            <form onSubmit={handleCreate} className="repo-form" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><GithubIcon size={14} /> Select a GitHub Repository</label>
                <select 
                  onChange={(e) => {
                    const repo = githubRepos.find(r => r.fullName === e.target.value);
                    setForm(repo);
                  }}
                  value={form?.fullName || ''}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <option value="" disabled>Select repository...</option>
                  {githubRepos.map(r => (
                    <option key={r.fullName} value={r.fullName}>{r.fullName}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={!form} style={{ padding: '10px 16px' }}><Plus size={14} /> Connect</button>
            </form>
          )}
        </div>
      )}

      {loading ? <div className="page-loading">Loading...</div> : (
        <div className="repo-grid">
          {repos.map((r) => (
            <div className="repo-card" key={r.id}>
              <div className="repo-header">
                <div className="repo-icon"><FolderGit2 size={20} /></div>
                <div className="repo-actions">
                  <a href={r.url} target="_blank" rel="noreferrer" className="btn sm"><ExternalLink size={12} /></a>
                  <button className="btn sm danger" onClick={() => handleDelete(r.id)}><Trash2 size={12} /></button>
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
