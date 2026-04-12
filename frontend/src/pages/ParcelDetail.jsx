import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Upload, Play, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { getParcel, analyzeParcel, parcelHistory, listParcelDocs, uploadParcelDoc, getAnalysisReport } from '../utils/api';
import RiskMeter from '../components/RiskMeter';
import ForecastChart from '../components/ForecastChart';
import ShapChart from '../components/ShapChart';
import toast from 'react-hot-toast';

const fmtINR = (v) => {
  if (!v) return '—';
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Number(v).toLocaleString()}`;
};

export default function ParcelDetail() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [docs, setDocs] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docType, setDocType] = useState('other');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      getParcel(id),
      parcelHistory(id).catch(() => []),
      listParcelDocs(id).catch(() => []),
    ]).then(([p, h, d]) => {
      setParcel(p);
      setHistory(h);
      setDocs(d);
    }).catch(() => toast.error('Failed to load parcel'));
  }, [id]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const data = await analyzeParcel(id, { infrastructure: 'good' });
      setResult(data);
      const h = await parcelHistory(id).catch(() => []);
      setHistory(h);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!docFile) return;
    setUploading(true);
    try {
      await uploadParcelDoc(id, docFile, docType);
      toast.success('Document uploaded!');
      const d = await listParcelDocs(id);
      setDocs(d);
      setDocFile(null);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!parcel) return <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  const recColor = result?.recommendation === 'avoid' ? 'var(--danger)'
    : result?.recommendation === 'buy' ? 'var(--accent)' : 'var(--primary)';

  const exportCSV = () => {
    if (!result) return;
    const rows = [
      ['LandIQ Parcel Analysis'],
      ['Parcel', parcel.survey_number, parcel.city, parcel.state],
      ['Estimated Value', result.valuation?.estimated_value],
      ['Risk Score', result.risk?.risk_score, result.risk?.risk_level],
      ['Recommendation', result.recommendation],
      ['Fraud Probability', result.fraud_probability],
      ['Investment Score', result.investment_score],
    ];
    const csv = rows.map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `LandIQ_${parcel.survey_number}.csv`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link to="/parcels" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#718096', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Parcels
      </Link>

      {/* Parcel Header */}
      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: 800 }}>
              Survey #{parcel.survey_number}
            </h1>
            <p style={{ color: '#718096', marginTop: '0.3rem' }}>
              {parcel.city}, {parcel.district}, {parcel.state} — {parcel.pincode}
            </p>
          </div>
          <button className="btn btn-accent" onClick={runAnalysis} disabled={analyzing}>
            <Play size={16} />
            {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </div>

        <div className="grid-3" style={{ marginTop: '1.2rem' }}>
          {[
            ['Land Type', parcel.land_type],
            ['Area', `${parcel.area_sqft?.toLocaleString()} sqft`],
            ['Quoted Price', fmtINR(parcel.quoted_price)],
            ['Owner', parcel.owner_name],
            ['Ownership Changes', parcel.num_ownership_changes],
            ['Flood Risk', parcel.flood_zone_risk],
            ['Litigations', parcel.pending_litigations],
            ['Near Tech Park', parcel.near_tech_park ? 'Yes' : 'No'],
            ['Highway Dist.', parcel.dist_highway_km ? `${parcel.dist_highway_km} km` : '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: '0.75rem', color: '#a0aec0', fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontWeight: 600, color: '#2d3748', marginTop: '0.2rem' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Result */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.2rem' }}>
          <div className="card" style={{ borderLeft: `5px solid ${recColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>Recommendation</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: recColor, textTransform: 'uppercase' }}>
                  {result.recommendation}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.3rem' }}>
                  Investment Score: <b>{result.investment_score}/100</b> · Fraud Probability: <b>{(result.fraud_probability * 100).toFixed(1)}%</b>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={exportCSV} className="btn btn-accent" style={{ fontSize: '0.85rem' }}>
                <FileSpreadsheet size={15} /> CSV
              </button>
              <a href={getAnalysisReport(result.prediction_id)} target="_blank" rel="noreferrer"
                className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
                <Download size={15} /> PDF
              </a>
            </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3 style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Valuation</h3>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                {fmtINR(result.valuation?.estimated_value)}
              </div>
              <div style={{ color: '#718096', fontSize: '0.85rem' }}>
                ₹{result.valuation?.price_per_sqft?.toLocaleString()}/sqft · {result.valuation?.confidence_pct}% confidence
              </div>
              <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: result.asking_vs_estimated_pct > 0 ? '#fef3cd' : '#d4edda', fontSize: '0.85rem', fontWeight: 600 }}>
                Asking is {result.asking_vs_estimated_pct > 0 ? '+' : ''}{result.asking_vs_estimated_pct}% vs estimated
              </div>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '1rem', alignSelf: 'flex-start', marginBottom: '0.5rem' }}>Risk Score</h3>
              <RiskMeter score={result.risk?.risk_score} level={result.risk?.risk_level?.toUpperCase()} />
            </div>
          </div>

          <div className="card">
            <ShapChart
              breakdown={result.risk?.breakdown}
              riskScore={result.risk?.risk_score}
              riskLevel={result.risk?.risk_level?.toUpperCase()}
            />
          </div>

          <div className="card">
            <ForecastChart series={result.forecast?.series} growthRate={result.forecast?.annual_growth_rate_pct} />
          </div>
        </div>
      )}

      {/* Analysis History */}
      {history.length > 0 && (
        <div className="card" style={{ marginBottom: '1.2rem' }}>
          <h3 style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Analysis History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  {['Date', 'Est. Value', 'Risk Score', 'Risk Level', 'Recommendation'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.8rem', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.8rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem 0.8rem' }}>{new Date(h.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.5rem 0.8rem', fontWeight: 600 }}>{fmtINR(h.estimated_value)}</td>
                    <td style={{ padding: '0.5rem 0.8rem' }}>{h.risk_score}</td>
                    <td style={{ padding: '0.5rem 0.8rem' }}>
                      <span className={`badge badge-${h.risk_level}`}>{h.risk_level}</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.8rem', fontWeight: 600, textTransform: 'uppercase', color: h.recommendation === 'avoid' ? 'var(--danger)' : h.recommendation === 'buy' ? 'var(--accent)' : 'var(--primary)' }}>
                      {h.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="card">
        <h3 style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Legal Documents</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label>Document Type</label>
            <select value={docType} onChange={e => setDocType(e.target.value)}>
              {['sale_deed', 'ec', 'khata', 'rtc', 'other'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <label>File (.txt, .pdf, .jpg)</label>
            <input type="file" accept=".txt,.pdf,.png,.jpg,.jpeg"
              onChange={e => setDocFile(e.target.files[0])} style={{ padding: '0.4rem' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading || !docFile}>
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {docs.length === 0 ? (
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>No documents uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {docs.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.filename}</span>
                  <span style={{ marginLeft: '0.6rem', fontSize: '0.78rem', color: '#718096' }}>{d.doc_type}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  {d.integrity_score != null && (
                    <span style={{ fontSize: '0.78rem', background: '#d4edda', color: '#155724', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 600 }}>
                      Integrity: {d.integrity_score}%
                    </span>
                  )}
                  <span className={`badge badge-${d.status === 'verified' ? 'low' : d.status === 'review' ? 'medium' : 'high'}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
