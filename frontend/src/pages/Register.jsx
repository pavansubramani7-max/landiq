import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const nameRef    = useRef('');
  const emailRef   = useRef('');
  const passRef    = useRef('');
  const confirmRef = useRef('');
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (passRef.current !== confirmRef.current) {
      setError('Passwords do not match');
      return;
    }
    if (passRef.current.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(emailRef.current, passRef.current, nameRef.current);
      toast.success('Account created! Welcome to LandIQ.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
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
          <p>Create your free account</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.2rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              autoComplete="name"
              placeholder="Rajesh Kumar"
              defaultValue=""
              onChange={e => { nameRef.current = e.target.value; }}
              required
              style={{ fontSize: '1rem' }}
            />
          </div>

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
              autoComplete="new-password"
              placeholder="Min 6 characters"
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

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type={showPass ? 'text' : 'password'}
              name="confirm"
              autoComplete="new-password"
              placeholder="Repeat password"
              defaultValue=""
              onChange={e => { confirmRef.current = e.target.value; }}
              required
              style={{ fontSize: '1rem' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg"
            disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? <span className="spinner" /> : <UserPlus size={18} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider" style={{ margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
