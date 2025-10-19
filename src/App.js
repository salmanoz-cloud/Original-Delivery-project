<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Customer App
import CustomerDashboard from './pages/CustomerDashboard';

// Admin App
import AdminDashboard from './pages/AdminDashboard';
import CourierDashboard from './pages/CourierDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Get user role from custom claims or default to 'customer'
        try {
          // Force refresh to get updated custom claims
          const idTokenResult = await currentUser.getIdTokenResult(true);
          setUserRole(idTokenResult.claims.role || 'customer');
        } catch (error) {
          console.log('Error getting user role:', error);
          setUserRole('customer');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Customer App Routes */}
        <Route
          path="/customers/*"
          element={user && userRole === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />}
        />

        {/* Admin App Routes */}
        <Route
          path="/admin/*"
          element={user && (userRole === 'admin' || userRole === 'courier') ? (
            userRole === 'admin' ? <AdminDashboard /> : <CourierDashboard />
          ) : (
            <Navigate to="/login" />
          )}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            user ? (
              userRole === 'admin' ? (
                <Navigate to="/admin" />
              ) : userRole === 'courier' ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/customers" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
=======
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
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default CustomerApp;
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)

