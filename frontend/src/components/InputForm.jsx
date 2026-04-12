import React, { useRef, useState } from 'react';
import { Search, Upload, MapPin } from 'lucide-react';

const LOCALITIES = [
  'Indiranagar','Koramangala','MG Road','Brigade Road','Lavelle Road',
  'Sadashivanagar','Vasanth Nagar','Richmond Town','Frazer Town','Shivajinagar',
  'Hebbal','Yelahanka','Devanahalli','Thanisandra','Kogilu','Jakkur',
  'Bellary Road','Nagawara','HBR Layout','Kalyan Nagar',
  'Whitefield','Marathahalli','Brookefield','ITPL','Varthur',
  'Kadugodi','Hoodi','KR Puram','Mahadevapura','Doddanekundi',
  'JP Nagar','Jayanagar','BTM Layout','Banashankari','Basavanagudi',
  'Kanakapura Road','Bannerghatta Road','Electronic City','Bommanahalli','HSR Layout',
  'Rajajinagar','Malleshwaram','Yeshwanthpur','Peenya','Tumkur Road',
  'Nagarbhavi','Vijayanagar','Basaveshwara Nagar','Mahalakshmi Layout','RR Nagar',
  'Sarjapur Road','Bellandur','Carmelaram','Harlur','Begur',
  'Attibele','Anekal','Chandapura','Hoskote','Doddaballapur',
];
const ZONES = ['residential','commercial','agricultural','industrial'];
const INFRA  = ['excellent','good','average','poor'];

export default function InputForm({ onSubmit, loading }) {
  // Use refs for all text/number inputs — fixes cursor jumping completely
  const refs = {
    area_sqft:               useRef(null),
    asking_price:            useRef(null),
    owner_name:              useRef(null),
    distance_highway_km:     useRef(null),
    distance_city_center_km: useRef(null),
    distance_metro_km:       useRef(null),
    distance_water_km:       useRef(null),
    ownership_changes:       useRef(null),
    years_held:              useRef(null),
  };

  // Only selects and checkboxes need state (they don't have cursor issues)
  const [locality,      setLocality]      = useState('Whitefield');
  const [zone,          setZone]          = useState('residential');
  const [infrastructure,setInfrastructure]= useState('good');
  const [legalDisputes, setLegalDisputes] = useState(false);
  const [floodZone,     setFloodZone]     = useState(false);
  const [nearTechPark,  setNearTechPark]  = useState(true);
  const [docFile,       setDocFile]       = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      locality,
      city:                    locality,
      state:                   'Karnataka',
      zone,
      infrastructure,
      area_sqft:               Number(refs.area_sqft.current.value),
      asking_price:            Number(refs.asking_price.current.value),
      owner_name:              refs.owner_name.current.value,
      distance_highway_km:     Number(refs.distance_highway_km.current.value),
      distance_city_center_km: Number(refs.distance_city_center_km.current.value),
      distance_metro_km:       Number(refs.distance_metro_km.current.value),
      distance_water_km:       Number(refs.distance_water_km.current.value),
      ownership_changes:       Number(refs.ownership_changes.current.value),
      years_held:              Number(refs.years_held.current.value),
      legal_disputes:          legalDisputes,
      flood_zone:              floodZone,
      near_tech_park:          nearTechPark,
    }, docFile);
  };

  return (
    <form onSubmit={handleSubmit} className="card fade-in" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#ebf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={18} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 800 }}>Bangalore Property Analysis</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Enter property details to get AI-powered valuation</p>
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Locality</label>
          <select value={locality} onChange={e => setLocality(e.target.value)}>
            {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Zone / Land Use</label>
          <select value={zone} onChange={e => setZone(e.target.value)}>
            {ZONES.map(z => <option key={z} value={z}>{z.charAt(0).toUpperCase()+z.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Infrastructure Quality</label>
          <select value={infrastructure} onChange={e => setInfrastructure(e.target.value)}>
            {INFRA.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase()+i.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Area (sqft)</label>
          <input ref={refs.area_sqft} type="number" defaultValue="2400" min="100" required />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Asking Price (₹)</label>
          <input ref={refs.asking_price} type="number" defaultValue="18000000" min="0" required />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Owner Name</label>
          <input ref={refs.owner_name} type="text" defaultValue="Rajesh Kumar" placeholder="Owner name" />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Distance to Highway (km)</label>
          <input ref={refs.distance_highway_km} type="number" defaultValue="5.0" step="0.1" min="0" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Distance to City Center (km)</label>
          <input ref={refs.distance_city_center_km} type="number" defaultValue="18.0" step="0.1" min="0" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Distance to Metro (km)</label>
          <input ref={refs.distance_metro_km} type="number" defaultValue="1.2" step="0.1" min="0" />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid-3" style={{ marginBottom: '1.2rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Distance to Water Body (km)</label>
          <input ref={refs.distance_water_km} type="number" defaultValue="2.5" step="0.1" min="0" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Ownership Changes</label>
          <input ref={refs.ownership_changes} type="number" defaultValue="1" min="0" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Years Held</label>
          <input ref={refs.years_held} type="number" defaultValue="4" min="0" />
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: 8, border: '1px solid var(--border)' }}>
        {[
          [legalDisputes, setLegalDisputes, 'Legal Disputes', '⚖️'],
          [floodZone,     setFloodZone,     'Flood Zone (Lake/Low-lying)', '🌊'],
          [nearTechPark,  setNearTechPark,  'Near Tech Park / IT Hub', '💻'],
        ].map(([val, setter, label, icon]) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)', textTransform: 'none', letterSpacing: 0, marginBottom: 0 }}>
            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ width: 16, height: 16 }} />
            {icon} {label}
          </label>
        ))}
      </div>

      {/* Document upload */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label>Upload Legal Document (optional)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input type="file" accept=".txt,.pdf,.png,.jpg"
            onChange={e => setDocFile(e.target.files[0])}
            style={{ flex: 1, minWidth: 200 }} />
          {docFile && (
            <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Upload size={14} /> {docFile.name}
            </span>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
        {loading ? <span className="spinner" /> : <Search size={18} />}
        {loading ? 'Analyzing property...' : 'Run AI Analysis'}
      </button>
    </form>
  );
}
