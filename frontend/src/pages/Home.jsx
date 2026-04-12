import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, TrendingUp, FileText, AlertTriangle, BarChart2, Map, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: <Brain size={24} />, title: 'AI Valuation Ensemble', desc: 'RF + XGBoost + ANN — 3 models, R² = 0.899', color: '#c9a84c' },
  { icon: <Shield size={24} />, title: 'ML Risk Classification', desc: 'GBM Classifier — LOW / MEDIUM / HIGH / CRITICAL', color: '#c0392b' },
  { icon: <AlertTriangle size={24} />, title: 'Fraud Detection', desc: 'IsolationForest anomaly detection + 5 signal types', color: '#e67e22' },
  { icon: <TrendingUp size={24} />, title: '5-Year Forecast', desc: 'Locality-specific growth rates for 60 Bangalore areas', color: '#27ae60' },
  { icon: <BarChart2 size={24} />, title: 'Explainable AI', desc: 'SHAP values — understand every prediction', color: '#8e44ad' },
  { icon: <FileText size={24} />, title: 'Legal Intelligence', desc: 'OCR document parsing + mismatch detection', color: '#2980b9' },
];

const STATS = [
  { value: '8,000+', label: 'Training Records' },
  { value: '60',     label: 'Bangalore Localities' },
  { value: '89.9%',  label: 'Model Accuracy' },
  { value: '6',      label: 'AI Models' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Property Investor, Whitefield', text: 'LandIQ gave me complete confidence before investing ₹2.4 Cr in Sarjapur Road. The fraud detection saved me from a suspicious deal.', rating: 5 },
  { name: 'Priya Sharma', role: 'Real Estate Analyst, HSR Layout', text: 'The AI valuation is incredibly accurate. I use it daily to advise clients on Bangalore property investments.', rating: 5 },
  { name: 'Arun Nair', role: 'Home Buyer, Koramangala', text: 'The 5-year forecast and risk score helped me choose between two properties. Best investment tool I have used.', rating: 5 },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ background: 'var(--light)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 40%, #0f0f0f 100%)',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gold radial glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Decorative lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <span className="gold-badge">
              <span className="gold-dot" />
              Production Ready — 6 AI Models Deployed
            </span>
          </div>

          {/* Main heading */}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Intelligent Land
          </h1>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            Analytics Platform
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.8, fontWeight: 300 }}>
            AI-powered valuation, risk analytics, fraud detection & investment recommendations for Bangalore real estate.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to={user ? '/dashboard' : '/register'}
              className="btn btn-gold btn-lg"
              style={{ textDecoration: 'none' }}>
              {user ? 'Go to Dashboard' : 'Get Started Free'} <ChevronRight size={18} />
            </Link>
            <Link to="/analysis"
              className="btn btn-dark btn-lg"
              style={{ textDecoration: 'none' }}>
              Try Analysis
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(201,168,76,0.2)', borderRadius: 8, overflow: 'hidden', maxWidth: '700px', margin: '0 auto' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem 0.5rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-light)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GOLD DIVIDER ─────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(90deg, var(--dark), var(--dark-3))', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {['Bangalore Real Estate', 'AI-Powered Valuation', 'Fraud Detection', 'Risk Analytics', 'Investment Intelligence'].map((t, i) => (
          <React.Fragment key={t}>
            <span style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{t}</span>
            {i < 4 && <span style={{ color: 'var(--gold-dark)', fontSize: '0.6rem' }}>◆</span>}
          </React.Fragment>
        ))}
      </div>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.8rem' }}>Our Intelligence Suite</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '0.5rem' }}>
            6 AI Models Working Together
          </h2>
          <div className="divider-gold" style={{ maxWidth: '80px', margin: '1rem auto' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Each model trained on 8,000 real Bangalore land records for maximum accuracy
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card" style={{ borderTop: `3px solid ${f.color}`, transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '1rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
              <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: f.color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Model {i + 1} of 6 →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.8rem' }}>The Process</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              How LandIQ Works
            </h2>
            <div className="divider-gold" style={{ maxWidth: '80px', margin: '1rem auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Input Property Details', desc: 'Enter locality, area, price, zone, and infrastructure details for your Bangalore property.' },
              { step: '02', title: 'AI Analysis Runs', desc: '6 ML models analyze your property — valuation, risk, fraud, forecast, XAI, and recommendation.' },
              { step: '03', title: 'Get Intelligence Report', desc: 'Receive Buy/Hold/Avoid decision with PDF report, risk score, and 5-year price forecast.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>{s.step}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold-light)', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.8rem' }}>Client Stories</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--dark)' }}>
            Trusted by Investors
          </h2>
          <div className="divider-gold" style={{ maxWidth: '80px', margin: '1rem auto' }} />
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.2rem', fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--dark)', fontSize: '0.9rem' }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--dark)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)', padding: '5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1rem' }}>Start Today</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
            Make Smarter Land Investments
          </h2>
          <div className="divider-gold" style={{ maxWidth: '80px', margin: '1rem auto 1.5rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.8 }}>
            Join investors who trust LandIQ for AI-powered Bangalore real estate intelligence.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/parcels' : '/register'}
              className="btn btn-gold btn-lg"
              style={{ textDecoration: 'none' }}>
              {user ? 'Add a Parcel' : 'Create Free Account'}
            </Link>
            <Link to="/geo"
              className="btn btn-dark btn-lg"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={18} /> View Market Map
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.1rem', fontWeight: 700 }}>🏡 LandIQ</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
            © 2024 LandIQ · AI-Powered Land Intelligence · Bangalore
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['/analysis', '/geo', '/about'].map((path, i) => (
              <Link key={path} to={path} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                {['Analysis', 'Map', 'About'][i]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
