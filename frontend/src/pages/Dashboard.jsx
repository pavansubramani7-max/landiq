import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart2, Shield, TrendingUp, FileText, Plus, ArrowRight, MapPin, Map } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listParcels, parcelHistory } from '../utils/api';
import toast from 'react-hot-toast';

const fmtINR = (v) => {
  if (!v) return '—';
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Number(v).toLocaleString()}`;
};

const RISK_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const ZONE_COLORS = { residential: '#3b82f6', commercial: '#8b5cf6', agricultural: '#10b981', industrial: '#f59e0b' };

export default function Dashboard() {
  const { user } = useAuth();
  const [parcels,        setParcels]        = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    listParcels()
      .then(async (data) => {
        setParcels(data);
        const histories = await Promise.all(
          data.slice(0, 5).map(p => parcelHistory(p.id).catch(() => []))
        );
        setRecentAnalyses(histories.flat().slice(0, 8));
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const typeData = Object.entries(
    parcels.reduce((acc, p) => { acc[p.land_type] = (acc[p.land_type] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: ZONE_COLORS[name] || '#94a3b8' }));

  const riskData = Object.entries(
    recentAnalyses.reduce((acc, a) => { acc[a.risk_level] = (acc[a.risk_level] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name: name.toUpperCase(), value }));

  const avgRisk = recentAnalyses.length
    ? Math.round(recentAnalyses.reduce((s, a) => s + a.risk_score, 0) / recentAnalyses.length)
    : null;

  const stats = [
    { label: 'Total Parcels',  value: parcels.length,                                                    icon: <MapPin size={20} />,    bg: '#eff6ff', iconBg: '#dbeafe', iconColor: '#2563eb' },
    { label: 'Analyses Run',   value: recentAnalyses.length,                                             icon: <BarChart2 size={20} />, bg: '#f0fdf4', iconBg: '#dcfce7', iconColor: '#16a34a' },
    { label: 'High Risk',      value: recentAnalyses.filter(a => a.risk_level === 'high').length,        icon: <Shield size={20} />,    bg: '#fef2f2', iconBg: '#fee2e2', iconColor: '#dc2626' },
    { label: 'Avg Risk Score', value: avgRisk !== null ? `${avgRisk}/100` : '—',                         icon: <TrendingUp size={20} />,bg: '#fffbeb', iconBg: '#fef9c3', iconColor: '#d97706' },
  ];

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.8rem' }}>
        <div>
          <h1 className="section-title">Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="section-sub">Here's your Bangalore land intelligence overview</p>
        </div>
        <Link to="/parcels" className="btn btn-primary">
          <Plus size={16} /> Add Parcel
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '1.8rem' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ background: s.bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
              <div className="stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '1.8rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>Parcels by Zone Type</h3>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={typeData} barSize={36}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {typeData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📊</div>
              <p>Add parcels to see distribution</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>Risk Distribution</h3>
          {riskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={35}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {riskData.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name.toLowerCase()] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">🎯</div>
              <p>Run analyses to see risk distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Parcels Table */}
      <div className="card" style={{ marginBottom: '1.8rem', padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700 }}>Recent Parcels</h3>
          <Link to="/parcels" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span className="pulse">Loading parcels...</span>
          </div>
        ) : parcels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏗️</div>
            <h3>No parcels yet</h3>
            <p>Add your first Bangalore land parcel to get started</p>
            <Link to="/parcels" className="btn btn-primary"><Plus size={16} /> Add Parcel</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {['Survey No.', 'Locality', 'Zone', 'Area', 'Quoted Price', 'Action'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parcels.slice(0, 6).map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.survey_number}</td>
                    <td>{p.city}</td>
                    <td><span className={`badge badge-${p.land_type === 'commercial' ? 'blue' : p.land_type === 'industrial' ? 'medium' : 'low'}`}>{p.land_type}</span></td>
                    <td>{p.area_sqft?.toLocaleString()} sqft</td>
                    <td style={{ fontWeight: 700 }}>{fmtINR(p.quoted_price)}</td>
                    <td>
                      <Link to={`/parcels/${p.id}`} className="btn btn-outline btn-sm">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid-2">
        <Link to="/analysis" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BarChart2 size={24} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>Quick Analysis</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Run AI valuation without saving a parcel</div>
          </div>
          <ArrowRight size={16} color="var(--text-light)" style={{ marginLeft: 'auto' }} />
        </Link>
        <Link to="/geo" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Map size={24} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>Bangalore Market Map</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Explore locality-wise growth trends</div>
          </div>
          <ArrowRight size={16} color="var(--text-light)" style={{ marginLeft: 'auto' }} />
        </Link>
      </div>
    </div>
  );
}


