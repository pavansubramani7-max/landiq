import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LOCALITIES = [
  // [name, lat, lng, growth%, avg_price_sqft, zone, risk]
  { name: 'Koramangala',      coords: [12.9352, 77.6245], growth: '11%', price: 18000, zone: 'commercial',   risk: 'low' },
  { name: 'Indiranagar',      coords: [12.9784, 77.6408], growth: '11%', price: 12000, zone: 'residential',  risk: 'low' },
  { name: 'Whitefield',       coords: [12.9698, 77.7500], growth: '14%', price: 8500,  zone: 'commercial',   risk: 'low' },
  { name: 'Marathahalli',     coords: [12.9591, 77.6974], growth: '13%', price: 9000,  zone: 'commercial',   risk: 'low' },
  { name: 'HSR Layout',       coords: [12.9116, 77.6389], growth: '12%', price: 10500, zone: 'residential',  risk: 'low' },
  { name: 'JP Nagar',         coords: [12.9077, 77.5857], growth: '11%', price: 9500,  zone: 'residential',  risk: 'low' },
  { name: 'Jayanagar',        coords: [12.9308, 77.5838], growth: '10%', price: 11000, zone: 'residential',  risk: 'low' },
  { name: 'Hebbal',           coords: [13.0358, 77.5970], growth: '14%', price: 9500,  zone: 'residential',  risk: 'medium' },
  { name: 'Electronic City',  coords: [12.8399, 77.6770], growth: '12%', price: 5500,  zone: 'industrial',   risk: 'low' },
  { name: 'Sarjapur Road',    coords: [12.9010, 77.6850], growth: '15%', price: 7500,  zone: 'residential',  risk: 'medium' },
  { name: 'Bellandur',        coords: [12.9257, 77.6760], growth: '13%', price: 8000,  zone: 'residential',  risk: 'high' },
  { name: 'Malleshwaram',     coords: [13.0035, 77.5710], growth: '10%', price: 11500, zone: 'residential',  risk: 'low' },
  { name: 'Rajajinagar',      coords: [12.9915, 77.5530], growth: '10%', price: 9000,  zone: 'residential',  risk: 'low' },
  { name: 'Yelahanka',        coords: [13.1007, 77.5963], growth: '13%', price: 6500,  zone: 'residential',  risk: 'low' },
  { name: 'Devanahalli',      coords: [13.2468, 77.7143], growth: '16%', price: 3200,  zone: 'agricultural', risk: 'low' },
  { name: 'BTM Layout',       coords: [12.9166, 77.6101], growth: '11%', price: 9000,  zone: 'residential',  risk: 'low' },
  { name: 'Banashankari',     coords: [12.9255, 77.5468], growth: '10%', price: 8500,  zone: 'residential',  risk: 'low' },
  { name: 'Yeshwanthpur',     coords: [13.0218, 77.5391], growth: '11%', price: 8000,  zone: 'commercial',   risk: 'low' },
  { name: 'KR Puram',         coords: [13.0050, 77.6960], growth: '12%', price: 6200,  zone: 'residential',  risk: 'medium' },
  { name: 'Kanakapura Road',  coords: [12.8700, 77.5600], growth: '13%', price: 6000,  zone: 'residential',  risk: 'low' },
  { name: 'Bannerghatta Road',coords: [12.8900, 77.5970], growth: '12%', price: 7000,  zone: 'residential',  risk: 'low' },
  { name: 'Peenya',           coords: [13.0290, 77.5190], growth: '8%',  price: 4500,  zone: 'industrial',   risk: 'low' },
  { name: 'Varthur',          coords: [12.9394, 77.7530], growth: '11%', price: 5500,  zone: 'residential',  risk: 'high' },
  { name: 'Hoskote',          coords: [13.0700, 77.7980], growth: '10%', price: 2800,  zone: 'agricultural', risk: 'low' },
  { name: 'Thanisandra',      coords: [13.0530, 77.6380], growth: '13%', price: 7200,  zone: 'residential',  risk: 'medium' },
];

