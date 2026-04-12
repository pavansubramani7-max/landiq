import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fmt = (v) => v >= 1e7 ? `₹${(v/1e7).toFixed(1)}Cr` : `₹${(v/1e5).toFixed(0)}L`;

export default function ForecastChart({ series, growthRate }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>5-Year Price Forecast</span>
        <span style={{ fontSize: '0.82rem', background: '#d4edda', color: '#155724', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
          {growthRate}% / yr
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={series} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={70} />
          <Tooltip formatter={(v) => [fmt(v), 'Total Value']} />
          <Line type="monotone" dataKey="total_value" stroke="#1a3c5e" strokeWidth={2.5}
            dot={{ fill: '#2ecc71', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
