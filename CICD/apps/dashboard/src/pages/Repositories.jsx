import { useEffect, useState } from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { getRepos, createRepo, deleteRepo } from '../api/client';

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', fullName: '', url: '', language: 'JavaScript' });
  const [error, setError] = useState(null);

  const load = () => { setLoading(true); setError(null); getRepos().then((r) => setRepos(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createRepo(form);
      setForm({ name: '', fullName: '', url: '', language: 'JavaScript' });
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
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={14} /> Add Repository</button>
          <button className="btn" onClick={load}><RefreshCw size={14} /></button>
        </div>
      </div>

      {showForm && (
        <div className="panel" style={{ marginBottom: 20 }}>
          {error && <div style={{ padding: 12, marginBottom: 16, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6 }}>{error}</div>}
          <form onSubmit={handleCreate} className="repo-form">
            <div className="form-group"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="my-api" /></div>
            <div className="form-group"><label>Full Name</label><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="username/my-api" /></div>
            <div className="form-group"><label>URL</label><input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://github.com/..." /></div>
            <div className="form-group"><label>Language</label><select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}><option>JavaScript</option><option>TypeScript</option><option>Python</option><option>Go</option><option>Rust</option></select></div>
            <button type="submit" className="btn btn-primary"><Plus size={14} /> Create</button>
          </form>
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
