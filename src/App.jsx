import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import LandingPage from './pages/LandingPage';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import AdminDashboard from './pages/admin/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';
import Lenis from 'lenis';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-root scroll-container">
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div style={{ visibility: loading ? 'hidden' : 'visible', height: loading ? '100vh' : 'auto', overflow: loading ? 'hidden' : 'unset' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

