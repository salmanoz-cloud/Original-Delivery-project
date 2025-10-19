import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import for creating auth user
import { auth } from '../../firebaseConfig'; // Import auth instance
=======
import { getAllUsers, suspendUser, activateUser, deleteUserProfile } from '../../services/firestoreService';
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
import '../../styles/admin/CourierManagement.css';

function CourierManagement() {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCourier, setNewCourier] = useState({
    displayName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
=======
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    setLoading(true);
<<<<<<< HEAD
    setError('');
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const courierList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCouriers(courierList.filter(user => user.role === 'courier'));
    } catch (err) {
      setError('שגיאה בטעינת שליחים: ' + err.message);
=======
    try {
      const allUsers = await getAllUsers();
      const courierUsers = allUsers.filter(user => user.role === 'courier');
      setCouriers(courierUsers);
    } catch (err) {
      setError('Failed to fetch couriers: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const handleNewCourierChange = (e) => {
    const { name, value } = e.target;
    setNewCourier(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourier = async (e) => {
    e.preventDefault();
    setError('');
    if (!newCourier.displayName || !newCourier.email || !newCourier.password || !newCourier.phoneNumber) {
      setError('כל השדות נדרשים עבור שליח חדש.');
      return;
    }

    try {
      // 1. Create Firebase Authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, newCourier.email, newCourier.password);
      const user = userCredential.user;

      // 2. Create Firestore user document with 'courier' role
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        displayName: newCourier.displayName,
        email: newCourier.email,
        phoneNumber: newCourier.phoneNumber,
        role: 'courier',
        createdAt: new Date(),
        status: 'active',
      });

      setNewCourier({ displayName: '', email: '', password: '', phoneNumber: '' });
      fetchCouriers(); // Refresh the list
    } catch (err) {
      setError('שגיאה בהוספת שליח: ' + err.message);
    }
  };

  const handleStatusChange = async (courierId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', courierId), { status: newStatus });
      fetchCouriers(); // Refresh the list
    } catch (err) {
      setError('שגיאה בעדכון סטטוס שליח: ' + err.message);
    }
  };

  const handleDeleteCourier = async (courierId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק שליח זה? פעולה זו אינה הפיכה.')) {
      try {
        // Note: Deleting a user from Firestore does not delete them from Firebase Auth.
        // A Cloud Function would be needed to keep them in sync or handle Auth deletion.
        await deleteDoc(doc(db, 'users', courierId));
        fetchCouriers(); // Refresh the list
      } catch (err) {
        setError('שגיאה במחיקת שליח: ' + err.message);
=======
  const handleSuspend = async (courierId) => {
    try {
      await suspendUser(courierId);
      fetchCouriers();
    } catch (err) {
      setError('Failed to suspend courier: ' + err.message);
    }
  };

  const handleActivate = async (courierId) => {
    try {
      await activateUser(courierId);
      fetchCouriers();
    } catch (err) {
      setError('Failed to activate courier: ' + err.message);
    }
  };

  const handleDelete = async (courierId) => {
    if (window.confirm('Are you sure you want to delete this courier?')) {
      try {
        await deleteUserProfile(courierId);
        fetchCouriers();
      } catch (err) {
        setError('Failed to delete courier: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
      }
    }
  };

  const filteredCouriers = couriers.filter(courier =>
<<<<<<< HEAD
    courier.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
=======
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    courier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
<<<<<<< HEAD
    return <div className="loading">טוען שליחים...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
=======
    return <div>Loading couriers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
  }

  return (
    <div className="courier-management">
<<<<<<< HEAD
      <h3>ניהול שליחים</h3>
      <div className="controls">
        <input
          type="text"
          placeholder="חפש שליח לפי שם או אימייל..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="add-courier-form card">
        <h4>הוסף שליח חדש</h4>
        <form onSubmit={handleAddCourier}>
          <div className="form-group">
            <label htmlFor="newCourierDisplayName">שם מלא</label>
            <input
              type="text"
              id="newCourierDisplayName"
              name="displayName"
              value={newCourier.displayName}
              onChange={handleNewCourierChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newCourierEmail">אימייל</label>
            <input
              type="email"
              id="newCourierEmail"
              name="email"
              value={newCourier.email}
              onChange={handleNewCourierChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newCourierPassword">סיסמה</label>
            <input
              type="password"
              id="newCourierPassword"
              name="password"
              value={newCourier.password}
              onChange={handleNewCourierChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newCourierPhoneNumber">מספר טלפון</label>
            <input
              type="tel"
              id="newCourierPhoneNumber"
              name="phoneNumber"
              value={newCourier.phoneNumber}
              onChange={handleNewCourierChange}
              required
            />
          </div>
          <button type="submit" className="button button-primary">הוסף שליח</button>
        </form>
      </div>

      {filteredCouriers.length === 0 ? (
        <p>לא נמצאו שליחים.</p>
      ) : (
        <div className="courier-list">
          {filteredCouriers.map(courier => (
            <div key={courier.id} className="courier-item card">
              <p><strong>שם:</strong> {courier.displayName}</p>
              <p><strong>אימייל:</strong> {courier.email}</p>
              <p><strong>טלפון:</strong> {courier.phoneNumber}</p>
              <p><strong>סטטוס:</strong> {courier.status === 'active' ? 'פעיל' : 'מושהה'}</p>
              <div className="actions">
                {courier.status === 'active' ? (
                  <button className="button button-secondary" onClick={() => handleStatusChange(courier.id, 'suspended')}>השהה</button>
                ) : (
                  <button className="button button-primary" onClick={() => handleStatusChange(courier.id, 'active')}>הפעל</button>
                )}
                <button className="button button-danger" onClick={() => handleDeleteCourier(courier.id)}>מחק</button>
              </div>
            </div>
          ))}
        </div>
      )}
=======
      <h2>Courier Management</h2>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="courier-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCouriers.map(courier => (
            <tr key={courier.id}>
              <td>{courier.email}</td>
              <td>{courier.status}</td>
              <td>
                {courier.status === 'active' ? (
                  <button onClick={() => handleSuspend(courier.id)} className="button button-warning">Suspend</button>
                ) : (
                  <button onClick={() => handleActivate(courier.id)} className="button button-success">Activate</button>
                )}
                <button onClick={() => handleDelete(courier.id)} className="button button-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    </div>
  );
}

export default CourierManagement;
<<<<<<< HEAD

=======
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
