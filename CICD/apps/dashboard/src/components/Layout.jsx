import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GitBranch, Rocket, Shield, FolderGit2, Activity, Settings, LogOut, Menu, X, Zap } from 'lucide-react';
import { clearToken } from '../api/client';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipelines', icon: GitBranch, label: 'Pipelines' },
  { to: '/deployments', icon: Rocket, label: 'Deployments' },
  { to: '/security', icon: Shield, label: 'Security' },
  { to: '/repositories', icon: FolderGit2, label: 'Repositories' },
  { to: '/health', icon: Activity, label: 'Health' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('devflow_user') || '{}');

  const handleLogout = () => { clearToken(); navigate('/login'); };

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">D</div>
            {!collapsed && <span className="brand-text">DevFlow <span className="accent">AI</span></span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>
        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <l.icon size={20} />
              {!collapsed && <span>{l.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <div className="sidebar-user"><div className="user-avatar">{(user.name || 'U')[0]}</div><div><div className="user-name">{user.name || 'User'}</div><div className="user-email">{user.email || ''}</div></div></div>}
          <button className="sidebar-link" onClick={handleLogout}><LogOut size={20} />{!collapsed && <span>Logout</span>}</button>
        </div>
      </aside>
      <div className="layout-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-toggle" onClick={() => setCollapsed(!collapsed)}><Menu size={20} /></button>
          </div>
          <div className="topbar-right">
            <div className="system-status"><span className="status-dot live" /> All Systems Operational</div>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="app-footer">
          <span>© 2025 DevFlow AI — Built by Ujjwal</span>
          <span>v1.4.2</span>
        </footer>
      </div>
    </div>
  );
}
