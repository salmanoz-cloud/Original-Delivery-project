import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/admin/CustomerManagement.css';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'users'), /* Add more sophisticated queries if needed */);
      const querySnapshot = await getDocs(q);
      const customerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(customerList.filter(user => user.role === 'customer'));
    } catch (err) {
      setError('שגיאה בטעינת לקוחות: ' + err.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', customerId), { status: newStatus });
      fetchCustomers(); // Refresh the list
    } catch (err) {
      setError('שגיאה בעדכון סטטוס לקוח: ' + err.message);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק לקוח זה?')) {
      try {
        await deleteDoc(doc(db, 'users', customerId));
        fetchCustomers(); // Refresh the list
      } catch (err) {
        setError('שגיאה במחיקת לקוח: ' + err.message);
      }
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">טוען לקוחות...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
  }

  return (
    <div className="customer-management">
      <h3>ניהול לקוחות</h3>
      <div className="controls">
        <input
          type="text"
          placeholder="חפש לקוח לפי שם או אימייל..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">כל הלקוחות</option>
          <option value="active">פעילים</option>
          <option value="suspended">מושהים</option>
        </select>
      </div>

      {filteredCustomers.length === 0 ? (
        <p>לא נמצאו לקוחות.</p>
      ) : (
        <div className="customer-list">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-item card">
              <p><strong>שם:</strong> {customer.displayName}</p>
              <p><strong>אימייל:</strong> {customer.email}</p>
              <p><strong>טלפון:</strong> {customer.phoneNumber}</p>
              <p><strong>סטטוס:</strong> {customer.status === 'active' ? 'פעיל' : 'מושהה'}</p>
              <div className="actions">
                {customer.status === 'active' ? (
                  <button className="button button-secondary" onClick={() => handleStatusChange(customer.id, 'suspended')}>השהה</button>
                ) : (
                  <button className="button button-primary" onClick={() => handleStatusChange(customer.id, 'active')}>הפעל</button>
                )}
                <button className="button button-danger" onClick={() => handleDeleteCustomer(customer.id)}>מחק</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;

