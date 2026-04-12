import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Shield, TrendingUp, FileText, Brain, AlertTriangle, Map, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: <Brain size={26} color="#2563eb" />,
    bg: '#eff6ff',
    title: 'AI Valuation Ensemble',
    desc: 'Random Forest + XGBoost + ANN (3-model ensemble) trained on 8,000 real Bangalore land records. R² = 0.899.',
    badge: 'RF + XGB + ANN',
    badgeColor: '#2563eb',
  },
  {
    icon: <Shield size={26} color="#dc2626" />,
    bg: '#fef2f2',
    title: 'ML Risk Classification',
    desc: 'GradientBoosting Classifier predicts LOW / MEDIUM / HIGH / CRITICAL with probability scores across 6 risk categories.',
    badge: 'GBM Classifier',
    badgeColor: '#dc2626',
  },
  {
    icon: <AlertTriangle size={26} color="#d97706" />,
    bg: '#fffbeb',
    title: 'Anomaly Fraud Detection',
    desc: 'IsolationForest detects statistical outliers in price/ownership patterns + 5 rule-based fraud signal detectors.',
    badge: 'IsolationForest',
    badgeColor: '#d97706',
  },
  {
    icon: <TrendingUp size={26} color="#16a34a" />,
    bg: '#f0fdf4',
    title: '5-Year Price Forecast',
    desc: 'Locality-specific growth rates for all 60 Bangalore areas with zone and infrastructure modifiers.',
    badge: 'Time Series',
    badgeColor: '#16a34a',
  },
  {
    icon: <BarChart2 size={26} color="#7c3aed" />,
    bg: '#faf5ff',
    title: 'Explainable AI (XAI)',
    desc: 'SHAP-based feature importance shows exactly which factors drive the valuation and risk score.',
    badge: 'SHAP Values',
    badgeColor: '#7c3aed',
  },
  {
    icon: <FileText size={26} color="#0891b2" />,
    bg: '#ecfeff',
    title: 'Legal Intelligence',
    desc: 'OCR-based document parsing extracts owner, area, survey number and detects mismatches with form data.',
    badge: 'OCR + NLP',
    badgeColor: '#0891b2',
  },
];

const STATS = [
  { value: '8,000+', label: 'Training Records' },
  { value: '60',     label: 'Bangalore Localities' },
  { value: '89.9%',  label: 'Model Accuracy (R²)' },
  { value: '6',      label: 'AI Models Deployed' },
];

const WORKFLOW = [
  'User inputs Bangalore property details',
  'Data validated and preprocessed',
  'RF + XGBoost + ANN ensemble predicts value',
  'GBM Classifier evaluates risk level',
  'IsolationForest detects fraud anomalies',
  'Locality-specific 5-year forecast generated',
  'SHAP values explain AI decisions',
  'Buy / Hold / Avoid recommendation generated',
  'PDF + CSV report downloadable',
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a3c5e 60%, #1e4976 100%)',
        color: '#fff', padding: '5rem 1.5rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '0.3rem 1rem', fontSize: '0.82rem', color: '#6ee7b7', marginBottom: '1.5rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Production Ready — 6 AI Models Deployed
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.2rem' }}>
            🏡 LandIQ
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.75)', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            AI-Powered Land Intelligence Platform for Bangalore — Valuation, Risk Analytics, Fraud Detection & Investment Recommendations
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/dashboard' : '/register'}
              style={{ background: '#10b981', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              {user ? 'Go to Dashboard' : 'Get Started Free'} <ChevronRight size={18} />
            </Link>
            <Link to="/analysis"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              Try Analysis →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '1.5rem' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            Complete AI Intelligence Suite
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.6rem', fontSize: '1rem' }}>
            6 machine learning models working together for accurate land analytics
          </p>
        </div>
        <div className="grid-3" style={{ gap: '1.2rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ background: f.bg, border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: f.badgeColor, background: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', border: `1px solid ${f.badgeColor}22` }}>
                  {f.badge}
                </span>
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>14-step intelligent analysis pipeline</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
            {WORKFLOW.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.8rem 1rem', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #2a5a8e)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Ready to Analyze Your Property?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '1rem' }}>
            Get AI-powered valuation, risk score, fraud detection, and investment recommendation in seconds.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/parcels' : '/register'}
              style={{ background: '#10b981', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}>
              {user ? 'Add a Parcel' : 'Create Free Account'}
            </Link>
            <Link to="/geo"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={18} /> View Market Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
