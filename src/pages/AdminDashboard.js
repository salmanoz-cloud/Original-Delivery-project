import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import CustomerManagement from '../components/admin/CustomerManagement';
import CourierManagement from '../components/admin/CourierManagement';
import PackageManagement from '../components/admin/PackageManagement';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      if (result.success && result.data.role === 'admin') {
        setUser(result.data);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>דשבורד ניהול</h1>
          <p>ברוכים הבאים, {user?.displayName}!</p>
        </div>
        <button onClick={handleLogout} className="button button-danger">
          התנתקות
        </button>
      </header>

      <div className="dashboard-container">
        <nav className="admin-nav">
          <button
            className={`nav-button ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            👥 לקוחות
          </button>
          <button
            className={`nav-button ${activeTab === 'couriers' ? 'active' : ''}`}
            onClick={() => setActiveTab('couriers')}
          >
            🚚 שליחים
          </button>
          <button
            className={`nav-button ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            📦 חבילות
          </button>
        </nav>

        <div className="dashboard-content">
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'couriers' && <CourierManagement />}
          {activeTab === 'packages' && <PackageManagement />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

