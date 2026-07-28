import {
  GitBranch, Activity, Shield, Clock, ArrowUpRight, ArrowDownRight,
  Zap, CheckCircle2, XCircle, Loader2, Pause,
} from 'lucide-react';

export function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        <div className="navbar-logo">D</div>
        <div className="navbar-title">DevFlow <span>AI</span></div>
      </a>
      <div className="navbar-links">
        <button className="active">Dashboard</button>
        <button>Pipelines</button>
        <button>Deployments</button>
        <button>Security</button>
        <div className="nav-badge">
          <span className="dot" />
          All Systems Operational
        </div>
      </div>
    </nav>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <h1>
        Ship Code <span className="gradient">Fearlessly</span>
      </h1>
      <p>
        Automated CI/CD pipelines that lint, test, security-scan, containerize,
        and deploy your applications — zero manual steps.
      </p>
      <div className="hero-badges">
        <div className="hero-badge"><GitBranch size={16} /> GitHub Integrated</div>
        <div className="hero-badge"><Shield size={16} /> Security First</div>
        <div className="hero-badge"><Zap size={16} /> Auto Deploy</div>
        <div className="hero-badge"><Activity size={16} /> Health Monitored</div>
      </div>
    </section>
  );
}

export function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon green"><CheckCircle2 size={20} /></div>
          <span className="stat-trend up"><ArrowUpRight size={14} /> 12%</span>
        </div>
        <div className="stat-value">{stats.totalRuns}</div>
        <div className="stat-label">Total Pipeline Runs</div>
      </div>
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon blue"><Activity size={20} /></div>
          <span className="stat-trend up"><ArrowUpRight size={14} /> 2.1%</span>
        </div>
        <div className="stat-value">{stats.successRate}%</div>
        <div className="stat-label">Success Rate</div>
      </div>
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon yellow"><Clock size={20} /></div>
          <span className="stat-trend down"><ArrowDownRight size={14} /> 8s</span>
        </div>
        <div className="stat-value">{stats.avgDuration}</div>
        <div className="stat-label">Avg Build Duration</div>
      </div>
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon purple"><Zap size={20} /></div>
        </div>
        <div className="stat-value">{stats.deploysToday}</div>
        <div className="stat-label">Deploys Today</div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const icons = {
    success: <CheckCircle2 size={12} />,
    failed: <XCircle size={12} />,
    running: <Loader2 size={12} className="spinning" />,
    queued: <Pause size={12} />,
  };
  const labels = { success: 'Success', failed: 'Failed', running: 'Running', queued: 'Queued' };

  return (
    <div className={`status-badge ${status}`}>
      <span className="dot" />
      {labels[status]}
    </div>
  );
}

export function PipelineTable({ runs }) {
  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <GitBranch size={20} /> Recent Pipeline Runs
        </div>
        <div className="section-actions">
          <button className="btn">View All</button>
          <button className="btn btn-primary"><Zap size={14} /> Trigger Run</button>
        </div>
      </div>
      <div className="pipeline-table">
        <div className="pipeline-header">
          <div>Commit</div>
          <div>Branch</div>
          <div>Status</div>
          <div>Duration</div>
          <div>Time</div>
          <div>Actions</div>
        </div>
        {runs.map((run) => (
          <div className="pipeline-row" key={run.id}>
            <div className="pipeline-commit">
              <span className="msg">{run.commit}</span>
              <span className="sha">{run.sha}</span>
            </div>
            <div><span className="pipeline-branch"><GitBranch size={12} /> {run.branch}</span></div>
            <div><StatusBadge status={run.status} /></div>
            <div className="pipeline-duration">{run.duration}</div>
            <div className="pipeline-time">{run.time}</div>
            <div><button className="btn" style={{ padding: '4px 10px', fontSize: '11px' }}>Logs</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PipelineFlow({ steps }) {
  const icons = { done: '✓', active: '⟳', pending: '○' };
  return (
    <div className="panel">
      <div className="panel-title"><Activity size={18} /> Live Pipeline Flow</div>
      <div className="pipeline-flow">
        {steps.map((step, i) => (
          <span key={step.label} style={{ display: 'contents' }}>
            <div className="flow-step">
              <div className={`flow-icon ${step.state}`}>{icons[step.state]}</div>
              <span className="flow-label">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flow-connector ${step.state === 'done' ? 'done' : step.state === 'active' ? 'active' : ''}`} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SecurityPanel({ scans }) {
  return (
    <div className="panel">
      <div className="panel-title"><Shield size={18} /> Security Scan Results</div>
      {scans.map((scan) => (
        <div className="security-item" key={scan.name}>
          <div className="security-info">
            <div className="security-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              {scan.icon}
            </div>
            <div>
              <div className="security-name">{scan.name}</div>
              <div className="security-desc">{scan.desc}</div>
            </div>
          </div>
          <StatusBadge status="success" />
        </div>
      ))}
    </div>
  );
}

export function HealthPanel() {
  return (
    <div className="panel">
      <div className="panel-title"><Activity size={18} /> Service Health</div>
      <div className="health-grid">
        <div className="health-item">
          <div className="health-label">Status</div>
          <div className="health-value green">● Healthy</div>
        </div>
        <div className="health-item">
          <div className="health-label">Uptime</div>
          <div className="health-value blue">99.97%</div>
        </div>
        <div className="health-item">
          <div className="health-label">Response Time</div>
          <div className="health-value blue">42ms</div>
        </div>
        <div className="health-item">
          <div className="health-label">Memory</div>
          <div className="health-value blue">45MB / 512MB</div>
        </div>
      </div>
    </div>
  );
}

export function DeployTimeline({ deploys }) {
  return (
    <div className="panel">
      <div className="panel-title"><Zap size={18} /> Deploy History</div>
      <div className="timeline">
        {deploys.map((d) => (
          <div className="timeline-item" key={d.version}>
            <div className={`timeline-dot ${d.status}`} />
            <div className="timeline-title">{d.version} — {d.status === 'success' ? 'Deployed' : 'Failed'}</div>
            <div className="timeline-meta">{d.commit} · {d.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechStack({ items }) {
  return (
    <div className="panel" style={{ gridColumn: '1 / -1' }}>
      <div className="panel-title"><Zap size={18} /> Technology Stack</div>
      <div className="tech-grid">
        {items.map((t) => (
          <div className="tech-item" key={t.name}>
            <span className="tech-icon">{t.icon}</span>
            <span className="tech-name">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 DevFlow AI — Built by <a href="#">Saloni Ambatkar</a></span>
      <span>v1.4.2 · <a href="#">GitHub</a> · <a href="#">Docs</a></span>
    </footer>
  );
}
