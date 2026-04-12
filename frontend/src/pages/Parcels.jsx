import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Search, X, MapPin } from 'lucide-react';
import { listParcels, createParcel, deleteParcel } from '../utils/api';
import toast from 'react-hot-toast';

const fmtINR = (v) => {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Number(v).toLocaleString()}`;
};

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

export default function Parcels() {
  const navigate = useNavigate();
  const [parcels,   setParcels]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [search,    setSearch]    = useState('');

  // Form selects (need state)
  const [city,         setCity]         = useState('Whitefield');
  const [landType,     setLandType]     = useState('residential');
  const [floodRisk,    setFloodRisk]    = useState('low');
  const [litigations,  setLitigations]  = useState('none');
  const [nearTechPark, setNearTechPark] = useState(false);

  // Form text/number inputs (use refs — no cursor jumping)
  const surveyRef    = useRef(null);
  const districtRef  = useRef(null);
  const pincodeRef   = useRef(null);
  const ownerRef     = useRef(null);
  const areaRef      = useRef(null);
  const priceRef     = useRef(null);
  const ocRef        = useRef(null);
  const yearRef      = useRef(null);
  const hwRef        = useRef(null);
  const metroRef     = useRef(null);

  const load = () => {
    setLoading(true);
    listParcels()
      .then(setParcels)
      .catch(() => toast.error('Failed to load parcels'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createParcel({
        survey_number:       surveyRef.current.value,
        state:               'Karnataka',
        district:            districtRef.current.value || city,
        city,
        pincode:             pincodeRef.current.value,
        land_type:           landType,
        area_sqft:           Number(areaRef.current.value),
        quoted_price:        Number(priceRef.current.value),
        owner_name:          ownerRef.current.value,
        num_ownership_changes: Number(ocRef.current.value || 0),
        last_transfer_year:  yearRef.current.value ? Number(yearRef.current.value) : null,
        dist_highway_km:     hwRef.current.value ? Number(hwRef.current.value) : null,
        dist_metro_km:       metroRef.current.value ? Number(metroRef.current.value) : null,
        near_tech_park:      nearTechPark,
        flood_zone_risk:     floodRisk,
        pending_litigations: litigations,
      });
      toast.success('Parcel created successfully!');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create parcel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this parcel? This cannot be undone.')) return;
    try {
      await deleteParcel(id);
      toast.success('Parcel deleted');
      setParcels(p => p.filter(x => x.id !== id));
    } catch {
      toast.error('Failed to delete parcel');
    }
  };

  const filtered = parcels.filter(p =>
    p.survey_number.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.owner_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Land Parcels</h1>
          <p className="section-sub">{parcels.length} parcels in Bangalore</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Parcel</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card fade-in" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} /> New Parcel
          </h2>
          <form onSubmit={handleCreate}>
            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Survey Number *</label>
                <input ref={surveyRef} type="text" placeholder="e.g. SY-123/4A" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Locality *</label>
                <select value={city} onChange={e => setCity(e.target.value)}>
                  {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>District</label>
                <input ref={districtRef} type="text" defaultValue="Bangalore Urban" />
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Pincode</label>
                <input ref={pincodeRef} type="text" placeholder="560001" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Owner Name *</label>
                <input ref={ownerRef} type="text" placeholder="Full name" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Land Type *</label>
                <select value={landType} onChange={e => setLandType(e.target.value)}>
                  {['residential','commercial','agricultural','industrial'].map(v => (
                    <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Area (sqft) *</label>
                <input ref={areaRef} type="number" placeholder="2400" min="1" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Quoted Price (₹) *</label>
                <input ref={priceRef} type="number" placeholder="18000000" min="0" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Ownership Changes</label>
                <input ref={ocRef} type="number" defaultValue="0" min="0" />
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Last Transfer Year</label>
                <input ref={yearRef} type="number" placeholder="2022" min="1900" max="2100" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Dist. Highway (km)</label>
                <input ref={hwRef} type="number" placeholder="5.0" step="0.1" min="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Dist. Metro (km)</label>
                <input ref={metroRef} type="number" placeholder="1.5" step="0.1" min="0" />
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: '1.2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Flood Zone Risk</label>
                <select value={floodRisk} onChange={e => setFloodRisk(e.target.value)}>
                  {['low','moderate','high'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Pending Litigations</label>
                <select value={litigations} onChange={e => setLitigations(e.target.value)}>
                  {['none','one','multiple','court_review'].map(v => <option key={v} value={v}>{v.replace('_',' ')}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)', marginBottom: 0 }}>
                  <input type="checkbox" checked={nearTechPark} onChange={e => setNearTechPark(e.target.checked)} style={{ width: 16, height: 16 }} />
                  Near Tech Park / IT Hub
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                {saving ? <span className="spinner" /> : <Plus size={16} />}
                {saving ? 'Creating...' : 'Create Parcel'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="search-wrap" style={{ marginBottom: '1rem' }}>
        <Search size={16} className="search-icon" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by survey number, locality, or owner..."
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span className="pulse">Loading parcels...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏗️</div>
            <h3>{search ? 'No results found' : 'No parcels yet'}</h3>
            <p>{search ? 'Try a different search term' : 'Add your first Bangalore land parcel'}</p>
            {!search && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Parcel
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {['Survey No.', 'Locality', 'Zone', 'Area', 'Quoted Price', 'Flood Risk', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/parcels/${p.id}`)}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.survey_number}</td>
                    <td>{p.city}</td>
                    <td>
                      <span className={`badge badge-${p.land_type === 'commercial' ? 'blue' : p.land_type === 'industrial' ? 'medium' : 'low'}`}>
                        {p.land_type}
                      </span>
                    </td>
                    <td>{p.area_sqft?.toLocaleString()} sqft</td>
                    <td style={{ fontWeight: 700 }}>{fmtINR(p.quoted_price)}</td>
                    <td>
                      <span className={`badge badge-${p.flood_zone_risk === 'high' ? 'high' : p.flood_zone_risk === 'moderate' ? 'medium' : 'low'}`}>
                        {p.flood_zone_risk}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/parcels/${p.id}`)}>
                          <Eye size={13} /> View
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={e => handleDelete(p.id, e)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
