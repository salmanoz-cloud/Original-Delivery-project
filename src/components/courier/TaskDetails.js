<<<<<<< HEAD
import React, { useState } from 'react';
import { updatePackageStatus } from '../../services/firestoreService';
import '../../styles/courier/TaskDetails.css';

function TaskDetails({ task, onClose, onTaskUpdated }) {
  const [newStatus, setNewStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStatusChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updatePackageStatus(task.id, newStatus);
      if (result.success) {
        setSuccess('סטטוס החבילה עודכן בהצלחה!');
        onTaskUpdated(); // Notify parent to refresh tasks
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('שגיאה בעדכון סטטוס: ' + err.message);
=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageDetails, updatePackageStatus } from '../../services/firestoreService';
import '../../styles/courier/TaskDetails.css';

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const details = await getPackageDetails(id);
      setTask(details);
    } catch (err) {
      setError('Failed to fetch task details: ' + err.message);
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const handleCallCustomer = () => {
    // In a real app, this would initiate a phone call
    alert(`מתקשר ללקוח: ${task.receiverName} (${task.receiverPhoneNumber || 'לא זמין'})`);
  };

  const handleWhatsAppCustomer = () => {
    // In a real app, this would open WhatsApp chat
    alert(`פותח וואטסאפ ללקוח: ${task.receiverName} (${task.receiverPhoneNumber || 'לא זמין'})`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-details-modal">
        <h2>פרטי משימה: חבילה ל{task.receiverName}</h2>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="task-details-info">
          <p><strong>סטטוס:</strong> {task.status}</p>
          <p><strong>נמען:</strong> {task.receiverName}</p>
          <p><strong>כתובת:</strong> {task.receiverAddress}</p>
          <p><strong>שולח:</strong> {task.senderName || 'לא ידוע'}</p>
          <p><strong>כתובת שולח:</strong> {task.senderAddress || 'לא ידוע'}</p>
          <p><strong>הוראות:</strong> {task.deliveryInstructions || 'אין'}</p>
          <p><strong>תאריך יצירה:</strong> {new Date(task.submissionDate.seconds * 1000).toLocaleDateString()}</p>
        </div>

        <div className="task-actions">
          <button className="button button-primary" onClick={handleCallCustomer}>התקשר ללקוח</button>
          <button className="button button-secondary" onClick={handleWhatsAppCustomer}>שלח WhatsApp</button>
        </div>

        <form onSubmit={handleStatusChange} className="status-update-form">
          <div className="form-group">
            <label htmlFor="newStatus">עדכן סטטוס:</label>
            <select
              id="newStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">בהמתנה</option>
              <option value="in-transit">בדרך</option>
              <option value="delivered">נמסרה</option>
              <option value="cancelled">בוטלה</option>
            </select>
          </div>
          <button type="submit" className="button button-primary" disabled={loading}>עדכן</button>
        </form>
=======
  const handleStatusChange = async (newStatus) => {
    try {
      await updatePackageStatus(id, newStatus);
      fetchTaskDetails(); // Refresh details after update
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!task) {
    return <div>Task not found.</div>;
  }

  return (
    <div className="task-details-container">
      <h2>Task Details: {task.trackingNumber}</h2>
      <div className="task-details-card">
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Current Status:</strong> {task.status}</p>
        <p><strong>Customer Email:</strong> {task.customerEmail}</p>
        <p><strong>Delivery Address:</strong> {task.deliveryAddress || 'N/A'}</p>
        <div className="status-update">
          <label htmlFor="status-select">Update Status:</label>
          <select
            id="status-select"
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="exception">Exception</option>
          </select>
        </div>
        <button onClick={() => navigate(-1)} className="button button-secondary mt-20">
          Back to Tasks
        </button>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
      </div>
    </div>
  );
}

export default TaskDetails;

