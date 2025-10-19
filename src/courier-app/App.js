import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import CourierDashboard from './CourierDashboard';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';

function AuthenticatedCourierRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || userRole !== 'courier') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<CourierDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function CourierApp() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<AuthenticatedCourierRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default CourierApp;

