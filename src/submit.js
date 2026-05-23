import { useState, useEffect, useCallback } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

async function parsePipeline(nodes, edges) {
  const res = await fetch('http://localhost:8000/pipelines/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }
  return res.json();
}

function PipelineModal({ result, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const dagColor = result.is_dag ? '#22c55e' : '#f97316';

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1000,
        animation: 'fadeIn 150ms ease',
      }} />
      <div role="dialog" aria-modal="true" style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001, width: 340,
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        padding: '28px 28px 22px',
        animation: 'slideUp 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-ui)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
            Pipeline Analysis
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 20, lineHeight: 1,
            padding: '2px 4px', borderRadius: 4,
          }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[['Nodes', result.num_nodes], ['Edges', result.num_edges]].map(([label, value]) => (
            <div key={label} style={{
              padding: '14px 16px', borderRadius: 8, textAlign: 'center',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 8,
          background: `${dagColor}18`,
          border: `1px solid ${dagColor}40`,
        }}>
          <span style={{ fontSize: 18 }}>{result.is_dag ? '✓' : '⚠'}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: dagColor }}>
              {result.is_dag ? 'Valid DAG' : 'Contains a cycle'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {result.is_dag
                ? 'Graph is acyclic — safe to execute.'
                : 'Execution order cannot be determined.'}
            </div>
          </div>
        </div>

        <button onClick={onClose} style={{
          display: 'block', width: '100%', marginTop: 20,
          padding: '9px 0', borderRadius: 8,
          border: '1px solid var(--border-default)',
          background: 'var(--bg-raised)',
          color: 'var(--text-secondary)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-ui)', letterSpacing: '0.01em',
          transition: 'background 120ms, color 120ms',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-overlay)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          Dismiss
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 14px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}

function ErrorModal({ message, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)', zIndex: 1000,
      }} />
      <div role="alertdialog" aria-modal="true" style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001, width: 320,
        background: 'var(--bg-overlay)',
        border: '1px solid rgba(244,63,94,0.35)',
        borderRadius: 14, padding: '24px 24px 20px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
        animation: 'slideUp 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 22 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Request failed</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{message}</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          display: 'block', width: '100%', padding: '9px 0',
          borderRadius: 8, border: '1px solid rgba(244,63,94,0.3)',
          background: 'rgba(244,63,94,0.08)', color: '#f87171',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
        }}>Dismiss</button>
      </div>
    </>
  );
}

export function SubmitButton() {
  const nodes   = useStore((s) => s.nodes);
  const edges   = useStore((s) => s.edges);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await parsePipeline(nodes, edges);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [loading, nodes, edges]);

  return (
    <>
      <div className="submit-footer">
        <span className="submit-hint">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''}
          {edges.length > 0 ? `  ·  ${edges.length} edge${edges.length !== 1 ? 's' : ''}` : ''}
        </span>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <svg className="submit-btn-icon" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? 'Analyzing…' : 'Run Pipeline'}
        </button>
      </div>
      {result && <PipelineModal result={result} onClose={() => setResult(null)} />}
      {error  && <ErrorModal message={error}   onClose={() => setError(null)}  />}
    </>
  );
}