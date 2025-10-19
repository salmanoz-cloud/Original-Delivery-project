import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, resetPassword } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();
  const { userRole } = useAuth(); // Get userRole from AuthContext

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await loginWithEmail(email, password);
    if (result.success) {
      // Navigate based on role
      if (userRole === 'admin') {
        navigate('/admin-app/dashboard');
      } else if (userRole === 'courier') {
        navigate('/courier-app/dashboard');
      } else {
        navigate('/customer-app/dashboard'); // Default for customer
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const result = await loginWithGoogle();
    if (result.success) {
      // Navigate based on role
      if (userRole === 'admin') {
        navigate('/admin-app/dashboard');
      } else if (userRole === 'courier') {
        navigate('/courier-app/dashboard');
      } else {
        navigate('/customer-app/dashboard'); // Default for customer
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);
    const result = await resetPassword(resetEmail);
    if (result.success) {
      setResetMessage('Password reset email sent. Check your inbox.');
      setResetEmail('');
      setTimeout(() => setShowResetPassword(false), 3000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>התחברות</h2>
        <form onSubmit={handleEmailLogin}>
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
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        <button onClick={handleGoogleLogin} className="button button-secondary google-button" disabled={loading}>
          התחבר עם גוגל
        </button>
        <p className="auth-link">
          אין לך חשבון? <Link to="/register">הירשם</Link>
        </p>
        <p className="auth-link">
          <button
            type="button"
            onClick={() => setShowResetPassword(!showResetPassword)}
            className="link-button"
          >
            {showResetPassword ? 'חזור להתחברות' : 'שכחת סיסמה?'}
          </button>
        </p>
        {showResetPassword && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="reset-email">אימייל לאיפוס סיסמה:</label>
              <input
                type="email"
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'שולח...' : 'שלח קישור איפוס'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

