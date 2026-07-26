import { useState } from 'react';
import { Settings as SettingsIcon, Save, Key, Bell, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
  const user = JSON.parse(localStorage.getItem('devflow_user') || '{}');
  const defaultSettings = JSON.parse(localStorage.getItem('devflow_settings') || 'null') || {
    slackWebhook: '', renderHook: '', healthUrl: '', renderApiKey: '',
    notifications: true, autoRollback: false, coverageThreshold: 80,
  };
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('devflow_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Settings</h1><p className="subtitle">Configure your CI/CD platform</p></div>
      </div>

      <form onSubmit={handleSave} autoComplete="off">
        <div className="settings-grid">
          <div className="panel">
            <div className="panel-title"><Globe size={18} /> Deployment Configuration</div>
            <div className="form-group"><label><Key size={14} /> Render Deploy Hook URL</label><input type="url" placeholder="https://api.render.com/deploy/..." value={settings.renderHook} onChange={(e) => setSettings({ ...settings, renderHook: e.target.value })} /></div>
            <div className="form-group"><label><Globe size={14} /> Production Health URL</label><input type="url" placeholder="https://your-app.onrender.com/health" value={settings.healthUrl} onChange={(e) => setSettings({ ...settings, healthUrl: e.target.value })} /></div>
            <div className="form-group"><label><Key size={14} /> Render API Key</label><input type="password" placeholder="rnd_..." value={settings.renderApiKey} onChange={(e) => setSettings({ ...settings, renderApiKey: e.target.value })} /></div>
          </div>

          <div className="panel">
            <div className="panel-title"><Bell size={18} /> Notifications</div>
            <div className="form-group"><label><Bell size={14} /> Slack Webhook URL</label><input type="url" placeholder="https://hooks.slack.com/..." value={settings.slackWebhook} onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })} /></div>
            <div className="form-check"><input type="checkbox" id="notif" checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} /><label htmlFor="notif">Enable Slack notifications on deploy</label></div>
            <div className="form-check"><input type="checkbox" id="rollback" checked={settings.autoRollback} onChange={(e) => setSettings({ ...settings, autoRollback: e.target.checked })} /><label htmlFor="rollback">Auto-rollback on failed health check</label></div>
          </div>

          <div className="panel">
            <div className="panel-title"><Database size={18} /> Pipeline Configuration</div>
            <div className="form-group">
              <label>Coverage Threshold (%)</label>
              <input type="number" min="0" max="100" value={settings.coverageThreshold} onChange={(e) => setSettings({ ...settings, coverageThreshold: Number(e.target.value) })} />
            </div>
            <div className="form-group"><label>Node.js Version</label><input value="22" disabled /></div>
            <div className="form-group"><label>Docker Base Image</label><input value="node:22-alpine" disabled /></div>
          </div>

          <div className="panel">
            <div className="panel-title"><SettingsIcon size={18} /> Account</div>
            <div className="form-group"><label>Name</label><input value={user.name || ''} disabled /></div>
            <div className="form-group"><label>Email</label><input value={user.email || ''} disabled /></div>
            <div className="form-group"><label>User ID</label><input value={user.id || ''} disabled className="mono" /></div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button type="submit" className="btn btn-primary"><Save size={14} /> Save Settings</button>
          {saved && <span style={{ color: 'var(--success)', fontSize: 14 }}>✓ Settings saved</span>}
        </div>
      </form>
    </div>
  );
}
