import React, { useState } from 'react';
import { addPackage } from '../services/firestoreService';
<<<<<<< HEAD
import { getCurrentUser } from '../services/authService';
import '../styles/Modal.css';

function AddPackageModal({ isOpen, onClose, customerId, submittedBy, onPackageAdded }) {
  const [packageDetails, setPackageDetails] = useState('');
  const [extractionMethod, setExtractionMethod] = useState('manual');
  const [manualDetails, setManualDetails] = useState({
    senderName: '',
    senderAddress: '',
    receiverName: '',
    receiverAddress: '',
    size: '',
    weight: '',
    deliveryInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let packageData = {};

    if (extractionMethod === 'manual') {
      if (!manualDetails.receiverName || !manualDetails.receiverAddress) {
        setError('שם ומען המקבל הם שדות חובה.');
        setLoading(false);
        return;
      }
      packageData = manualDetails;
    } else if (extractionMethod === 'text' || extractionMethod === 'whatsapp') {
      // This would typically involve a Cloud Function call to Gemini AI
      // For now, we'll simulate it or require manual entry after extraction
      setError('כרגע ניתן להזין פרטים ידנית בלבד. פונקציית החילוץ האוטומטי תתווסף בקרוב.');
      setLoading(false);
      return;
    } else if (extractionMethod === 'image') {
      setError('כרגע ניתן להזין פרטים ידנית בלבד. פונקציית חילוץ התמונה תתווסף בקרוב.');
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser.success) {
        setError('שגיאת אימות. אנא התחבר שוב.');
        setLoading(false);
        return;
      }

      const finalPackageData = {
        ...packageData,
        customerId: customerId, // The user who initiated the package
        submittedBy: submittedBy, // The actual user who submitted the form (could be family member)
        familyId: currentUser.data.familyId, // Link to the family subscription
        status: 'pending',
        submissionDate: new Date(),
      };

      const result = await addPackage(finalPackageData);
      if (result.success) {
        setSuccess('החבילה נוספה בהצלחה!');
        setPackageDetails('');
        setManualDetails({
          senderName: '', senderAddress: '', receiverName: '', receiverAddress: '',
          size: '', weight: '', deliveryInstructions: '',
        });
        onPackageAdded();
        setTimeout(onClose, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('שגיאה בהוספת חבילה: ' + err.message);
    }

=======
import { useAuth } from '../contexts/AuthContext';
import '../styles/Modal.css';

function AddPackageModal({ isOpen, onClose, onPackageAdded }) {
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
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
      await addPackage({
        userId: user.uid,
        trackingNumber,
        description,
        status,
        // Add other package details as needed
      });
      onPackageAdded();
      onClose();
      setTrackingNumber('');
      setDescription('');
      setStatus('pending');
    } catch (err) {
      setError('Failed to add package: ' + err.message);
    }
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
<<<<<<< HEAD
        <h2>הוסף חבילה חדשה</h2>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="extractionMethod">שיטת הזנה:</label>
            <select
              id="extractionMethod"
              value={extractionMethod}
              onChange={(e) => setExtractionMethod(e.target.value)}
            >
              <option value="manual">הזנה ידנית</option>
              <option value="text">הדבק טקסט</option>
              <option value="whatsapp">הדבק הודעת וואטסאפ</option>
              <option value="image">העלה תמונה (OCR)</option>
            </select>
          </div>

          {extractionMethod === 'manual' && (
            <>
              <div className="form-group">
                <label htmlFor="receiverName">שם מקבל*</label>
                <input
                  type="text"
                  id="receiverName"
                  name="receiverName"
                  value={manualDetails.receiverName}
                  onChange={handleManualChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="receiverAddress">כתובת מקבל*</label>
                <input
                  type="text"
                  id="receiverAddress"
                  name="receiverAddress"
                  value={manualDetails.receiverAddress}
                  onChange={handleManualChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="senderName">שם שולח</label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={manualDetails.senderName}
                  onChange={handleManualChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="senderAddress">כתובת שולח</label>
                <input
                  type="text"
                  id="senderAddress"
                  name="senderAddress"
                  value={manualDetails.senderAddress}
                  onChange={handleManualChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="size">גודל</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={manualDetails.size}
                  onChange={handleManualChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">משקל</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={manualDetails.weight}
                  onChange={handleManualChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="deliveryInstructions">הוראות מיוחדות</label>
                <textarea
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  value={manualDetails.deliveryInstructions}
                  onChange={handleManualChange}
                ></textarea>
              </div>
            </>
          )}

          {(extractionMethod === 'text' || extractionMethod === 'whatsapp') && (
            <div className="form-group">
              <label htmlFor="packageDetails">הדבק פרטי חבילה (טקסט או הודעת וואטסאפ)</label>
              <textarea
                id="packageDetails"
                value={packageDetails}
                onChange={(e) => setPackageDetails(e.target.value)}
                rows="6"
                placeholder="הדבק כאן את פרטי החבילה..."
              ></textarea>
            </div>
          )}

          {extractionMethod === 'image' && (
            <div className="form-group">
              <label htmlFor="packageImage">העלה תמונה של פרטי החבילה</label>
              <input type="file" id="packageImage" accept="image/*" />
            </div>
          )}

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'מוסיף...' : 'הוסף חבילה'}
          </button>
=======
        <h2>Add New Package</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tracking Number:</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="exception">Exception</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="button button-primary" disabled={loading}>{
              loading ? 'Adding...' : 'Add Package'
            }</button>
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
          </div>
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
        </form>
      </div>
    </div>
  );
}

export default AddPackageModal;
<<<<<<< HEAD

=======
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
