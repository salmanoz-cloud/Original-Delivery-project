import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import '../styles/Auth.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await registerWithEmail(email, password, 'customer'); // Default to customer role
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setLoading(true);
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/customer-app/dashboard'); // Navigate to customer dashboard after Google registration
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>הרשמה</h2>
        <form onSubmit={handleEmailRegister}>
          <div className="form-group">
            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">סיסמה:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'נרשם...' : 'הירשם'}
          </button>
        </form>
        <button onClick={handleGoogleRegister} className="button button-secondary google-button" disabled={loading}>
          הירשם עם גוגל
        </button>
        <p className="auth-link">
          כבר יש לך חשבון? <Link to="/login">התחבר</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

