import { useState, useEffect } from 'react';
import './GlobalLoader.css';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let requests = 0;
    const start = () => { requests++; setLoading(true); };
    const end = () => { 
      requests = Math.max(0, requests - 1); 
      if (requests === 0) setLoading(false); 
    };
    
    window.addEventListener('req_start', start);
    window.addEventListener('req_end', end);
    return () => {
      window.removeEventListener('req_start', start);
      window.removeEventListener('req_end', end);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="modern-loader">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-core"></div>
      </div>
    </div>
  );
}
