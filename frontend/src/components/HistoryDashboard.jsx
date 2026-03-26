import React, { useState, useEffect } from 'react';
import { Clock, Code2, ArrowLeft } from 'lucide-react';

export default function HistoryDashboard({ token, onBack, onLoadReview }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/v1/review/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setHistory(data.history || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <div className="glass-panel fade-in" style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Clock size={32} className="loading-spinner" color="#38bdf8"/></div>;

  return (
    <div className="glass-panel fade-in" style={{padding: '2rem', height: '100%', overflowY: 'auto'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
        <button className="btn-glowing" style={{padding: '0.5rem', background: 'transparent'}} onClick={onBack} title="Back to Editor"><ArrowLeft size={18}/></button>
        <h2 style={{color: 'var(--text-main)', fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem'}}><Clock size={24} color="#38bdf8"/> Review History</h2>
      </div>

      {history.length === 0 ? (
        <div style={{textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem'}}>
          <Code2 size={48} style={{margin: '0 auto 1rem', opacity: 0.5}}/>
          You haven't reviewed any code yet.
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {history.map((record, idx) => (
             <div key={idx} className="issue-card" style={{borderLeft: `4px solid ${record.response.score >= 80 ? 'var(--success)' : record.response.score >= 60 ? 'var(--warning)' : 'var(--danger)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
               <div>
                 <div style={{color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem'}}>{record.language.toUpperCase()} Code Review</div>
                 <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem'}}>Analyzed on: {new Date(record.created_at).toLocaleString()}</div>
                 <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.8rem', maxWidth: '600px', lineHeight: 1.5}}>{record.response.summary.substring(0, 150)}...</div>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '3rem'}}>
                 <div className={`score-circle ${record.response.score >= 80 ? 'score-excellent' : record.response.score >= 60 ? 'score-good' : 'score-poor'}`} style={{width: '60px', height: '60px', fontSize: '1.2rem', borderWidth: '3px'}}>
                   {record.response.score}
                 </div>
                 <button className="btn-glowing" style={{fontSize: '0.9rem', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '0.8rem 1.5rem'}} onClick={() => onLoadReview(record)}>View Review Details</button>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
