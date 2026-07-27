import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, RefreshCw, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { getPipeline, rerunPipeline } from '../api/client';

function formatDuration(s) { return s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—'; }

const steps = ['Checkout', 'Install', 'Lint', 'Test', 'Security', 'Docker Build', 'Deploy', 'Health Check'];

export default function PipelineDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { getPipeline(id).then((r) => setP(r.data)).catch(() => navigate('/dashboard/pipelines')); }, [id]);

  if (!p) return <div className="page-loading">Loading...</div>;

  const stepStates = steps.map((_, i) => {
    if (p.status === 'SUCCESS') return 'done';
    if (p.status === 'FAILED') return i <= 4 ? 'done' : i === 5 ? 'failed' : 'pending';
    if (p.status === 'RUNNING') return i <= 3 ? 'done' : i === 4 ? 'active' : 'pending';
    return i === 0 ? 'active' : 'pending';
  });

  const handleRerun = async () => { await rerunPipeline(id); navigate('/dashboard/pipelines'); };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn icon-btn" onClick={() => navigate('/dashboard/pipelines')}><ArrowLeft size={18} /></button>
          <div><h1>Pipeline Detail</h1><p className="subtitle">{p.commitSha.slice(0, 7)} · {p.repository?.name}</p></div>
        </div>
        <button className="btn btn-primary" onClick={handleRerun}><RefreshCw size={14} /> Re-run Pipeline</button>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <div className="panel-title"><FileText size={18} /> Commit Info</div>
          <div className="detail-rows">
            <div className="detail-row"><span className="detail-label">Message</span><span className="detail-value">{p.commitMsg}</span></div>
            <div className="detail-row"><span className="detail-label">SHA</span><span className="detail-value mono">{p.commitSha}</span></div>
            <div className="detail-row"><span className="detail-label">Branch</span><span className="branch-badge"><GitBranch size={12} /> {p.branch}</span></div>
            <div className="detail-row"><span className="detail-label">Trigger</span><span className="detail-value">{p.trigger}</span></div>
            <div className="detail-row"><span className="detail-label">Status</span><span className={`status-badge ${p.status.toLowerCase()}`}><span className="dot" />{p.status}</span></div>
            <div className="detail-row"><span className="detail-label">Duration</span><span className="detail-value mono">{formatDuration(p.duration)}</span></div>
            <div className="detail-row"><span className="detail-label">Started</span><span className="detail-value">{new Date(p.startedAt).toLocaleString()}</span></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title"><CheckCircle2 size={18} /> Pipeline Steps</div>
          <div className="step-list">
            {steps.map((name, i) => (
              <div className={`step-item ${stepStates[i]}`} key={name}>
                <div className={`step-icon ${stepStates[i]}`}>
                  {stepStates[i] === 'done' ? <CheckCircle2 size={16} /> : stepStates[i] === 'failed' ? <XCircle size={16} /> : stepStates[i] === 'active' ? <Clock size={16} /> : <span className="step-num">{i + 1}</span>}
                </div>
                <span className="step-name">{name}</span>
                <span className={`step-status ${stepStates[i]}`}>{stepStates[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panels-grid" style={{ marginTop: 20 }}>
        <div className="panel">
          <div className="panel-title">Test Results</div>
          <div className="health-grid">
            <div className="health-item"><div className="health-label">Lint</div><div className={`health-value ${p.lintPassed ? 'green' : 'red'}`}>{p.lintPassed ? '✓ Passed' : '✗ Failed'}</div></div>
            <div className="health-item"><div className="health-label">Tests</div><div className={`health-value ${p.testsPassed ? 'green' : 'red'}`}>{p.testsPassed ? '✓ Passed' : p.testsPassed === false ? '✗ Failed' : '— Pending'}</div></div>
            <div className="health-item"><div className="health-label">Coverage</div><div className="health-value blue">{p.testCoverage ? `${p.testCoverage.toFixed(1)}%` : '—'}</div></div>
            <div className="health-item"><div className="health-label">Build</div><div className={`health-value ${p.buildPassed ? 'green' : 'red'}`}>{p.buildPassed ? '✓ Passed' : p.buildPassed === false ? '✗ Failed' : '— Pending'}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
