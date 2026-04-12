import React from 'react';
import { Download, AlertTriangle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import RiskMeter from './RiskMeter';
import ForecastChart from './ForecastChart';
import MapView from './MapView';
import ShapChart from './ShapChart';
import { getReportUrl } from '../utils/api';

const fmtINR = (v) => {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Number(v).toLocaleString()}`;
};

const badgeClass = (level) => `badge badge-${level?.toLowerCase()}`;

function exportToCSV(result) {
  const { analysis_id, valuation, risk, fraud, forecast, recommendation, input, asking_vs_estimated_pct } = result;

  const rows = [
    ['LandIQ Analysis Report'],
    ['Analysis ID', analysis_id],
    [],
    ['=== PROPERTY DETAILS ==='],
    ['City', input?.city], ['State', input?.state],
    ['Area (sqft)', input?.area_sqft], ['Zone', input?.zone],
    ['Infrastructure', input?.infrastructure], ['Asking Price (Rs)', input?.asking_price],
    ['Legal Disputes', input?.legal_disputes ? 'Yes' : 'No'],
    ['Flood Zone', input?.flood_zone ? 'Yes' : 'No'],
    [],
    ['=== VALUATION ==='],
    ['Estimated Value (Rs)', valuation?.estimated_value],
    ['Price per sqft (Rs)', valuation?.price_per_sqft],
    ['Confidence (%)', valuation?.confidence_pct],
    ['Asking vs Estimated (%)', asking_vs_estimated_pct],
    [],
    ['=== RISK ANALYSIS ==='],
    ['Risk Score', risk?.risk_score], ['Risk Level', risk?.risk_level],
    ...Object.entries(risk?.breakdown || {}).map(([k, v]) => [k.replace('_', ' '), v]),
    [],
    ['=== FRAUD DETECTION ==='],
    ['Fraud Detected', fraud?.fraud_detected ? 'YES' : 'NO'],
    ['Fraud Risk', fraud?.fraud_risk],
    ['Signal Count', fraud?.signal_count],
    ...fraud?.signals?.map(s => [`[${s.severity}] ${s.type}`, s.detail]) || [],
    [],
    ['=== 5-YEAR FORECAST ==='],
    ['Annual Growth Rate (%)', forecast?.annual_growth_rate_pct],
    ['5-Year Gain (%)', forecast?.five_year_gain_pct],
    ['Year', 'Price/sqft (Rs)', 'Total Value (Rs)'],
    ...forecast?.series?.map(s => [s.year, s.price_sqft, s.total_value]) || [],
    [],
    ['=== RECOMMENDATION ==='],
    ['Decision', recommendation],
  ];

  const csv = rows.map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LandIQ_Report_${analysis_id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultDashboard({ result }) {
  const { analysis_id, valuation, risk, fraud, forecast, recommendation, input, asking_vs_estimated_pct } = result;

  const recColor = recommendation?.includes('AVOID') || recommendation?.includes('HIGH RISK')
    ? 'var(--danger)' : recommendation?.includes('GOOD') ? 'var(--accent)' : 'var(--primary)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Recommendation Banner */}
      <div className="card" style={{ borderLeft: `5px solid ${recColor}`, padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.2rem' }}>
              Analysis #{analysis_id}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: recColor }}>{recommendation}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={() => exportToCSV(result)} className="btn btn-accent" style={{ fontSize: '0.85rem' }}>
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <a href={getReportUrl(analysis_id)} target="_blank" rel="noreferrer"
              className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
              <Download size={15} /> PDF Report
            </a>
          </div>
        </div>
      </div>

      {/* Valuation + Risk */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem' }}>Valuation</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {fmtINR(valuation.estimated_value)}
          </div>
          <div style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
            ₹{valuation.price_per_sqft?.toLocaleString()} / sqft · {valuation.confidence_pct}% confidence
          </div>
          <div style={{
            padding: '0.5rem 0.8rem', borderRadius: '8px',
            background: asking_vs_estimated_pct > 0 ? '#fef3cd' : '#d4edda',
            fontSize: '0.88rem', fontWeight: 600
          }}>
            Asking is {asking_vs_estimated_pct > 0 ? '+' : ''}{asking_vs_estimated_pct}% vs estimated
          </div>
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              ['RF',  valuation.rf_estimate,  '#2563eb'],
              ['XGB', valuation.xgb_estimate, '#7c3aed'],
              ['ANN', valuation.ann_estimate,  '#0891b2'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ flex: 1, minWidth: 80, padding: '0.5rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', border: `1px solid ${color}22` }}>
                <div style={{ fontSize: '0.7rem', color, fontWeight: 700 }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.15rem' }}>{fmtINR(val)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem', alignSelf: 'flex-start' }}>Risk Score</h3>
          <RiskMeter score={risk.risk_score} level={risk.risk_level} />
        </div>
      </div>

      {/* Risk Probabilities from ML Classifier */}
      {risk.risk_probabilities && (
        <div className="card">
          <h3 style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>ML Risk Classifier Probabilities</h3>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {Object.entries(risk.risk_probabilities).map(([level, prob]) => {
              const color = level === 'LOW' ? '#16a34a' : level === 'MEDIUM' ? '#d97706' : level === 'HIGH' ? '#dc2626' : '#7f1d1d';
              const pct = Math.round(prob * 100);
              return (
                <div key={level} style={{ flex: 1, minWidth: 100, padding: '0.8rem', background: color + '10', borderRadius: '10px', border: `1px solid ${color}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color }}>{pct}%</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color, marginTop: '0.2rem' }}>{level}</div>
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: '0.5rem' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>Model: {risk.ml_model}</div>
        </div>
      )}

      {/* XAI — SHAP Risk Breakdown */}
      <div className="card">
        <ShapChart
          breakdown={risk.breakdown}
          riskScore={risk.risk_score}
          riskLevel={risk.risk_level}
        />
      </div>

      {/* Fraud */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
          {fraud.fraud_detected
            ? <AlertTriangle size={20} color="var(--danger)" />
            : <CheckCircle size={20} color="var(--accent)" />}
          <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>
            Fraud Detection — <span className={badgeClass(fraud.fraud_risk)}>{fraud.fraud_risk}</span>
          </h3>
        </div>
        {fraud.signals.length === 0
          ? <p style={{ color: '#718096', fontSize: '0.9rem' }}>No fraud signals detected.</p>
          : fraud.signals.map((s, i) => (
            <div key={i} style={{
              padding: '0.6rem 0.9rem', marginBottom: '0.5rem', borderRadius: '8px',
              background: s.severity === 'CRITICAL' ? '#fff5f5' : '#fffbf0',
              borderLeft: `4px solid ${s.severity === 'CRITICAL' ? 'var(--danger)' : 'var(--warn)'}`
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>[{s.severity}] {s.type.replace(/_/g, ' ').toUpperCase()}</span>
              <p style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '0.2rem' }}>{s.detail}</p>
            </div>
          ))
        }
        {fraud.anomaly_score != null && (
          <div style={{ marginTop: '0.8rem', padding: '0.7rem 1rem', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>IsolationForest Anomaly Score:</div>
            <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${fraud.anomaly_score}%`, background: fraud.anomaly_score > 70 ? 'var(--danger)' : fraud.anomaly_score > 40 ? 'var(--warn)' : 'var(--accent)', borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontWeight: 800, color: fraud.anomaly_score > 70 ? 'var(--danger)' : fraud.anomaly_score > 40 ? 'var(--warn)' : 'var(--accent)', minWidth: 40 }}>{fraud.anomaly_score}/100</div>
          </div>
        )}
      </div>

      {/* Forecast + Map */}
      <div className="grid-2">
        <div className="card">
          <ForecastChart series={forecast.series} growthRate={forecast.annual_growth_rate_pct} />
          <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: '#718096' }}>
            5-year projected gain: <b style={{ color: 'var(--accent)' }}>{forecast.five_year_gain_pct}%</b>
          </div>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1rem' }}>Location</h3>
          <MapView city={input.city} riskLevel={risk.risk_level} />
        </div>
      </div>

    </div>
  );
}
