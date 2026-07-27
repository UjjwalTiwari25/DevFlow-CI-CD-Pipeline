const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let authToken = localStorage.getItem('devflow_token') || null;

export function setToken(token) {
  authToken = token;
  localStorage.setItem('devflow_token', token);
}
export function getToken() { return authToken; }
export function clearToken() {
  authToken = null;
  localStorage.removeItem('devflow_token');
  localStorage.removeItem('devflow_user');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  
  window.dispatchEvent(new Event('req_start'));
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  } finally {
    window.dispatchEvent(new Event('req_end'));
  }
}

// Auth
export const login = (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const register = (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });

// Dashboard
export const getStats = () => request('/api/dashboard/stats');
export const getRepos = () => request('/api/dashboard/repositories');
export const createRepo = (body) => request('/api/dashboard/repositories', { method: 'POST', body: JSON.stringify(body) });
export const deleteRepo = (id) => request(`/api/dashboard/repositories/${id}`, { method: 'DELETE' });
export const getPipelines = (q = '') => request(`/api/dashboard/pipelines?${q}`);
export const getPipeline = (id) => request(`/api/dashboard/pipelines/${id}`);
export const rerunPipeline = (id) => request(`/api/dashboard/pipelines/${id}/rerun`, { method: 'POST' });
export const getDeployments = (q = '') => request(`/api/dashboard/deployments?${q}`);
export const triggerDeploy = (repoId) => request(`/api/dashboard/deployments/trigger/${repoId}`, { method: 'POST' });
export const rollbackDeploy = (id) => request(`/api/dashboard/deployments/${id}/rollback`, { method: 'POST' });
export const getSecurityScans = (q = '') => request(`/api/dashboard/security?${q}`);
export const getHealth = () => request('/api/dashboard/health');
