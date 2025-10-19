import React, { useState } from 'react';
<<<<<<< HEAD
import { addFamilyMember } from '../services/authService';
import '../styles/Modal.css';

function AddFamilyMemberModal({ isOpen, onClose, primaryUserId, onMemberAdded }) {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
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

    // Validation
    if (!formData.displayName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError('כל השדות חובה');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות לא תואמות');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להיות לפחות 6 תווים');
      setLoading(false);
      return;
    }

    try {
      const result = await addFamilyMember(primaryUserId, formData);
      if (result.success) {
        setSuccess('בן משפחה נוסף בהצלחה!');
        setFormData({
          displayName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
        });
        onMemberAdded();
        setTimeout(onClose, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('שגיאה בהוספת בן משפחה: ' + err.message);
    }

=======
import { addFamilyMember } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Modal.css';

function AddFamilyMemberModal({ isOpen, onClose, onFamilyMemberAdded }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!user) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }
    try {
      await addFamilyMember(user.uid, { email });
      onFamilyMemberAdded();
      onClose();
      setEmail('');
    } catch (err) {
      setError('Failed to add family member: ' + err.message);
    }
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
<<<<<<< HEAD
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
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">אישור סיסמה</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'מוסיף...' : 'הוסף בן משפחה'}
          </button>
=======
        <h2>Add Family Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="button button-primary" disabled={loading}>{
              loading ? 'Adding...' : 'Add Member'
            }</button>
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
          </div>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
        </form>
      </div>
    </div>
  );
}

export default AddFamilyMemberModal;

