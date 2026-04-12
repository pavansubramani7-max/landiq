import React, { useEffect, useState } from 'react';
import { Users, BarChart2, FileText, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminStats, adminUsers, adminUpdateUser, adminAnalyses } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const fmtINR = (v) => {
  if (!v) return '—';
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Number(v).toLocaleString()}`;
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'analyst')) {
      navigate('/dashboard');
      return;
    }
    adminStats().then(setStats).catch(() => toast.error('Failed to load stats'));
    adminUsers().then(setUsers).catch(() => {});
    adminAnalyses().then(setAnalyses).catch(() => {});
  }, [user, navigate]);

  const toggleActive = async (u) => {
    try {
      const updated = await adminUpdateUser(u.id, { is_active: !u.is_active });
      setUsers(prev => prev.map(x => x.id === u.id ? updated : x));
      toast.success(`User ${updated.is_active ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const changeRole = async (u, role) => {
    try {
      const updated = await adminUpdateUser(u.id, { role });
      setUsers(prev => prev.map(x => x.id === u.id ? updated : x));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: <Users size={22} color="#1a3c5e" />, bg: '#ebf4ff' },
    { label: 'Active Users', value: stats.active_users, icon: <Users size={22} color="#2ecc71" />, bg: '#f0fff4' },
    { label: 'Total Parcels', value: stats.total_parcels, icon: <BarChart2 size={22} color="#f39c12" />, bg: '#fffbf0' },
    { label: 'Analyses Run', value: stats.total_analyses, icon: <Shield size={22} color="#e74c3c" />, bg: '#fff5f5' },
    { label: 'Documents', value: stats.total_documents, icon: <FileText size={22} color="#9b59b6" />, bg: '#faf5ff' },
  ] : [];

  const tabs = ['overview', 'users', 'analyses'];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Admin Panel
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.5rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: tab === t ? 700 : 500, color: tab === t ? 'var(--primary)' : '#718096',
            borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: '-2px', fontSize: '0.95rem', textTransform: 'capitalize'
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <>
          <div className="grid-5" style={{ marginBottom: '1.5rem' }}>
            {statCards.map(s => (
              <div key={s.label} className="card" style={{ padding: '1.2rem', background: s.bg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginTop: '0.2rem' }}>{s.label}</div>
                  </div>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>System Info</h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>LandIQ v2.0.0 — AI-Powered Land Intelligence Platform</p>
            <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '0.3rem' }}>Backend: Flask 3.0 · ML: XGBoost + Random Forest · DB: SQLite</p>
          </div>
        </>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.full_name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#718096' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <select value={u.role} onChange={e => changeRole(u, e.target.value)}
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.82rem' }}>
                        {['user', 'analyst', 'admin'].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${u.is_active ? 'low' : 'high'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#718096', fontSize: '0.85rem' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button onClick={() => toggleActive(u)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.is_active ? 'var(--accent)' : '#a0aec0' }}>
                        {u.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analyses */}
      {tab === 'analyses' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  {['Date', 'Parcel ID', 'Est. Value', 'Risk Score', 'Risk Level', 'Recommendation', 'Fraud Prob.'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analyses.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#718096' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.parcel_id.slice(0, 8)}…</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--primary)' }}>{fmtINR(a.estimated_value)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{a.risk_score}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${a.risk_level}`}>{a.risk_level}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, textTransform: 'uppercase', color: a.recommendation === 'avoid' ? 'var(--danger)' : a.recommendation === 'buy' ? 'var(--accent)' : 'var(--primary)' }}>
                      {a.recommendation}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{(a.fraud_probability * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                {analyses.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>No analyses yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
