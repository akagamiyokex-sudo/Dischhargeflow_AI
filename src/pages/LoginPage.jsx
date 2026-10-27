import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  Eye, 
  EyeOff, 
  Lock, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage() {
  const { login, addToast } = useApp();
  
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!identifier.trim()) {
      setErrorMessage('Please enter your hospital email address or mobile number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Main Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        padding: '2rem',
        marginBottom: '1.25rem'
      }}>
        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="brand-icon-box" style={{ width: '40px', height: '40px' }}>
            <Activity size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              DischargeFlow<span style={{ color: 'var(--color-primary)' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hospital Discharge Management &amp; Continuity-of-Care
            </div>
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Sign in to your account
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Enter your registered hospital email address or mobile number and password to access your workspace.
          </p>
        </div>

        {/* Quick Credentials Helper Card */}
        <div style={{
          background: 'var(--color-primary-light, rgba(37, 99, 235, 0.08))',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              Quick Demo Credentials:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setIdentifier('admin@hospital.com');
                  setPassword('admin123');
                }}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIdentifier('frontdesk@hospital.com');
                  setPassword('admin123');
                }}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              >
                Front Desk
              </button>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Admin:</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>admin@hospital.com</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Front Desk:</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>frontdesk@hospital.com</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: 'var(--status-danger-bg)',
            border: '1px solid var(--status-danger-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.78125rem',
            color: 'var(--status-danger-text)'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="identifier-input">Hospital Email or Mobile Number</label>
            <input
              id="identifier-input"
              type="text"
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. user@hospital.com or +1 (555) 012-3456"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label className="form-label" htmlFor="password-input" style={{ marginBottom: 0 }}>Password</label>
              <a 
                href="#forgot" 
                onClick={(e) => {
                  e.preventDefault();
                  addToast('Please contact your Hospital Administrator to reset your password.', 'info');
                }}
                style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingRight: '2.5rem' }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.625rem', fontWeight: 600, justifyContent: 'center' }}
          >
            {isSubmitting ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>

        {/* Regulatory Access Notice */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.625rem 0.75rem',
          background: 'var(--bg-surface-secondary)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <Lock size={14} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Access is restricted to authorized hospital personnel registered by the Hospital Administrator. 
            All logins and clinical record queries are audited in accordance with healthcare confidentiality policies.
          </p>
        </div>
      </div>

      {/* Help Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <ShieldCheck size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            First time signing in?
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Your account is created by your Hospital Administrator. Use the email address or mobile number 
            registered in the Staff Directory, along with your issued password. 
            Contact your administrator if you do not yet have access.
          </p>
        </div>
      </div>
    </div>
  );
}
