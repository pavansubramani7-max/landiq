import React, { useRef, useState } from 'react';
import { Search, Upload, MapPin, ChevronDown } from 'lucide-react';

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

const sectionStyle = {
  marginBottom: '1.8rem',
};
const sectionTitle = {
  fontFamily: 'Times New Roman, Georgia, serif',
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--gold-dark)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '1rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

export default function InputForm({ onSubmit, loading }) {
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

  const [locality,       setLocality]       = useState('Whitefield');
  const [zone,           setZone]           = useState('residential');
  const [infrastructure, setInfrastructure] = useState('good');
  const [legalDisputes,  setLegalDisputes]  = useState(false);
  const [floodZone,      setFloodZone]      = useState(false);
  const [nearTechPark,   setNearTechPark]   = useState(true);
  const [docFile,        setDocFile]        = useState(null);

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
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Form Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--dark), var(--dark-3))', padding: '1.4rem 1.8rem', borderBottom: '2px solid var(--gold-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="var(--dark)" />
            </div>
            <div>
              <div style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: '1.1rem', color: 'var(--gold-light)', fontWeight: 700 }}>
                Bangalore Property Details
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
                All fields help improve AI accuracy
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.8rem' }}>

          {/* Section 1: Location */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>
              <span style={{ color: 'var(--gold)' }}>01</span> Location & Zone
            </div>
            <div className="grid-3">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Locality *</label>
                <select value={locality} onChange={e => setLocality(e.target.value)}>
                  {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Zone / Land Use *</label>
                <select value={zone} onChange={e => setZone(e.target.value)}>
                  {ZONES.map(z => <option key={z} value={z}>{z.charAt(0).toUpperCase()+z.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Infrastructure Quality *</label>
                <select value={infrastructure} onChange={e => setInfrastructure(e.target.value)}>
                  {INFRA.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase()+i.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Property */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>
              <span style={{ color: 'var(--gold)' }}>02</span> Property Details
            </div>
            <div className="grid-3">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Area (sqft) *</label>
                <input ref={refs.area_sqft} type="number" defaultValue="2400" min="100" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Asking Price (₹) *</label>
                <input ref={refs.asking_price} type="number" defaultValue="18000000" min="0" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Owner Name</label>
                <input ref={refs.owner_name} type="text" defaultValue="Rajesh Kumar" placeholder="Owner name" />
              </div>
            </div>
          </div>

          {/* Section 3: Distances */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>
              <span style={{ color: 'var(--gold)' }}>03</span> Distance Metrics
            </div>
            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>To Highway (km)</label>
                <input ref={refs.distance_highway_km} type="number" defaultValue="5.0" step="0.1" min="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>To City Center (km)</label>
                <input ref={refs.distance_city_center_km} type="number" defaultValue="18.0" step="0.1" min="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>To Metro Station (km)</label>
                <input ref={refs.distance_metro_km} type="number" defaultValue="1.2" step="0.1" min="0" />
              </div>
            </div>
            <div className="grid-3">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>To Water Body (km)</label>
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
          </div>

          {/* Section 4: Risk Flags */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>
              <span style={{ color: 'var(--gold)' }}>04</span> Risk Indicators
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem 1.2rem', background: 'var(--light)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              {[
                [legalDisputes, setLegalDisputes, '⚖️ Legal Disputes'],
                [floodZone,     setFloodZone,     '🌊 Flood Zone'],
                [nearTechPark,  setNearTechPark,  '💻 Near Tech Park / IT Hub'],
              ].map(([val, setter, label]) => (
                <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)', textTransform: 'none', letterSpacing: 0, marginBottom: 0 }}>
                  <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ width: 15, height: 15, accentColor: 'var(--gold-dark)' }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Section 5: Document */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={sectionTitle}>
              <span style={{ color: 'var(--gold)' }}>05</span> Legal Document (Optional)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <input type="file" accept=".txt,.pdf,.png,.jpg"
                onChange={e => setDocFile(e.target.files[0])}
                style={{ flex: 1, minWidth: 200 }} />
              {docFile && (
                <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Upload size={13} /> {docFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '1rem',
            background: loading ? 'rgba(160,120,48,0.5)' : 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light))',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Times New Roman, Georgia, serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--dark)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,0.35)',
            transition: 'all 0.25s',
          }}>
            {loading ? (
              <>
                <span className="spinner" style={{ borderTopColor: 'var(--dark)', borderColor: 'rgba(0,0,0,0.2)' }} />
                Analyzing Property...
              </>
            ) : (
              <>
                <Search size={18} />
                Run AI Analysis
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
