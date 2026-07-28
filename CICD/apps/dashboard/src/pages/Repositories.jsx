import { useEffect, useState } from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink, RefreshCw, Github } from 'lucide-react';
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Github size={14} /> Select a GitHub Repository</label>
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
