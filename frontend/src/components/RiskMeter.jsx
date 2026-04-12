import React from 'react';

export default function RiskMeter({ score, level }) {
  const color = level === 'LOW' ? '#2ecc71'
    : level === 'MEDIUM' ? '#f39c12'
    : level === 'HIGH' ? '#e74c3c'
    : '#721c24';

  const angle = (score / 100) * 180 - 90;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 200 110" width="200" height="110">
        {/* Background arc */}
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
        {/* Colored arc */}
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke={color}
          strokeWidth="18" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 283} 283`} />
        {/* Needle */}
        <line
          x1="100" y1="100"
          x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
          stroke="#1a3c5e" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="#1a3c5e" />
        <text x="100" y="88" textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}>{score}</text>
        <text x="100" y="108" textAnchor="middle" fontSize="11" fill="#718096">{level} RISK</text>
      </svg>
    </div>
  );
}
