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
    }
    setLoading(false);
  };

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
      </div>
    </div>
  );
}

export default TaskDetails;

