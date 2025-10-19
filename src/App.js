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
    </Router>
  );
}

export default App;

