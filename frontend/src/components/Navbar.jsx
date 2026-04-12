import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, BarChart2, Map, Info, LogOut, User, Shield, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    ...(user ? [{ to: '/dashboard', label: 'Dashboard', icon: <Home size={15} /> }] : []),
    { to: '/analysis', label: 'Analysis', icon: <BarChart2 size={15} /> },
    ...(user ? [{ to: '/parcels', label: 'Parcels', icon: <MapPin size={15} /> }] : []),
    { to: '/geo', label: 'Map', icon: <Map size={15} /> },
    { to: '/about', label: 'About', icon: <Info size={15} /> },
    ...(user && (user.role === 'admin' || user.role === 'analyst')
      ? [{ to: '/admin', label: 'Admin', icon: <Shield size={15} /> }]
      : []),
  ];

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="nav-brand">
        🏡 <span>LandIQ</span>
      </Link>

      <div className="nav-links">
        {navLinks.map(l => (
          <Link key={l.to} to={l.to}
            className={`nav-link ${pathname === l.to ? 'active' : ''}`}>
            {l.icon} {l.label}
          </Link>
        ))}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.8rem', paddingLeft: '0.8rem', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={15} color="#fff" />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{user.full_name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</div>
              </div>
            </div>
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '0.35rem 0.7rem', borderRadius: 6, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '0.8rem' }}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" style={{ background: 'var(--accent)', color: '#fff', textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.88rem', fontWeight: 700, transition: 'all 0.15s' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
