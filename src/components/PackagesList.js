<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { getPackages } from '../services/firestoreService';
import '../styles/PackagesList.css';

function PackagesList({ customerId, familyId }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError('');
      const result = await getPackages(customerId, familyId);
      if (result.success) {
        setPackages(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchPackages();
  }, [customerId, familyId]);

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') return true;
    return pkg.status === filter;
  });

  if (loading) {
    return <div className="loading">טוען חבילות...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
  }

  return (
    <div className="packages-list-container card">
      <h3>החבילות שלי</h3>
      <div className="filter-controls">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>כל החבילות</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>בהמתנה</button>
        <button onClick={() => setFilter('in-transit')} className={filter === 'in-transit' ? 'active' : ''}>בדרך</button>
        <button onClick={() => setFilter('delivered')} className={filter === 'delivered' ? 'active' : ''}>נמסרו</button>
      </div>

      {filteredPackages.length === 0 ? (
        <p className="no-packages">אין חבילות להצגה.</p>
      ) : (
        <div className="packages-grid">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <h4>חבילה ל: {pkg.receiverName}</h4>
              <p><strong>סטטוס:</strong> {pkg.status}</p>
              <p><strong>כתובת:</strong> {pkg.receiverAddress}</p>
              <p><strong>תאריך שליחה:</strong> {new Date(pkg.submissionDate.seconds * 1000).toLocaleDateString()}</p>
              {/* Add more package details as needed */}
=======
import React from 'react';
import '../styles/PackagesList.css';

function PackagesList({ packages, onUpdateStatus }) {
  return (
    <div className="packages-list">
      <h2>My Packages</h2>
      {packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <div className="packages-grid">
          {packages.map(pkg => (
            <div key={pkg.id} className="package-card">
              <h3>{pkg.trackingNumber}</h3>
              <p>Description: {pkg.description}</p>
              <p>Status: <strong>{pkg.status}</strong></p>
              {/* Add more package details as needed */}
              {onUpdateStatus && (
                <select
                  value={pkg.status}
                  onChange={(e) => onUpdateStatus(pkg.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="exception">Exception</option>
                </select>
              )}
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PackagesList;

