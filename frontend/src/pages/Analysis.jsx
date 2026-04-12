import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import ResultDashboard from '../components/ResultDashboard';
import { useAnalysis } from '../hooks/useAnalysis';
import { RotateCcw, X } from 'lucide-react';

export default function Analysis() {
  const { result, loading, error, run, reset } = useAnalysis();
  const [showModal, setShowModal] = useState(false);

  const handleRun = async (formData, docFile) => {
    await run(formData, docFile);
    setShowModal(true);
  };

  const handleReset = () => {
    reset();
    setShowModal(false);
  };

  return (
    <div style={{ background: 'var(--light)', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)',
        padding: '3rem 1.5rem 2.5rem',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          AI Intelligence Suite
        </div>
        <h1 style={{
          fontFamily: 'Times New Roman, Georgia, serif',
          fontSize: '2.4rem', fontWeight: 700,
          background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '0.6rem',
        }}>
          Property Analysis
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
          Enter your Bangalore property details below for instant AI-powered valuation, risk analysis, and investment recommendation.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Analysis Failed</div>
              <div style={{ fontSize: '0.88rem' }}>{error}</div>
            </div>
          </div>
        )}

        <InputForm onSubmit={handleRun} loading={loading} />
      </div>

      {/* Results Modal */}
      {showModal && result && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 500,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
          backdropFilter: 'blur(4px)',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: 'var(--light)',
            borderRadius: '12px',
            width: '100%', maxWidth: '960px',
            margin: '1rem auto',
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            border: '1px solid rgba(201,168,76,0.3)',
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--dark), var(--dark-3))',
              padding: '1.2rem 1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid rgba(201,168,76,0.25)',
            }}>
              <div>
                <div style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: '1.2rem', color: 'var(--gold-light)', fontWeight: 700 }}>
                  Analysis Results
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                  Analysis #{result.analysis_id} · Bangalore Property Intelligence
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleReset} style={{
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
                  color: 'var(--gold)', cursor: 'pointer', padding: '0.4rem 0.9rem',
                  borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}>
                  <RotateCcw size={13} /> New Analysis
                </button>
                <button onClick={() => setShowModal(false)} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  width: 32, height: 32, borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '85vh' }}>
              <ResultDashboard result={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
