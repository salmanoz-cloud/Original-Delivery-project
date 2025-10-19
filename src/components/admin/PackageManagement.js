import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
=======
import { getAllPackages, updatePackageStatus, assignPackageToCourier, getAllUsers } from '../../services/firestoreService';
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
import '../../styles/admin/PackageManagement.css';

function PackageManagement() {
  const [packages, setPackages] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [couriers, setCouriers] = useState([]);
=======
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
<<<<<<< HEAD
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
=======
    try {
      const allPackages = await getAllPackages();
      setPackages(allPackages);

      const allUsers = await getAllUsers();
      const courierUsers = allUsers.filter(user => user.role === 'courier');
      setCouriers(courierUsers);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const handleStatusChange = async (packageId, newStatus) => {
    try {
      await updateDoc(doc(db, 'packages', packageId), { status: newStatus, updatedAt: new Date() });
      fetchData(); // Refresh the list
    } catch (err) {
      setError('שגיאה בעדכון סטטוס חבילה: ' + err.message);
=======
  const handleUpdateStatus = async (packageId, newStatus) => {
    try {
      await updatePackageStatus(packageId, newStatus);
      fetchData();
    } catch (err) {
      setError('Failed to update package status: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    }
  };

  const handleAssignCourier = async (packageId, courierId) => {
    try {
<<<<<<< HEAD
      await updateDoc(doc(db, 'packages', packageId), { courierId: courierId, updatedAt: new Date() });
      fetchData(); // Refresh the list
    } catch (err) {
      setError('שגיאה בהקצאת שליח: ' + err.message);
=======
      await assignPackageToCourier(packageId, courierId);
      fetchData();
    } catch (err) {
      setError('Failed to assign courier: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    }
  };

  const filteredPackages = packages.filter(pkg => {
<<<<<<< HEAD
    const matchesSearch = pkg.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.receiverAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.senderAddress.toLowerCase().includes(searchTerm.toLowerCase());
=======
    const matchesSearch = pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
<<<<<<< HEAD
    return <div className="loading">טוען חבילות...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
=======
    return <div>Loading packages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
  }

  return (
    <div className="package-management">
<<<<<<< HEAD
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
=======
      <h2>Package Management</h2>
      <input
        type="text"
        placeholder="Search by tracking number or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus} className="status-filter">
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-transit">In Transit</option>
        <option value="delivered">Delivered</option>
        <option value="exception">Exception</option>
      </select>
      <table className="package-table">
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned Courier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPackages.map(pkg => (
            <tr key={pkg.id}>
              <td>{pkg.trackingNumber}</td>
              <td>{pkg.description}</td>
              <td>{pkg.status}</td>
              <td>
                <select
                  value={pkg.assignedCourier || ''}
                  onChange={(e) => handleAssignCourier(pkg.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {couriers.map(courier => (
                    <option key={courier.id} value={courier.id}>
                      {courier.email}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={pkg.status}
                  onChange={(e) => handleUpdateStatus(pkg.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="exception">Exception</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    </div>
  );
}

export default PackageManagement;

