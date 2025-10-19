import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomerManagement from '../components/admin/CustomerManagement';
import CourierManagement from '../components/admin/CourierManagement';
import PackageManagement from '../components/admin/PackageManagement';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      navigate('/login');
    }
  }, [user, userRole, loading, navigate]);

  const handleLogout = async () => {
    // Implement logout logic here if needed, though typically handled in AuthContext or main App
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Welcome, {user?.email} (Admin)</h1>
      <button onClick={handleLogout}>Logout</button>

      <nav className="admin-nav">
        <button onClick={() => setActiveTab('customers')}>Customer Management</button>
        <button onClick={() => setActiveTab('couriers')}>Courier Management</button>
        <button onClick={() => setActiveTab('packages')}>Package Management</button>
      </nav>

      <div className="admin-content">
        {activeTab === 'customers' && <CustomerManagement />}
        {activeTab === 'couriers' && <CourierManagement />}
        {activeTab === 'packages' && <PackageManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;

