import React, { useState, useEffect } from 'react';
import { getSubscriptionByFamilyId, getServicePackages } from '../services/firestoreService';
import '../styles/SubscriptionCard.css';

function SubscriptionCard({ familyId, onUpgrade }) {
  const [subscription, setSubscription] = useState(null);
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const subResult = await getSubscriptionByFamilyId(familyId);
        if (subResult.success) {
          setSubscription(subResult.data);
        }

        const spResult = await getServicePackages();
        if (spResult.success) {
          setServicePackages(spResult.data.sort((a, b) => a.packageCount - b.packageCount));
        }
      } catch (err) {
        setError('שגיאה בטעינת נתוני מנוי: ' + err.message);
      }
      setLoading(false);
    };

    if (familyId) {
      fetchData();
    }
  }, [familyId]);

  if (loading) {
    return <div className="loading">טוען מנוי...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
  }

  const currentPackage = subscription ? servicePackages.find(sp => sp.id === subscription.servicePackageId) : null;
  const remainingPackages = subscription ? (currentPackage ? currentPackage.packageCount - subscription.packagesUsed : 0) : 0;

  return (
    <div className="subscription-card card">
      <h3>המנוי שלי</h3>
      {subscription ? (
        <div className="subscription-details">
          <p><strong>חבילה נוכחית:</strong> {currentPackage?.name || 'לא ידוע'}</p>
          <p><strong>חבילות שנוצלו החודש:</strong> {subscription.packagesUsed}</p>
          <p><strong>חבילות שנותרו:</strong> {remainingPackages}</p>
          <p><strong>תאריך חידוש:</strong> {new Date(subscription.renewalDate.seconds * 1000).toLocaleDateString()}</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${(subscription.packagesUsed / currentPackage?.packageCount) * 100 || 0}%` }}
            ></div>
          </div>
          <p className="progress-text">{subscription.packagesUsed} מתוך {currentPackage?.packageCount || 0} חבילות נוצלו</p>
        </div>
      ) : (
        <p>אין לך מנוי פעיל כרגע. בחר חבילה כדי להתחיל!</p>
      )}

      <div className="service-packages-list">
        <h4>בחר חבילה:</h4>
        {servicePackages.map((sp) => (
          <div key={sp.id} className={`service-package-option ${subscription?.servicePackageId === sp.id ? 'active' : ''}`}>
            <span>{sp.name} ({sp.packageCount} חבילות) - {sp.price} ש"ח</span>
            <button
              className="button button-primary"
              onClick={() => onUpgrade(sp.id)}
              disabled={subscription?.servicePackageId === sp.id}
            >
              {subscription?.servicePackageId === sp.id ? 'נוכחי' : 'בחר'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionCard;

