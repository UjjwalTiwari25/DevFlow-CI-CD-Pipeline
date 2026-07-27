import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Shield, Zap, ArrowRight, Globe, Code, CheckCircle, Cpu, GitMerge, Lock, Menu, X } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-icon large">D</div>
          <span>DevFlow <span className="accent">AI</span></span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`landing-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/login" className="hero-btn secondary nav-btn" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
          <Link to="/login" className="hero-btn primary nav-btn" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
        </div>
      </nav>

      <header className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} /> The Next-Generation CI/CD Platform
          </div>
          <h1 className="hero-title">
            Ship Code Faster with <br /> <span className="accent">Intelligent Pipelines</span>
          </h1>
          <p className="hero-subtitle">
            DevFlow AI automates your build, test, and deployment workflows with built-in security scanning and AI-driven insights. Designed for modern teams who demand speed without compromising reliability.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="hero-btn primary large-btn">
              Start Building for Free <ArrowRight size={20} />
            </Link>
            <a href="#how-it-works" className="hero-btn secondary large-btn">
              Explore Features
            </a>
          </div>
        </div>
        
        {/* Abstract Hero Visual */}
        <div className="hero-visual">
          <div className="visual-pipeline">
            <div className="v-node"><Code size={24} /></div>
            <div className="v-line" />
            <div className="v-node accent-node"><Cpu size={24} /></div>
            <div className="v-line" />
            <div className="v-node"><Shield size={24} /></div>
            <div className="v-line" />
            <div className="v-node success-node"><Rocket size={24} /></div>
          </div>
        </div>
      </header>

      <section className="section-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-title">What is DevFlow AI?</h2>
              <p className="section-description">
                DevFlow AI is an autonomous, machine-learning-powered Continuous Integration and Continuous Deployment (CI/CD) platform. We bridge the gap between complex DevOps configurations and developer productivity.
              </p>
              <ul className="about-list">
                <li><CheckCircle size={18} className="success-text" /> <strong>Zero Configuration:</strong> Auto-detects your tech stack and builds the perfect pipeline.</li>
                <li><CheckCircle size={18} className="success-text" /> <strong>Proactive Security:</strong> Scans for vulnerabilities before code is merged.</li>
                <li><CheckCircle size={18} className="success-text" /> <strong>Smart Rollbacks:</strong> Instantly detects production anomalies and reverts seamlessly.</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="glass-card">
                <div className="glass-header"><span>Pipeline Health</span> <span className="badge-success">Operational</span></div>
                <div className="glass-body">
                  <div className="stat-row"><span>Deployment Speed</span> <span className="accent">2.4x Faster</span></div>
                  <div className="stat-row"><span>Security Threats Blocked</span> <span className="accent">99.9%</span></div>
                  <div className="stat-row"><span>Developer Happiness</span> <span className="accent">100%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-workflow">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-description text-center max-w-md mx-auto">
            From your local machine to global production servers in four simple steps.
          </p>
          <div className="workflow-steps">
            <div className="step-card">
              <div className="step-number">01</div>
              <GitMerge size={32} className="step-icon" />
              <h4>Connect Repository</h4>
              <p>Link your GitHub, GitLab, or Bitbucket account. DevFlow automatically analyzes your repository structure.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <Cpu size={32} className="step-icon" />
              <h4>AI Pipeline Generation</h4>
              <p>Our agent generates a custom pipeline YAML tailored specifically to your framework and dependencies.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <Lock size={32} className="step-icon" />
              <h4>Test & Secure</h4>
              <p>Every commit is linted, unit-tested, and scanned for SAST vulnerabilities and leaked secrets.</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <Rocket size={32} className="step-icon" />
              <h4>Auto-Deploy</h4>
              <p>Green builds are automatically containerized and deployed to your specified cloud environments with zero downtime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="container">
          <h2 className="section-title text-center">Why Choose DevFlow AI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Rocket size={28} /></div>
              <h3 className="feature-title">Lightning Fast Deployments</h3>
              <p className="feature-desc">Automate your entire release process. From commit to production in seconds with our optimized global infrastructure.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Shield size={28} /></div>
              <h3 className="feature-title">Advanced Security</h3>
              <p className="feature-desc">Built-in vulnerability detection, container image scanning, and secret management to keep your applications secure by default.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Zap size={28} /></div>
              <h3 className="feature-title">AI-Driven Insights</h3>
              <p className="feature-desc">Predict deployment failures, auto-remediate failing tests, and get intelligent recommendations to improve code quality.</p>
            </div>
          </div>
        </div>
      </section>



      <section className="section-cta">
        <div className="cta-content">
          <h2>Ready to revolutionize your workflow?</h2>
          <p>Join thousands of developers shipping better software, faster.</p>
          <div className="cta-actions">
            <Link to="/login" className="hero-btn primary large-btn">Create Your Free Account</Link>
            <Link to="/login" className="hero-btn secondary large-btn">Sign In to Dashboard</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-icon">D</div>
              <span>DevFlow AI</span>
            </div>
            <div className="footer-links">
              <a href="#">Documentation</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 DevFlow AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
