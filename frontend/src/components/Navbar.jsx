import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, BarChart2, Map, Info, LogOut, User, Shield, Home, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
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
      {/* Top gold strip */}
      <div style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))', height: '3px' }} />

      <nav className="navbar">
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/'} className="nav-brand">
          🏡 Land<span>IQ</span>
        </Link>

        {/* Center tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
            AI · Land Intelligence · Bangalore
          </div>
        </div>

        {/* Nav links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.05rem' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav-link ${pathname === l.to ? 'active' : ''}`}>
              {l.icon} {l.label}
            </Link>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.8rem', paddingLeft: '0.8rem', borderLeft: '1px solid rgba(201,168,76,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark)' }}>
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-light)' }}>{user.full_name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout}
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '0.3rem 0.7rem', borderRadius: 4, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.3)'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.8rem' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register"
                style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: 'var(--dark)', textDecoration: 'none', padding: '0.4rem 1.1rem', borderRadius: 4, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
