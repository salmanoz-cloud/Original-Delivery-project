import React, { useState } from 'react';
import { addFamilyMember } from '../services/firestoreService'; // Corrected import
import { useAuth } from '../contexts/AuthContext'; // Added for user context
import '../styles/Modal.css';

function AddFamilyMemberModal({ isOpen, onClose, onFamilyMemberAdded }) {
  const { user } = useAuth(); // Get user from context
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.displayName || !formData.phoneNumber) {
      setError('שם מלא ומספר טלפון חובה');
      setLoading(false);
      return;
    }

    try {
      const result = await addFamilyMember(user.uid, { displayName: formData.displayName, phoneNumber: formData.phoneNumber });
      if (result.success) {
        setSuccess('בן משפחה נוסף בהצלחה!');
        setFormData({
          displayName: '',
          phoneNumber: '',
        });
        onFamilyMemberAdded();
        setTimeout(onClose, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('שגיאה בהוספת בן משפחה: ' + err.message);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>הוסף בן משפחה</h2>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">שם מלא</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">מספר טלפון</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'מוסיף...' : 'הוסף בן משפחה'}
          </button>
          <button type="button" className="button button-secondary" onClick={onClose}>ביטול</button>
        </form>
      </div>
    </div>
  );
}

export default AddFamilyMemberModal;

