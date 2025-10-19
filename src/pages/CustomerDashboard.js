import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import AddPackageModal from '../components/AddPackageModal';
import AddFamilyMemberModal from '../components/AddFamilyMemberModal';
import PackagesList from '../components/PackagesList';
import SubscriptionCard from '../components/SubscriptionCard';
import '../styles/CustomerDashboard.css';

function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      if (result.success) {
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

  const handlePackageAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleUpgradeSubscription = (packageId) => {
    // Navigate to payment page
    navigate('/payment', { state: { packageId, familyId: user?.familyId } });
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>דשבורד לקוח</h1>
          <p>ברוכים הבאים, {user?.displayName}!</p>
        </div>
        <button onClick={handleLogout} className="button button-danger">
          התנתקות
        </button>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Quick Actions */}
            <div className="card quick-actions">
              <h3>פעולות מהירות</h3>
              <div className="actions-grid">
                <button
                  className="action-button"
                  onClick={() => setShowAddPackageModal(true)}
                >
                  <span className="icon">📦</span>
                  <span>הוסף חבילה</span>
                </button>
                <button
                  className="action-button"
                  onClick={() => setShowAddFamilyModal(true)}
                >
                  <span className="icon">👥</span>
                  <span>הוסף בן משפחה</span>
                </button>
                <button className="action-button" onClick={() => navigate('/service-request')}>
                  <span className="icon">📞</span>
                  <span>קריאת שירות</span>
                </button>
                <button className="action-button" onClick={() => navigate('/track-item')}>
                  <span className="icon">🗺️</span>
                  <span>מסלול פריט</span>
                </button>
              </div>
            </div>

            {/* Packages List */}
            <div className="card">
              <PackagesList key={refreshKey} customerId={user?.uid} familyId={user?.familyId} />
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Subscription Card */}
            <div className="card">
              <SubscriptionCard familyId={user?.familyId} onUpgrade={handleUpgradeSubscription} />
            </div>

            {/* User Info */}
            <div className="card user-info">
              <h3>פרטי החשבון</h3>
              <div className="info-row">
                <span className="label">שם:</span>
                <span className="value">{user?.displayName}</span>
              </div>
              <div className="info-row">
                <span className="label">אימייל:</span>
                <span className="value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="label">טלפון:</span>
                <span className="value">{user?.phoneNumber}</span>
              </div>
              <button className="button button-secondary" onClick={() => navigate('/profile')}>
                ערוך פרופיל
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPackageModal
        isOpen={showAddPackageModal}
        onClose={() => setShowAddPackageModal(false)}
        customerId={user?.uid}
        submittedBy={user?.uid}
        onPackageAdded={handlePackageAdded}
      />

      <AddFamilyMemberModal
        isOpen={showAddFamilyModal}
        onClose={() => setShowAddFamilyModal(false)}
        primaryUserId={user?.uid}
        onMemberAdded={() => {
          // Refresh user data
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}

export default CustomerDashboard;

