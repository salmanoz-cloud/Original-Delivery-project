import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { collection, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
=======
import { getAllUsers, suspendUser, activateUser, deleteUserProfile } from '../../services/firestoreService';
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
import '../../styles/admin/CustomerManagement.css';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
=======
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
<<<<<<< HEAD
    setError('');
    try {
      const q = query(collection(db, 'users'), /* Add more sophisticated queries if needed */);
      const querySnapshot = await getDocs(q);
      const customerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(customerList.filter(user => user.role === 'customer'));
    } catch (err) {
      setError('שגיאה בטעינת לקוחות: ' + err.message);
=======
    try {
      const allUsers = await getAllUsers();
      const customerUsers = allUsers.filter(user => user.role === 'customer');
      setCustomers(customerUsers);
    } catch (err) {
      setError('Failed to fetch customers: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    }
    setLoading(false);
  };

<<<<<<< HEAD
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
=======
  const handleSuspend = async (customerId) => {
    try {
      await suspendUser(customerId);
      fetchCustomers();
    } catch (err) {
      setError('Failed to suspend customer: ' + err.message);
    }
  };

  const handleActivate = async (customerId) => {
    try {
      await activateUser(customerId);
      fetchCustomers();
    } catch (err) {
      setError('Failed to activate customer: ' + err.message);
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteUserProfile(customerId);
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
      }
    }
  };

<<<<<<< HEAD
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
=======
  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
  }

  return (
    <div className="customer-management">
<<<<<<< HEAD
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
=======
      <h2>Customer Management</h2>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="customer-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.email}</td>
              <td>{customer.status}</td>
              <td>
                {customer.status === 'active' ? (
                  <button onClick={() => handleSuspend(customer.id)} className="button button-warning">Suspend</button>
                ) : (
                  <button onClick={() => handleActivate(customer.id)} className="button button-success">Activate</button>
                )}
                <button onClick={() => handleDelete(customer.id)} className="button button-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    </div>
  );
}

export default CustomerManagement;
<<<<<<< HEAD

=======
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
