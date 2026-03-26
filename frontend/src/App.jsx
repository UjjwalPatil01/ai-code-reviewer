import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, Sparkles, Hexagon, AlertCircle, AlertTriangle, Info, CheckCircle2, UserCircle, LogOut, Shield, Hash } from 'lucide-react';
import AuthModal from './components/AuthModal';
import HistoryDashboard from './components/HistoryDashboard';
import Home from './components/Home';

function App() {
  const [code, setCode] = useState('# Paste your python code here\n\ndef hello_ai():\n    print("Review me!")\n');
  const [language, setLanguage] = useState('python');
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [decorations, setDecorations] = useState([]);

  // AUTH STATE
  const [token, setToken] = useState(localStorage.getItem('codenova_token') || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('codenova_email') || null);
  const [userName, setUserName] = useState(localStorage.getItem('codenova_name') || null);
  const [showAuth, setShowAuth] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'editor'
  
  const lineHighlightDecoration = useRef([]);

  const handleLogout = () => {
    localStorage.removeItem('codenova_token');
    localStorage.removeItem('codenova_email');
    localStorage.removeItem('codenova_name');
    setToken(null);
    setUserEmail(null);
    setUserName(null);
    setViewHistory(false);
  };

  const handleAuthenticated = (newToken, newEmail, newName) => {
    localStorage.setItem('codenova_token', newToken);
    localStorage.setItem('codenova_email', newEmail);
    if (newName) localStorage.setItem('codenova_name', newName);
    setToken(newToken);
    setUserEmail(newEmail);
    setUserName(newName || null);
    setShowAuth(false);
  };

  const loadHistoricalReview = (record) => {
    setCode(record.code);
    setLanguage(record.language);
    setResults(record.response);
    setViewHistory(false);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleIssueClick = (line) => {
    if (!line || !editorRef.current || !monacoRef.current) return;
    
    editorRef.current.revealLineInCenter(line);
    editorRef.current.setPosition({ lineNumber: line, column: 1 });
    editorRef.current.focus();
    
    const newDecorations = editorRef.current.deltaDecorations(decorations, [
      {
        range: new monacoRef.current.Range(line, 1, line, 1),
        options: { isWholeLine: true, className: 'monaco-line-highlight' }
      }
    ]);
    setDecorations(newDecorations);
  };

  const handleSubmit = async () => {
    if (!token) {
      setShowAuth(true); // Intercept access!
      return;
    }

    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    if (editorRef.current) {
      setDecorations(editorRef.current.deltaDecorations(decorations, []));
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/review`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      });
      
      const data = await response.json();
      
      if (response.status === 202 && data.task_id) {
        // Asynchronous Pipeline Hit! Enqueue Polling Protocol
        pollTaskStatus(data.task_id);
      } else if (response.ok) {
        // Synchronous Graceful Fallback Hit (No Redis/Celery deployed)
        setResults(data);
        animateScore(data.score);
        setIsLoading(false);
      } else {
        throw new Error(data.message || data.error || 'Failed to submit code for review.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server.');
      setIsLoading(false);
    }
  };

  const animateScore = (targetScore) => {
    setAnimatedScore(0);
    setTimeout(() => {
      setAnimatedScore(targetScore);
    }, 100);
  };

  React.useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    if (hoveredLine) {
      lineHighlightDecoration.current = editorRef.current.deltaDecorations(lineHighlightDecoration.current, [
        {
          range: new monacoRef.current.Range(hoveredLine, 1, hoveredLine, 1),
          options: {
            isWholeLine: true,
            className: 'monaco-line-highlight-active',
            glyphMarginClassName: 'monaco-line-glyph-active'
          }
        }
      ]);
      editorRef.current.revealLineInCenterIfOutsideViewport(hoveredLine);
    } else {
      lineHighlightDecoration.current = editorRef.current.deltaDecorations(lineHighlightDecoration.current, []);
    }
  }, [hoveredLine]);

  const pollTaskStatus = (taskId) => {
    const intervalId = setInterval(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/v1/review/status/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const statusData = await res.json();
        
        if (statusData.state === 'SUCCESS') {
          clearInterval(intervalId);
          const finalResult = statusData.result.response || statusData.result;
          setResults(finalResult);
          animateScore(finalResult.score);
          setIsLoading(false);
        } else if (statusData.state === 'FAILURE') {
          clearInterval(intervalId);
          setError(statusData.status || 'Asynchronous task pipeline failed structurally.');
          setIsLoading(false);
        }
        // If PENDING, let it loop seamlessly
      } catch (err) {
        clearInterval(intervalId);
        setError(err.message || 'Polling disconnected from backend webhook.');
        setIsLoading(false);
      }
    }, 1500); // 1.5 seconds intervals
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
  };

  const SeverityIcon = ({ severity }) => {
    switch (severity?.toLowerCase()) {
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="app-layout">
      
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuthenticated={handleAuthenticated} />
      
      <nav className="glass-panel top-nav">
        <div className="nav-brand" style={{cursor: 'pointer'}} onClick={() => { setViewHistory(false); setCurrentView('home'); }}>
          <Hexagon size={28} color="#38bdf8" fill="rgba(56,189,248,0.2)" />
          CodeNova <span style={{fontWeight: 300, color: 'var(--text-muted)'}}>Code Review</span>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
           {token ? (
             <div style={{display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: viewHistory ? '#38bdf8' : 'inherit', transition: 'color 0.2s', padding: '0.5rem', borderRadius: '4px'}} onClick={() => setViewHistory(!viewHistory)} title="Open Profile History">
                   <UserCircle size={18} color={viewHistory ? '#38bdf8' : 'var(--text-muted)'} /> {userName || userEmail}
                </span>
                <button className="btn-glowing" style={{padding: '0.5rem 0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)'}} onClick={handleLogout} title="Logout"><LogOut size={16}/></button>
             </div>
           ) : (
             <button className="btn-glowing" onClick={() => setShowAuth(true)} style={{background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8'}}>
                <Shield size={16} style={{marginRight: '0.5rem', display: 'inline'}}/> Sign In / Sign Up
             </button>
           )}
           <button 
             className={`btn-glowing ${!isLoading && currentView !== 'home' ? 'btn-pulse' : ''}`} 
             onClick={() => {
               if (currentView === 'home') {
                  setCurrentView('editor');
               } else {
                  handleSubmit();
               }
             }}
             disabled={isLoading}
           >
             {isLoading ? (
               <><Sparkles className="loading-spinner" size={20} /> Processing...</>
             ) : (
               currentView === 'home' ? <><Code2 size={20} /> Open Editor</> : <><Play size={20} fill="currentColor" /> Analyze Code</>
             )}
           </button>
        </div>
      </nav>

      <div className="workspace">
        {viewHistory ? (
          <div style={{gridColumn: '1 / -1', height: '100%', overflow: 'hidden'}}>
            <HistoryDashboard token={token} onBack={() => setViewHistory(false)} onLoadReview={loadHistoricalReview} />
          </div>
        ) : currentView === 'home' ? (
          <div style={{gridColumn: '1 / -1', height: '100%', overflow: 'hidden'}}>
            <Home onStart={() => setCurrentView('editor')} />
          </div>
        ) : (
          <>
            <section className="glass-panel editor-container">
          <div className="pane-toolbar">
            <div className="pane-title">
              <Code2 size={18} />
              Editor Workspace
            </div>
            <select 
              className="select-modern" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          <div className="monaco-wrapper">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "'Fira Code', 'Monaco', monospace",
                fontLigatures: true,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 20 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on"
              }}
            />
          </div>
        </section>

        <section className="glass-panel results-container">
          <div className="pane-toolbar">
            <div className="pane-title">
              <Sparkles size={18} />
              AI Insights
            </div>
          </div>
          
          <div className="results-content">
            {isLoading && (
              <div className="loading-state fade-in">
                <Hexagon size={64} color="#38bdf8" className="loading-spinner" style={{opacity: 0.5}} />
                <h3 className="text-gradient" style={{fontSize: '1.3rem'}}>Analyzing your code...</h3>
                <p style={{color: 'var(--text-muted)'}}>Checking for bugs and improvements.</p>
              </div>
            )}
            
            {error && (
              <div className="issue-card severity-error fade-in">
                <div className="issue-header">
                  <span className="badge badge-error" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <AlertCircle size={14}/> SYSTEM ERROR
                  </span>
                </div>
                <div style={{marginTop: '1rem', color: 'var(--text-main)'}}>
                  {error}
                </div>
              </div>
            )}
            
            {results && !isLoading && !error && (
              <div className="fade-in">
                {/* Header & Score Section */}
                <div style={{ 
                  display: 'flex', 
                  gap: '2.5rem', 
                  alignItems: 'center', 
                  marginBottom: '2.5rem', 
                  padding: '2.5rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Ambient Lighting Behind Score */}
                  <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    left: '-50px',
                    top: '-50px',
                    background: results.score >= 80 ? 'rgba(16, 185, 129, 0.05)' : results.score >= 50 ? 'rgba(245, 158, 11, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    filter: 'blur(80px)',
                    borderRadius: '50%',
                    zIndex: 0
                  }} />

                  <div className="score-indicator-container">
                    <svg className="score-circle-svg">
                      <circle className="score-circle-bg" cx="50" cy="50" r="42" />
                      <circle 
                        className={`score-circle-progress ${getScoreClass(results.score)}`} 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        style={{
                          strokeDasharray: 264,
                          strokeDashoffset: 264 - (264 * animatedScore) / 100
                        }}
                      />
                    </svg>
                    <div className="score-text">
                      {animatedScore}
                      <span className="score-label">Score</span>
                    </div>
                  </div>

                  <div style={{position: 'relative', zIndex: 1}}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }} className="text-gradient">
                      {results.score >= 80 ? "Excellent Standards" : results.score >= 50 ? "Functional but Suboptimal" : "Critical Refactoring Needed"}
                    </h2>
                    <p style={{ color: 'var(--text-slate-400)', lineHeight: 1.6, fontSize: '1.05rem', maxWidth: '600px' }}>{results.summary}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                  <h3 className="pane-title">
                    Identified Violations
                  </h3>
                  <span style={{background: 'rgba(56, 189, 248, 0.05)', color: 'var(--accent-primary)', padding:'4px 14px', borderRadius:'99px', fontSize:'0.75rem', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.1)', letterSpacing: '0.05em'}}>
                    {results.issues?.length || 0} ITEMS FOUND
                  </span>
                </div>
                
                <div className="issues-list">
                  {results.issues && results.issues.length > 0 ? (
                    results.issues.map((issue, idx) => {
                      const sevClass = (issue.severity || 'info').toLowerCase();
                      return (
                        <div 
                          key={idx} 
                          className={`issue-card severity-${sevClass} ${issue.line ? 'clickable' : ''}`}
                          onClick={() => handleIssueClick(issue.line)}
                          onMouseEnter={() => issue.line && setHoveredLine(issue.line)}
                          onMouseLeave={() => setHoveredLine(null)}
                        >
                          <div className="issue-header">
                            <span className={`badge badge-${sevClass}`}>
                              <SeverityIcon severity={sevClass} />
                              {issue.severity || 'INFO'}
                            </span>
                            {issue.line && (
                              <span className="issue-line">
                                <Hash size={12} style={{marginRight: '4px'}} />
                                LINE {issue.line}
                              </span>
                            )}
                          </div>
                          
                          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                            {issue.message}
                          </div>

                          {issue.suggestion && (
                            <div className="suggestion-block">
                              <div style={{color: 'var(--text-slate-400)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <Sparkles size={12} color="var(--accent-secondary)" /> Suggestion
                              </div>
                              <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                                {issue.suggestion}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <CheckCircle2 size={56} color="var(--success)" style={{margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))'}} />
                      <h4 style={{color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem'}}>Code is Clean!</h4>
                      <p style={{color: 'var(--text-slate-400)', fontSize: '1.05rem'}}>No violations were detected by the AI architect.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!isLoading && !error && !results && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6}}>
                <Code2 size={64} style={{marginBottom: '1rem', color: 'var(--accent-primary)'}}/>
                <p style={{color: 'var(--text-main)', fontSize: '1.1rem'}}>Enter source code and initialize analysis to begin.</p>
              </div>
            )}
          </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
