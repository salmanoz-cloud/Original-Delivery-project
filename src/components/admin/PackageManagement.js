import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/admin/PackageManagement.css';

function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch packages
      const packagesQuery = query(collection(db, 'packages'));
      const packagesSnapshot = await getDocs(packagesQuery);
      const packagesList = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPackages(packagesList);

      // Fetch couriers for assignment
      const couriersQuery = query(collection(db, 'users'), where('role', '==', 'courier'));
      const couriersSnapshot = await getDocs(couriersQuery);
      const couriersList = couriersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCouriers(couriersList);

    } catch (err) {
      setError('שגיאה בטעינת נתונים: ' + err.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (packageId, newStatus) => {
    try {
      await updateDoc(doc(db, 'packages', packageId), { status: newStatus, updatedAt: new Date() });
      fetchData(); // Refresh the list
    } catch (err) {
      setError('שגיאה בעדכון סטטוס חבילה: ' + err.message);
    }
  };

  const handleAssignCourier = async (packageId, courierId) => {
    try {
      await updateDoc(doc(db, 'packages', packageId), { courierId: courierId, updatedAt: new Date() });
      fetchData(); // Refresh the list
    } catch (err) {
      setError('שגיאה בהקצאת שליח: ' + err.message);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.receiverAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.senderAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">טוען חבילות...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
  }

  return (
    <div className="package-management">
      <h3>ניהול חבילות</h3>
      <div className="controls">
        <input
          type="text"
          placeholder="חפש חבילה לפי שם/כתובת שולח/מקבל..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">כל החבילות</option>
          <option value="pending">בהמתנה</option>
          <option value="in-transit">בדרך</option>
          <option value="delivered">נמסרו</option>
          <option value="cancelled">בוטלו</option>
        </select>
      </div>

      {filteredPackages.length === 0 ? (
        <p>לא נמצאו חבילות.</p>
      ) : (
        <div className="package-list">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="package-item card">
              <h4>חבילה ל: {pkg.receiverName}</h4>
              <p><strong>סטטוס:</strong> {pkg.status}</p>
              <p><strong>כתובת מקבל:</strong> {pkg.receiverAddress}</p>
              <p><strong>שליח:</strong> {couriers.find(c => c.uid === pkg.courierId)?.displayName || 'לא הוקצה'}</p>
              <div className="actions">
                <select
                  value={pkg.status}
                  onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
                >
                  <option value="pending">בהמתנה</option>
                  <option value="in-transit">בדרך</option>
                  <option value="delivered">נמסרו</option>
                  <option value="cancelled">בוטלו</option>
                </select>
                <select
                  value={pkg.courierId || ''}
                  onChange={(e) => handleAssignCourier(pkg.id, e.target.value)}
                >
                  <option value="">הקצה שליח</option>
                  {couriers.map(courier => (
                    <option key={courier.uid} value={courier.uid}>{courier.displayName}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PackageManagement;

