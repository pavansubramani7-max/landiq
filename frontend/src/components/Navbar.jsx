import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, BarChart2, Map, Info, LogOut, Shield, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const navLinks = [
    ...(user ? [{ to: '/dashboard', label: 'Dashboard', icon: <Home size={14} /> }] : []),
    { to: '/analysis', label: 'Analysis', icon: <BarChart2 size={14} /> },
    ...(user ? [{ to: '/parcels', label: 'Parcels', icon: <MapPin size={14} /> }] : []),
    { to: '/geo', label: 'Market Map', icon: <Map size={14} /> },
    { to: '/about', label: 'About', icon: <Info size={14} /> },
    ...(user && (user.role === 'admin' || user.role === 'analyst')
      ? [{ to: '/admin', label: 'Admin', icon: <Shield size={14} /> }]
      : []),
  ];

  return (
    <>
      {/* Gold top strip */}
      <div style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-dark))', height: '3px' }} />

      <nav style={{
        background: 'var(--dark)',
        height: '62px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        borderBottom: '1px solid rgba(201,168,76,0.25)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}>
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/'} style={{
          color: 'var(--gold-light)',
          textDecoration: 'none',
          fontFamily: 'Times New Roman, Georgia, serif',
          fontWeight: 700,
          fontSize: '1.35rem',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexShrink: 0,
        }}>
          🏡 <span>Land<span style={{ color: 'var(--gold)' }}>IQ</span></span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.05rem' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              color: pathname === l.to ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: pathname === l.to ? 700 : 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.2s',
              borderBottom: pathname === l.to ? '2px solid var(--gold)' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (pathname !== l.to) e.currentTarget.style.color = 'var(--gold-light)'; }}
              onMouseLeave={e => { if (pathname !== l.to) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>

        {/* User / Auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark)',
              }}>
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                  {user.full_name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {user.role}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'rgba(255,255,255,0.65)',
              cursor: 'pointer',
              padding: '0.3rem 0.65rem',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.25)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
              <LogOut size={12} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <Link to="/login" style={{
              color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              padding: '0.35rem 0.8rem', fontSize: '0.78rem',
              fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Login</Link>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
              color: 'var(--dark)', textDecoration: 'none',
              padding: '0.38rem 1rem', borderRadius: '4px',
              fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Register</Link>
          </div>
        )}
      </nav>
    </>
  );
}
