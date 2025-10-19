import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/courier/TasksList.css';

function TasksList({ courierId, onSelectTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const q = query(
          collection(db, 'packages'),
          where('courierId', '==', courierId),
          where('status', 'in', ['pending', 'in-transit'])
        );
        const querySnapshot = await getDocs(q);
        const fetchedTasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(fetchedTasks);
      } catch (err) {
        setError('שגיאה בטעינת משימות: ' + err.message);
      }
      setLoading(false);
    };

    if (courierId) {
      fetchTasks();
    }
  }, [courierId]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return <div className="loading">טוען משימות...</div>;
  }

  if (error) {
    return <div className="alert alert-error">שגיאה: {error}</div>;
  }

  return (
    <div className="tasks-list-container card">
      <h3>המשימות שלי</h3>
      <div className="filter-controls">
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>בהמתנה</button>
        <button onClick={() => setFilter('in-transit')} className={filter === 'in-transit' ? 'active' : ''}>בדרך</button>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>כל המשימות</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="no-tasks">אין משימות להצגה.</p>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card" onClick={() => onSelectTask(task)}>
              <h4>חבילה ל: {task.receiverName}</h4>
              <p><strong>סטטוס:</strong> {task.status}</p>
              <p><strong>כתובת:</strong> {task.receiverAddress}</p>
              {/* Add more task details as needed */}
=======
import { getCourierTasks, updatePackageStatus } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/courier/TasksList.css';

function TasksList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const courierTasks = await getCourierTasks(user.uid);
      setTasks(courierTasks);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (packageId, newStatus) => {
    try {
      await updatePackageStatus(packageId, newStatus);
      fetchTasks(); // Refresh tasks after update
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tasks-list">
      <h2>My Delivery Tasks</h2>
      {tasks.length === 0 ? (
        <p>No assigned delivery tasks.</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <h3>Tracking: {task.trackingNumber}</h3>
              <p>Description: {task.description}</p>
              <p>Status: <strong>{task.status}</strong></p>
              <p>Customer: {task.customerEmail}</p>
              <p>Address: {task.deliveryAddress || 'N/A'}</p>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
              >
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="exception">Exception</option>
              </select>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TasksList;

