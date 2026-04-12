import React from 'react';
import InputForm from '../components/InputForm';
import ResultDashboard from '../components/ResultDashboard';
import { useAnalysis } from '../hooks/useAnalysis';

export default function Analysis() {
  const { result, loading, error, run, reset } = useAnalysis();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800 }}>Property Analysis</h1>
        {result && (
          <button className="btn btn-danger" onClick={reset} style={{ fontSize: '0.85rem' }}>
            ✕ New Analysis
          </button>
        )}
      </div>

      {!result && <InputForm onSubmit={run} loading={loading} />}
      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '1rem', color: 'var(--danger)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      {result && <ResultDashboard result={result} />}
    </div>
  );
}
