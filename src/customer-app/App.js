import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';

function AuthenticatedCustomerRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || userRole !== 'customer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function CustomerApp() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<AuthenticatedCustomerRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default CustomerApp;

