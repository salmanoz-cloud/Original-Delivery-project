import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import '../styles/Auth.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.displayName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError('כל השדות חובה');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות לא תואמות');
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להיות לפחות 6 תווים');
      return;
    }

    setLoading(true);

    const result = await registerWithEmail(
      formData.email,
      formData.password,
      formData.displayName,
      formData.phoneNumber,
      'customer'
    );

    if (result.success) {
      navigate('/customers');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);

    const result = await loginWithGoogle();

    if (result.success) {
      navigate('/customers');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>הדוור הבא</h1>
        <p className="subtitle">Personal Delivery Service</p>
        <p className="register-subtitle">הרשמה לשירות</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="displayName">שם מלא</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="שם מלא"
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
              placeholder="your@email.com"
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
              placeholder="05X-XXXXXXX"
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
              placeholder="••••••••"
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
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'מירשם...' : 'הרשמה'}
          </button>
        </form>

        <div className="auth-divider">או</div>

        <button onClick={handleGoogleRegister} className="button button-google" disabled={loading}>
          <span>🔐</span> הרשמה עם Google
        </button>

        <div className="auth-footer">
          <p>
            יש לך כבר חשבון? <a href="/login">התחבר כאן</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

