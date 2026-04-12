import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#2ecc71',
};

function getColor(value) {
  if (value >= 60) return COLORS.high;
  if (value >= 30) return COLORS.medium;
  return COLORS.low;
}

const LABELS = {
  price_anomaly: 'Price Anomaly',
  ownership: 'Ownership',
  legal: 'Legal',
  environmental: 'Environmental',
  infrastructure: 'Infrastructure',
  market: 'Market',
};

export default function ShapChart({ breakdown, riskScore, riskLevel }) {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  const data = Object.entries(breakdown)
    .map(([key, value]) => ({ name: LABELS[key] || key, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);

  const levelColor = riskLevel === 'LOW' ? '#2ecc71'
    : riskLevel === 'MEDIUM' ? '#f39c12'
    : riskLevel === 'HIGH' ? '#e74c3c' : '#721c24';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
          Risk Factor Breakdown (XAI)
        </span>
        <span style={{
          fontSize: '0.82rem', padding: '0.2rem 0.7rem', borderRadius: '12px', fontWeight: 700,
          background: levelColor + '22', color: levelColor
        }}>
          Score: {riskScore} — {riskLevel}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 90, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
          <Tooltip formatter={(v) => [`${v} / 100`, 'Risk Score']} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={getColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[['High (≥60)', COLORS.high], ['Medium (30–59)', COLORS.medium], ['Low (<30)', COLORS.low]].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#718096' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Confidence index */}
      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: '#f7fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
        <span style={{ color: '#718096' }}>Top risk driver: </span>
        <span style={{ fontWeight: 700, color: levelColor }}>{data[0]?.name}</span>
        <span style={{ color: '#718096' }}> contributing </span>
        <span style={{ fontWeight: 700 }}>{data[0]?.value}/100</span>
        <span style={{ color: '#718096' }}> to overall risk.</span>
      </div>
    </div>
  );
}
