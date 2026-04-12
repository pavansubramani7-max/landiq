import React, { useState } from 'react';
import { Brain, Shield, AlertTriangle, TrendingUp, BarChart2, FileText, Server, Database, Cloud } from 'lucide-react';

const MODELS = [
  { name: 'Random Forest',        type: 'Regressor',   purpose: 'Land valuation (35% weight)',          metric: 'R² = 0.8947', color: '#2563eb', icon: <BarChart2 size={16} /> },
  { name: 'XGBoost',              type: 'Regressor',   purpose: 'Land valuation (45% weight)',          metric: 'R² = 0.8921', color: '#7c3aed', icon: <BarChart2 size={16} /> },
  { name: 'ANN (MLPRegressor)',   type: 'Regressor',   purpose: 'Land valuation (20% weight)',          metric: 'R² = 0.8985', color: '#0891b2', icon: <Brain size={16} /> },
  { name: 'GradientBoosting',     type: 'Classifier',  purpose: 'Risk level: LOW/MEDIUM/HIGH/CRITICAL', metric: 'Acc = 73.6%', color: '#dc2626', icon: <Shield size={16} /> },
  { name: 'IsolationForest',      type: 'Anomaly Det.','purpose': 'Fraud & anomaly detection',          metric: '8% contamination', color: '#d97706', icon: <AlertTriangle size={16} /> },
  { name: 'Ensemble (3-model)',   type: 'Combined',    purpose: 'Final valuation output',               metric: 'R² = 0.8990', color: '#16a34a', icon: <TrendingUp size={16} /> },
];

const STACK = [
  { layer: 'Frontend',    icon: <BarChart2 size={16} />, tech: 'React 18, React Router 6, Recharts, Leaflet, Axios, Lucide' },
  { layer: 'Backend',     icon: <Server size={16} />,    tech: 'Python Flask 3.0, Flask-JWT-Extended, Flask-Limiter, SQLAlchemy 2.0' },
  { layer: 'ML Models',   icon: <Brain size={16} />,     tech: 'Scikit-learn (RF, GBM, IsolationForest, ANN), XGBoost 2.0, NumPy, Pandas' },
  { layer: 'Database',    icon: <Database size={16} />,  tech: 'SQLite (dev) / PostgreSQL (prod), Alembic migrations' },
  { layer: 'Reports',     icon: <FileText size={16} />,  tech: 'ReportLab 4.2 — branded PDF, CSV export' },
  { layer: 'DevOps',      icon: <Cloud size={16} />,     tech: 'Docker, Docker Compose, Kubernetes (K8s), GitHub Actions CI/CD' },
  { layer: 'Monitoring',  icon: <Shield size={16} />,    tech: 'Prometheus + Grafana, Flask metrics exporter' },
];

const SPRINTS = [
  { n: 1, title: 'Foundation',         items: ['JWT Auth system', 'Role-based access', 'React UI setup'] },
  { n: 2, title: 'Backend & Database', items: ['Flask REST API', 'SQLAlchemy models', 'Land parcel CRUD'] },
  { n: 3, title: 'ML Valuation',       items: ['8,000 Bangalore records', 'RF + XGBoost + ANN ensemble', 'R² = 0.899'] },
  { n: 4, title: 'Risk & Fraud',       items: ['GBM Risk Classifier', 'IsolationForest anomaly detection', '5 fraud signals'] },
  { n: 5, title: 'Geo-Spatial',        items: ['60 Bangalore localities', 'Leaflet map with risk zones', 'Growth rate heatmap'] },
  { n: 6, title: 'XAI & Recommend.',   items: ['SHAP feature importance', 'Buy/Hold/Avoid engine', 'Investment scoring'] },
  { n: 7, title: 'Reporting',          items: ['PDF reports (ReportLab)', 'CSV export', 'Admin analytics panel'] },
  { n: 8, title: 'DevOps & Deploy',    items: ['Docker + Compose', 'Kubernetes manifests + HPA', 'GitHub Actions CI/CD'] },
];

const TABS = ['Models', 'Tech Stack', 'Agile Sprints', 'Dataset'];

export default function About() {
  const [tab, setTab] = useState('Models');

  return (
    <div className="page-sm fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title">About LandIQ</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.7 }}>
          AI-powered land intelligence platform for Bangalore real estate — built with Agile methodology,
          6 ML models, and full DevOps pipeline.
        </p>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Models Tab */}
      {tab === 'Models' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {MODELS.map(m => (
            <div key={m.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: m.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, flexShrink: 0 }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{m.name}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: m.color, background: m.color + '18', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>{m.type}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.purpose}</div>
              </div>
              <div style={{ fontWeight: 800, color: m.color, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{m.metric}</div>
            </div>
          ))}
          <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>Ensemble Strategy</div>
            <div style={{ fontSize: '0.88rem', color: '#166534' }}>
              Final valuation = <b>35% RF</b> + <b>45% XGBoost</b> + <b>20% ANN</b> → R² = 0.8990, MAE = Rs.1,016/sqft on 1,200 test records
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack Tab */}
      {tab === 'Tech Stack' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <tbody>
              {STACK.map(s => (
                <tr key={s.layer}>
                  <td style={{ width: '130px', fontWeight: 700, color: 'var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {s.icon} {s.layer}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{s.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Agile Sprints Tab */}
      {tab === 'Agile Sprints' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {SPRINTS.map(s => (
            <div key={s.n} className="card" style={{ padding: '1rem 1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>
                  {s.n}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>Sprint {s.n} — {s.title}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingLeft: '2.2rem' }}>
                {s.items.map(item => (
                  <span key={item} style={{ fontSize: '0.8rem', background: '#f1f5f9', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dataset Tab */}
      {tab === 'Dataset' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Bangalore Land Dataset (2024)</h3>
            <div className="grid-2" style={{ gap: '0.8rem' }}>
              {[
                ['Total Records', '8,000'],
                ['Unique Localities', '60'],
                ['Price Range', 'Rs.583 – Rs.35,073/sqft'],
                ['Avg Price', 'Rs.8,064/sqft'],
                ['Features', '18 per record'],
                ['Train / Test Split', '85% / 15%'],
                ['Zones', 'Residential, Commercial, Agricultural, Industrial'],
                ['Areas Covered', 'Central, North, East, South, West, Peripheral'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.7rem 0.9rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem', fontSize: '0.9rem' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>Key Features Used</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['area_sqft','distance_highway_km','distance_city_center_km','distance_water_km','distance_metro_km','ownership_changes','years_held','legal_disputes','flood_zone','near_metro','near_tech_park','zone','infrastructure'].map(f => (
                <span key={f} style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>{f}</span>
              ))}
            </div>
          </div>
          <div className="alert alert-info">
            Dataset generated using real Bangalore market data (2024) with locality-specific base prices, infrastructure tiers, and flood zone probabilities. Saved at <code>backend/models/data/bangalore_land_data.csv</code>
          </div>
        </div>
      )}

      <p style={{ marginTop: '2rem', color: 'var(--text-light)', fontSize: '0.82rem', textAlign: 'center' }}>
        LandIQ v2.0.0 — Built with Amazon Q Developer · Agile Methodology · 8 Sprints
      </p>
    </div>
  );
}