const RISK_COLOR = { low: '#2ecc71', medium: '#f39c12', high: '#e74c3c' };
const ZONE_BADGE = { residential: '#ebf4ff', commercial: '#fff3cd', agricultural: '#d4edda', industrial: '#f8d7da' };

const fmtINR = (v) => v >= 1e5 ? `₹${(v / 1e5).toFixed(1)}L` : `₹${v.toLocaleString()}`;

export default function GeoPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('all');

  const filtered = filter === 'all' ? LOCALITIES : LOCALITIES.filter(l => l.zone === filter);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800 }}>
            🗺️ Bangalore Land Market Map
          </h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Real locality data — 2024 market prices & growth rates</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['all', 'residential', 'commercial', 'agricultural', 'industrial'].map(z => (
            <button key={z} onClick={() => setFilter(z)}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                background: filter === z ? 'var(--primary)' : '#e2e8f0',
                color: filter === z ? '#fff' : '#4a5568',
              }}>
              {z.charAt(0).toUpperCase() + z.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.2rem' }}>
        <MapContainer center={[12.9716, 77.5946]} zoom={11} style={{ height: '480px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          {filtered.map(loc => (
            <React.Fragment key={loc.name}>
              <Circle
                center={loc.coords}
                radius={800}
                pathOptions={{ color: RISK_COLOR[loc.risk], fillColor: RISK_COLOR[loc.risk], fillOpacity: 0.18, weight: 1 }}
              />
              <Marker position={loc.coords} eventHandlers={{ click: () => setSelected(loc) }}>
                <Popup>
                  <div style={{ minWidth: '160px' }}>
                    <b style={{ color: '#1a3c5e', fontSize: '1rem' }}>{loc.name}</b>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                      <div>💰 Avg: <b>₹{loc.price.toLocaleString()}/sqft</b></div>
                      <div>📈 Growth: <b style={{ color: '#2ecc71' }}>{loc.growth}/yr</b></div>
                      <div>🏷️ Zone: <b>{loc.zone}</b></div>
                      <div>⚠️ Risk: <b style={{ color: RISK_COLOR[loc.risk] }}>{loc.risk.toUpperCase()}</b></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* Selected locality detail */}
      {selected && (
        <div className="card" style={{ marginBottom: '1.2rem', borderLeft: `4px solid ${RISK_COLOR[selected.risk]}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 800 }}>{selected.name}</h2>
              <p style={{ color: '#718096', fontSize: '0.9rem' }}>Bangalore, Karnataka</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: '1.2rem' }}>✕</button>
          </div>
          <div className="grid-4" style={{ marginTop: '1rem' }}>
            {[
              ['Avg Price/sqft', `₹${selected.price.toLocaleString()}`],
              ['Annual Growth', selected.growth],
              ['Zone', selected.zone],
              ['Flood Risk', selected.risk.toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center', padding: '0.8rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0', fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginTop: '0.3rem' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locality Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
        {filtered.map(loc => (
          <div key={loc.name} className="card"
            onClick={() => setSelected(loc)}
            style={{
              padding: '0.9rem 1rem', cursor: 'pointer',
              border: `2px solid ${selected?.name === loc.name ? 'var(--primary)' : 'transparent'}`,
              transition: 'all 0.2s'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>{loc.name}</div>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px',
                background: ZONE_BADGE[loc.zone], color: '#4a5568', fontWeight: 600 }}>
                {loc.zone.slice(0, 4)}
              </span>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ color: '#718096' }}>₹{loc.price.toLocaleString()}<span style={{ fontSize: '0.75rem' }}>/sqft</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                <span style={{ color: '#2ecc71', fontWeight: 700 }}>↑ {loc.growth}</span>
                <span style={{ color: RISK_COLOR[loc.risk], fontWeight: 600, fontSize: '0.78rem' }}>
                  {loc.risk.toUpperCase()} RISK
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="card" style={{ marginTop: '1.2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>Map Legend:</span>
        {Object.entries(RISK_COLOR).map(([level, color]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: color }} />
            <span style={{ color: '#4a5568', textTransform: 'capitalize' }}>{level} Risk Zone</span>
          </div>
        ))}
      </div>
    </div>
  );
}
