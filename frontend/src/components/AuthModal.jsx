import React, { useState, useEffect } from 'react';
import { Shield, X, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthenticated }) {
  const [view, setView] = useState('register'); // 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setView('register');
      setEmail('');
      setPassword('');
      setFullName('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint = view === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const bodyPayload = view === 'login' ? { email, password } : { email, password, full_name: fullName };
      
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      onAuthenticated(data.token, data.email, data.full_name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel" style={{background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(56,189,248,0.3)'}}>
        <button className="modal-close" onClick={onClose}><X size={20}/></button>
        
        <div style={{textAlign:'center', marginBottom: '2rem'}}>
          <Shield size={48} className="text-gradient" style={{margin: '0 auto 1rem'}}/>
          <h2 style={{color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.2rem'}}>Welcome</h2>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Log in or sign up to continue</p>
        </div>

        {error && (
          <div className="issue-card severity-error" style={{marginBottom: '1rem', padding: '1rem', color: '#ef4444'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuthSubmit}>
          {view === 'register' && (
            <div style={{marginBottom: '1rem'}}>
              <input type="text" className="select-modern" placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} style={{width: '100%', padding: '1rem'}} required />
            </div>
          )}
          <div style={{marginBottom: '1rem'}}>
            <input type="email" className="select-modern" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} style={{width: '100%', padding: '1rem'}} required />
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <input type="password" className="select-modern" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width: '100%', padding: '1rem'}} required />
          </div>
          <button type="submit" className="btn-glowing" style={{width: '100%', justifyContent: 'center'}} disabled={loading}>
            {view === 'login' ? 'Log In' : 'Sign Up'} <ArrowRight size={18} style={{marginLeft: '0.5rem'}}/>
          </button>
          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <button type="button" style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setView(view === 'login' ? 'register' : 'login')}>
              {view === 'login' ? "Don't have an account? Sign up here." : "Already have an account? Log in here."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
