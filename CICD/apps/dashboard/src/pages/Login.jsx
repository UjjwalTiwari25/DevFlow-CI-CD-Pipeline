import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Zap } from 'lucide-react';
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
            <Github size={20} /> Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
