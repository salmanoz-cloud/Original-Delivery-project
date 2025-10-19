import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import for creating auth user
import { auth } from '../../firebaseConfig'; // Import auth instance
import '../../styles/admin/CourierManagement.css';

function CourierManagement() {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCourier, setNewCourier] = useState({
    displayName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const courierList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCouriers(courierList.filter(user => user.role === 'courier'));
    } catch (err) {
      setError('שגיאה בטעינת שליחים: ' + err.message);
    }
    setLoading(false);
  };

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
      }
    }
  };

  const filteredCouriers = couriers.filter(courier =>
    courier.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">טוען שליחים...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
  }

  return (
    <div className="courier-management">
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
    </div>
  );
}

export default CourierManagement;

