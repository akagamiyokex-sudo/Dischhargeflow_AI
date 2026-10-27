import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { getRoleConfig } from '../../config/rolesConfig';

export default function AccessDenied({ attemptedPage, userRole, userName, onReturnHome }) {
  const roleConfig = getRoleConfig(userRole);

  return (
    <div className="page-container" style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '520px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          border: '1px solid #fecaca'
        }}>
          <ShieldAlert size={28} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          You don't have access to this page
        </h2>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          The requested workspace (<code>{attemptedPage}</code>) is restricted to authorised personnel.
          Your current session is signed in as <strong>{userName}</strong> ({roleConfig.label}).
        </p>

        {/* Technical Boundary Note */}
        <div style={{
          width: '100%',
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'left',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <Lock size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
          <div>
            <strong>Access Boundary Enforced:</strong> Each hospital role operates within an isolated clinical or administrative boundary. To access this workspace, please switch to an authorised user account or return to your role workspace.
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onReturnHome}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} />
          <span>Return to {roleConfig.shortTitle} Workspace</span>
        </button>
      </div>
    </div>
  );
}
