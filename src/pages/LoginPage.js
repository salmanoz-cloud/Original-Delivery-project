import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, resetPassword } from '../services/authService';
import '../styles/Auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithEmail(email, password);

    if (result.success) {
      // Redirect based on role
      if (result.data.role === 'admin') {
        navigate('/admin');
      } else if (result.data.role === 'courier') {
        navigate('/admin');
      } else {
        navigate('/customers');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
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
        <h1>הדוור הבא</h1>
        <p className="subtitle">Personal Delivery Service</p>

        {error && <div className="alert alert-error">{error}</div>}
        {resetMessage && <div className="alert alert-success">{resetMessage}</div>}

        {!showResetPassword ? (
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label htmlFor="email">אימייל</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">סיסמה</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'מתחבר...' : 'התחברות'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="reset-email">אימייל</label>
              <input
                type="email"
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'שולח...' : 'שלח קישור איפוס'}
            </button>
          </form>
        )}

        <div className="auth-divider">או</div>

        <button onClick={handleGoogleLogin} className="button button-google" disabled={loading}>
          <span>🔐</span> התחברות עם Google
        </button>

        <div className="auth-footer">
          <p>
            אין לך חשבון? <a href="/register">הירשם כאן</a>
          </p>
          <p>
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              className="link-button"
            >
              {showResetPassword ? 'חזור להתחברות' : 'שכחת סיסמה?'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

