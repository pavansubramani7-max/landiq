import React from 'react';
import { Download, AlertTriangle, CheckCircle, FileSpreadsheet, TrendingUp, Shield, Brain } from 'lucide-react';
import RiskMeter from './RiskMeter';
import ForecastChart from './ForecastChart';
import MapView from './MapView';
import ShapChart from './ShapChart';
import { getReportUrl } from '../utils/api';

const fmtINR = (v) => {
  if (!v && v !== 0) return '—';
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Number(v).toLocaleString()}`;
};

function exportToCSV(result) {
  const { analysis_id, valuation, risk, fraud, forecast, recommendation, input, asking_vs_estimated_pct } = result;
  const rows = [
    ['LandIQ Analysis Report'], ['Analysis ID', analysis_id], [],
    ['PROPERTY'], ['Locality', input?.locality || input?.city], ['Zone', input?.zone], ['Area (sqft)', input?.area_sqft], ['Asking Price', input?.asking_price], [],
    ['VALUATION'], ['Estimated Value', valuation?.estimated_value], ['Price/sqft', valuation?.price_per_sqft], ['Confidence', valuation?.confidence_pct + '%'], ['Asking vs Estimated', asking_vs_estimated_pct + '%'], [],
    ['RISK'], ['Score', risk?.risk_score], ['Level', risk?.risk_level],
    ...Object.entries(risk?.breakdown || {}).map(([k, v]) => [k.replace(/_/g, ' '), v]), [],
    ['FRAUD'], ['Detected', fraud?.fraud_detected ? 'YES' : 'NO'], ['Risk', fraud?.fraud_risk], ['Probability', (fraud?.fraud_probability * 100).toFixed(1) + '%'],
    ...fraud?.signals?.map(s => [`[${s.severity}] ${s.type}`, s.detail]) || [], [],
    ['FORECAST'], ['Annual Growth', forecast?.annual_growth_rate_pct + '%'], ['5-Year Gain', forecast?.five_year_gain_pct + '%'],
    ['Year', 'Price/sqft', 'Total Value'],
    ...forecast?.series?.map(s => [s.year, s.price_sqft, s.total_value]) || [], [],
    ['RECOMMENDATION', recommendation],
  ];
  const csv = rows.map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `LandIQ_${analysis_id}.csv`;
  a.click();
}

const SectionTitle = ({ icon, title, number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border)' }}>
    <span style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>{number}</span>
    <div style={{ color: 'var(--gold-dark)' }}>{icon}</div>
    <h3 style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--dark)', letterSpacing: '0.04em' }}>{title}</h3>
  </div>
);

export default function ResultDashboard({ result }) {
  const { analysis_id, valuation, risk, fraud, forecast, recommendation, input, asking_vs_estimated_pct } = result;

  const isAvoid = recommendation?.includes('AVOID') || recommendation?.includes('HIGH RISK');
  const isGood  = recommendation?.includes('GOOD') || recommendation?.includes('FAIR');
  const recColor = isAvoid ? '#c0392b' : isGood ? '#27ae60' : 'var(--gold-dark)';
  const recBg    = isAvoid ? '#fef2f2' : isGood ? '#f0fdf4' : 'var(--gold-pale)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* ── Recommendation Banner ── */}
      <div style={{ background: recBg, border: `2px solid ${recColor}`, borderRadius: '8px', padding: '1.2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Analysis #{analysis_id} · AI Recommendation
            </div>
            <div style={{ fontFamily: 'Times New Roman, Georgia, serif', fontWeight: 700, fontSize: '1.2rem', color: recColor }}>
              {recommendation}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={() => exportToCSV(result)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: '4px',
              background: 'var(--white)', border: '1px solid var(--border)',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
            }}>
              <FileSpreadsheet size={14} /> CSV
            </button>
            <a href={getReportUrl(analysis_id)} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: '4px',
              background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
              textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--dark)',
            }}>
              <Download size={14} /> PDF Report
            </a>
          </div>
        </div>
      </div>

      {/* ── Valuation + Risk ── */}
      <div className="grid-2">
        <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={<Brain size={16} />} title="AI Valuation" number="01" />
          <div style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: '2.2rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '0.3rem' }}>
            {fmtINR(valuation?.estimated_value)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            ₹{valuation?.price_per_sqft?.toLocaleString()}/sqft · {valuation?.confidence_pct}% confidence
          </div>
          <div style={{
            padding: '0.5rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600,
            background: asking_vs_estimated_pct > 0 ? '#fef9c3' : '#dcfce7',
            color: asking_vs_estimated_pct > 0 ? '#a16207' : '#15803d',
            border: `1px solid ${asking_vs_estimated_pct > 0 ? '#fde68a' : '#bbf7d0'}`,
            marginBottom: '1rem',
          }}>
            Asking is {asking_vs_estimated_pct > 0 ? '+' : ''}{asking_vs_estimated_pct}% vs AI estimate
          </div>
          {/* 3 model estimates */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              ['RF',  valuation?.rf_estimate,  '#a07830'],
              ['XGB', valuation?.xgb_estimate, '#7c3aed'],
              ['ANN', valuation?.ann_estimate,  '#0891b2'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ flex: 1, padding: '0.5rem', background: 'var(--light)', borderRadius: '4px', textAlign: 'center', border: `1px solid ${color}30` }}>
                <div style={{ fontSize: '0.65rem', color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--dark)', marginTop: '0.15rem' }}>{fmtINR(val)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SectionTitle icon={<Shield size={16} />} title="Risk Score" number="02" />
          <RiskMeter score={risk?.risk_score} level={risk?.risk_level} />
        </div>
      </div>

      {/* ── Risk Probabilities ── */}
      {risk?.risk_probabilities && (
        <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={<Shield size={16} />} title="ML Risk Classifier Probabilities" number="03" />
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {Object.entries(risk.risk_probabilities).map(([level, prob]) => {
              const color = level === 'LOW' ? '#15803d' : level === 'MEDIUM' ? '#a16207' : level === 'HIGH' ? '#b91c1c' : '#7f1d1d';
              const pct = Math.round(prob * 100);
              return (
                <div key={level} style={{ flex: 1, minWidth: 90, padding: '0.8rem', background: color + '0d', borderRadius: '6px', border: `1px solid ${color}25`, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color }}>{pct}%</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color, marginTop: '0.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{level}</div>
                  <div style={{ height: 3, background: '#e2e8f0', borderRadius: 2, marginTop: '0.5rem' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>Model: {risk.ml_model}</div>
        </div>
      )}

      {/* ── SHAP XAI ── */}
      <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <SectionTitle icon={<Brain size={16} />} title="Explainable AI — Feature Contributions" number="04" />
        <ShapChart breakdown={risk?.breakdown} riskScore={risk?.risk_score} riskLevel={risk?.risk_level} />
      </div>

      {/* ── Fraud Detection ── */}
      <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <SectionTitle icon={fraud?.fraud_detected ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} title="Fraud Detection" number="05" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', padding: '0.8rem 1rem', borderRadius: '6px', background: fraud?.fraud_detected ? '#fef2f2' : '#f0fdf4', border: `1px solid ${fraud?.fraud_detected ? '#fecaca' : '#bbf7d0'}` }}>
          {fraud?.fraud_detected
            ? <AlertTriangle size={18} color="#b91c1c" />
            : <CheckCircle size={18} color="#15803d" />}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: fraud?.fraud_detected ? '#b91c1c' : '#15803d' }}>
              {fraud?.fraud_detected ? 'Fraud Signals Detected' : 'No Fraud Detected'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Risk: {fraud?.fraud_risk} · Probability: {((fraud?.fraud_probability || 0) * 100).toFixed(1)}% · Model: {fraud?.ml_model}
            </div>
          </div>
        </div>
        {fraud?.signals?.length > 0 && fraud.signals.map((s, i) => (
          <div key={i} style={{ padding: '0.7rem 1rem', marginBottom: '0.5rem', borderRadius: '6px', background: s.severity === 'CRITICAL' ? '#fef2f2' : '#fffbeb', borderLeft: `3px solid ${s.severity === 'CRITICAL' ? '#b91c1c' : '#d97706'}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: s.severity === 'CRITICAL' ? '#b91c1c' : '#92400e', letterSpacing: '0.04em' }}>
              [{s.severity}] {s.type.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.detail}</div>
          </div>
        ))}
        {fraud?.anomaly_score != null && (
          <div style={{ marginTop: '0.8rem', padding: '0.7rem 1rem', background: 'var(--light)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Anomaly Score:</div>
            <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${fraud.anomaly_score}%`, background: fraud.anomaly_score > 70 ? '#b91c1c' : fraud.anomaly_score > 40 ? '#d97706' : '#15803d', borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: fraud.anomaly_score > 70 ? '#b91c1c' : fraud.anomaly_score > 40 ? '#d97706' : '#15803d', minWidth: 45 }}>{fraud.anomaly_score}/100</div>
          </div>
        )}
      </div>

      {/* ── Forecast + Map ── */}
      <div className="grid-2">
        <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={<TrendingUp size={16} />} title="5-Year Price Forecast" number="06" />
          <ForecastChart series={forecast?.series} growthRate={forecast?.annual_growth_rate_pct} />
          <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            5-year projected gain: <strong style={{ color: '#15803d' }}>{forecast?.five_year_gain_pct}%</strong>
          </div>
        </div>
        <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={<MapView size={16} />} title="Location" number="07" />
          <MapView city={input?.locality || input?.city} riskLevel={risk?.risk_level} />
        </div>
      </div>

    </div>
  );
}
