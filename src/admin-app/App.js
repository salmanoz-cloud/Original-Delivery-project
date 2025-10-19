import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';

function AuthenticatedAdminRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function AdminApp() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<AuthenticatedAdminRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AdminApp;

