import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Parcels from './pages/Parcels';
import ParcelDetail from './pages/ParcelDetail';
import GeoPage from './pages/GeoPage';
import About from './pages/About';
import Admin from './pages/Admin';

import Chatbot from './components/Chatbot';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role === 'user') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/geo" element={<GeoPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/parcels" element={<ProtectedRoute><Parcels /></ProtectedRoute>} />
        <Route path="/parcels/new" element={<ProtectedRoute><Parcels /></ProtectedRoute>} />
        <Route path="/parcels/:id" element={<ProtectedRoute><ParcelDetail /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-sans)', fontSize: '0.88rem', border: '1px solid var(--border)', borderRadius: '6px' } }} />
        <AppRoutes />
        <Chatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}
