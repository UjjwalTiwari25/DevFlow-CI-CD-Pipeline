import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
import { setToken } from '../api/client';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    const errorParam = params.get('error');

    if (errorParam) {
      setError(`GitHub Login Failed: ${errorParam}`);
      window.history.replaceState({}, document.title, '/login');
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setToken(token);
        localStorage.setItem('devflow_user', JSON.stringify(user));
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to parse user data');
      }
    }
  }, [location, navigate]);

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/github`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon large">D</div>
          <h1>DevFlow <span className="accent">AI</span></h1>
          <p>Sign in to your dashboard</p>
        </div>
        {error && <div className="alert error">{error}</div>}
        
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={handleGithubLogin} 
            className="btn btn-primary full" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px', padding: '12px' }}
          >
            <GithubIcon size={20} /> Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
