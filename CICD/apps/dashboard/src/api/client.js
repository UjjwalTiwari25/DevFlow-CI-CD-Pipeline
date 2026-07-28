const API_BASE = import.meta.env.VITE_API_URL || 'https://cicd-i4ud.onrender.com';

let authToken = localStorage.getItem('devflow_token') || null;

// ─── Token Management ─────────────────────────────────────────────────────────
export function setToken(token) {
  authToken = token;
  localStorage.setItem('devflow_token', token);
}
export function getToken() { return authToken; }
export function clearToken() {
  authToken = null;
  localStorage.removeItem('devflow_token');
  localStorage.removeItem('devflow_refresh_token');
  localStorage.removeItem('devflow_user');
}

// ─── Automatic Token Refresh (#4) ─────────────────────────────────────────────
// The refresh token is stored as an httpOnly cookie by the server.
// On 401 responses, we call /api/auth/refresh (the browser sends the cookie
// automatically), get a new access token, and retry the original request.

let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
  // Deduplicate concurrent refresh attempts
  if (isRefreshing) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const storedRefreshToken = localStorage.getItem('devflow_refresh_token');
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send the httpOnly refresh token cookie as fallback
        body: storedRefreshToken ? JSON.stringify({ refreshToken: storedRefreshToken }) : undefined
      });
      if (!res.ok) throw new Error('Refresh failed');
      const data = await res.json();
      setToken(data.data.accessToken);
      return data.data.accessToken;
    } catch {
      // Refresh failed — force logout
      clearToken();
      window.location.href = '/login';
      throw new Error('Session expired');
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core Request Function ────────────────────────────────────────────────────
async function request(path, options = {}, _isRetry = false) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  window.dispatchEvent(new Event('req_start'));
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include', // Always send cookies for refresh token
    });

    // ── Handle 401: attempt token refresh and retry once ──
    if (res.status === 401 && !_isRetry && authToken) {
      try {
        await refreshAccessToken();
        return request(path, options, true); // Retry with new token
      } catch {
        throw new Error('Session expired. Please log in again.');
      }
    }

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
export const logout = () => request('/api/auth/logout', { method: 'POST' });

// Dashboard
export const getStats = () => request('/api/dashboard/stats');
export const getRepos = () => request('/api/dashboard/repositories');
export const getGithubRepos = () => request('/api/dashboard/github/repos');
export const createRepo = (body) => request('/api/dashboard/repositories', { method: 'POST', body: JSON.stringify(body) });
export const deleteRepo = (id) => request(`/api/dashboard/repositories/${id}`, { method: 'DELETE' });
export const triggerPipeline = (id) => request(`/api/dashboard/repositories/${id}/trigger`, { method: 'POST' });
export const getPipelines = (q = '') => request(`/api/dashboard/pipelines?${q}`);
export const getPipeline = (id) => request(`/api/dashboard/pipelines/${id}`);
export const getPipelineLogs = (id) => request(`/api/dashboard/pipelines/${id}/logs`);
export const rerunPipeline = (id) => request(`/api/dashboard/pipelines/${id}/rerun`, { method: 'POST' });
export const getDeployments = (q = '') => request(`/api/dashboard/deployments?${q}`);
export const triggerDeploy = (repoId) => request(`/api/dashboard/deployments/trigger/${repoId}`, { method: 'POST' });
export const rollbackDeploy = (id) => request(`/api/dashboard/deployments/${id}/rollback`, { method: 'POST' });
export const getSecurityScans = (q = '') => request(`/api/dashboard/security?${q}`);
export const getHealth = () => request('/api/dashboard/health');
