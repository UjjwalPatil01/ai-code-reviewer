import React from 'react';
import { Shield, Sparkles, ChevronRight, Code2, Lock, Zap } from 'lucide-react';
import './Home.css';

export default function Home({ onStart }) {
  return (
    <div className="home-container">
      {/* Background glowing orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      
      <div className="hero-split">
        <section className="hero-section">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent-primary)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <Sparkles size={16} /> CodeNova 2.0 is Live
          </div>
          
          <h1 className="hero-title">
            Secure, Intelligent & Fast <br /> 
            <span className="text-gradient">Code Review Platform</span>
          </h1>
          
          <p className="hero-subtitle">
            Elevate your coding standards. Get instant, AI-driven feedback on logic, performance, and security flaws before you deploy. Designed for students and pros.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-glowing btn-lg" onClick={onStart}>
              Start Reviewing Code <ChevronRight size={20} />
            </button>
            <button className="btn-outline btn-lg" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </section>

        <section className="hero-graphic">
          <div className="graphic-card glass-panel">
            <div className="graphic-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="graphic-title">auth_service.py</div>
            </div>
            <pre className="graphic-code">
              <code>
<span style={{color: '#c678dd'}}>def</span> <span style={{color: '#61afef'}}>verify_token</span>(token):<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>if not</span> token:<br/>
<span className="highlight-error">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>return</span> <span style={{color: '#e5c07b'}}>False</span>   <span style={{color: '#7f848e'}}># Unsafe blind return</span></span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>try</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payload = jwt.decode(token, SECRET)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>return</span> payload<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>except</span> DecodeError:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>return</span> <span style={{color: '#e5c07b'}}>False</span>
              </code>
            </pre>
            <div className="ai-insight-popup fade-in" style={{animationDelay: '1s'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--error)'}}>
                 <Shield size={16} /> <strong>Security Flaw Detected</strong>
              </div>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4}}>
                Missing signature verification algorithm parameter. Use <code>algorithms=["HS256"]</code> to prevent token manipulation.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section id="about" className="features-section">
        <div className="feature-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Zap size={28} color="var(--accent-primary)" />
            </div>
            <h3>Instant Feedback</h3>
            <p>Get real-time insights on your code. We highlight performance bottlenecks and suggest optimal solutions.</p>
          </div>
          
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Lock size={28} color="var(--accent-secondary)" />
            </div>
            <h3>Secure Analysis</h3>
            <p>Your code is safe with us. We use enterprise-grade protocols to ensure your data stays private and secure.</p>
          </div>
          
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Code2 size={28} color="#10b981" />
            </div>
            <h3>Best Practices</h3>
            <p>Learn while you code. Our AI enforces industry standards and helps you write clean, maintainable software.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
