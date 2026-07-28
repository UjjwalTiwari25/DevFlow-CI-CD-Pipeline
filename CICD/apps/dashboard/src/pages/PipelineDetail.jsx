import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, RefreshCw, CheckCircle2, XCircle, Clock, FileText, Copy } from 'lucide-react';
import { getPipeline, rerunPipeline, getPipelineLogs } from '../api/client';
import { useAppEvents } from '../components/EventContext';

function formatDuration(s) { return s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—'; }

const steps = ['Checkout', 'Install', 'Lint', 'Test', 'Security', 'Docker Build', 'Deploy', 'Health Check'];

export default function PipelineDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);

  const load = () => { 
    getPipeline(id).then((r) => setP(r.data)).catch(() => navigate('/dashboard/pipelines')); 
    getPipelineLogs(id).then((r) => setLogs(r.data)).catch(() => {});
  };
  const { lastEvent } = useAppEvents();

  useEffect(() => { 
    load();
  }, [id]);

  useEffect(() => {
    if (lastEvent && lastEvent.pipelineId === id) load();
  }, [lastEvent, id]);

  if (!p) return <div className="page-loading">Loading...</div>;

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
            {(p.steps && p.steps.length > 0) ? p.steps.map((step, i) => {
              const state = step.status === 'SUCCESS' ? 'done' : step.status === 'FAILED' ? 'failed' : step.status === 'RUNNING' ? 'active' : 'pending';
              return (
                <div className={`step-item ${state}`} key={step.id}>
                  <div className={`step-icon ${state}`}>
                    {state === 'done' ? <CheckCircle2 size={16} /> : state === 'failed' ? <XCircle size={16} /> : state === 'active' ? <Clock size={16} /> : <span className="step-num">{i + 1}</span>}
                  </div>
                  <span className="step-name">{step.name}</span>
                  <span className={`step-status ${state}`}>{state}</span>
                </div>
              );
            }) : (
              <div style={{ color: 'var(--text-secondary)' }}>No step data available.</div>
            )}
          </div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="panel" style={{ marginTop: 20 }}>
          <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><FileText size={18} style={{ display: 'inline', marginRight: 8 }}/> Pipeline Logs</span>
            <button 
              className="btn" 
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={() => {
                const text = logs.map(l => `[${l.name}]\n${l.logChunk || ''}`).join('\n\n');
                navigator.clipboard.writeText(text);
              }}
            >
              <Copy size={12} /> Copy logs
            </button>
          </div>
          <div style={{
            background: '#111827', 
            color: '#e5e7eb',
            padding: '16px',
            borderRadius: '6px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: '13px'
          }}>
            {logs.map(log => (
              <div key={log.name} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: 4 }}>--- {log.name} ---</div>
                <div>{log.logChunk || 'No output.'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
