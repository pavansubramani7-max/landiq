import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CITY_COORDS = {
  Hyderabad: [17.385, 78.4867], Bangalore: [12.9716, 77.5946],
  Mumbai: [19.076, 72.8777], Delhi: [28.6139, 77.209],
  Chennai: [13.0827, 80.2707], Pune: [18.5204, 73.8567],
  Kolkata: [22.5726, 88.3639], Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873], Lucknow: [26.8467, 80.9462],
};

export default function MapView({ city, riskLevel }) {
  const coords = CITY_COORDS[city] || [20.5937, 78.9629];
  const color = riskLevel === 'LOW' ? 'green' : riskLevel === 'MEDIUM' ? 'orange' : 'red';

  return (
    <MapContainer center={coords} zoom={11} style={{ height: '280px', borderRadius: '10px' }}
      key={city}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      <Marker position={coords}>
        <Popup>
          <b>{city}</b><br />
          Risk: <span style={{ color }}>{riskLevel}</span>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
