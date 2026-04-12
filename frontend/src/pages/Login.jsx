import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const emailRef   = useRef('');
  const passRef    = useRef('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(emailRef.current, passRef.current);
      toast.success(`Welcome back, ${user.full_name.split(' ')[0]}!`);
      navigate(user.role === 'admin' || user.role === 'analyst' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <span className="auth-logo-icon">🏡</span>
          <h1>LandIQ</h1>
          <p>AI-Powered Land Intelligence Platform</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.2rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              defaultValue=""
              onChange={e => { emailRef.current = e.target.value; }}
              required
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              defaultValue=""
              onChange={e => { passRef.current = e.target.value; }}
              required
              style={{ fontSize: '1rem', paddingRight: '2.8rem' }}
            />
            <button type="button" onClick={() => setShowPass(s => !s)}
              style={{ position: 'absolute', right: '0.8rem', top: '2.1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem' }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-lg"
            disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? <span className="spinner" /> : <LogIn size={18} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider" style={{ margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one free</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.85rem' }}>
          <Link to="/analysis" style={{ color: 'var(--text-light)' }}>Continue without login →</Link>
        </p>
      </div>
    </div>
  );
}
