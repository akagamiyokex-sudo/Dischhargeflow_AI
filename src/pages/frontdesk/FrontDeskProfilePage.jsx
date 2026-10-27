import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  LogOut,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FrontDeskProfilePage() {
  const { currentUser, logout, navigateTo } = useApp();

  const allowedPermissions = [
    'Register patients into Hospital Master Patient Index (MPI)',
    'Global patient search (by Name, MRN ID, and Phone Number)',
    'View patient administrative & demographic records',
    'Update patient registration, contact, and emergency contact details',
    'View inpatient admission status, ward, and bed occupancy',
    'Create and reschedule outpatient appointments & check-ins',
    'View basic hospital-wide admission status'
  ];

  const restrictedPermissions = [
    'Manage staff accounts or assign user roles (Admin only)',
    'Modify clinical diagnoses, progress notes, or SOAP assessments (Doctor only)',
    'Modify electronic medication orders or prescriptions (Doctor/Pharmacy only)',
    'Approve or execute clinical patient discharge (Doctor/Nurse only)',
    'Approve billing adjustments or financial claims (Billing/Admin only)',
    'Access hospital audit system configuration or system logs (Admin only)'
  ];

  return (
    <div className="page-container" style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
          Staff Profile
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
          Front Desk operational credentials, assigned desk, and role-based permissions
        </p>
      </div>

      {/* Profile Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.5rem'
          }}>
            {currentUser.avatar || 'PK'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                {currentUser.name || 'Priya Kumar'}
              </h2>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                Front Desk Staff
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                Active Session
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Hospital Administration &bull; Patient Intake &amp; Reception Desk
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-danger-text)' }}
        >
          <LogOut size={14} />
          Sign Out of Workspace
        </button>
      </div>

      {/* Operational Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Staff Employee ID</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
            EMP-REC-101
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hospital Desk</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            Central Reception Desk A
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Duty Shift</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            Day Shift (08:00 - 16:00)
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact Email</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            frontdesk@hospital.com
          </div>
        </div>
      </div>

      {/* Permissions Breakdown (Requirement 5) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* Authorized */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--status-success-text)' }} />
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Authorized Permissions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {allowedPermissions.map((perm, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                <Check size={15} style={{ color: 'var(--status-success-text)', flexShrink: 0, marginTop: '2px' }} />
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--status-danger-text)' }} />
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Restricted Clinical &amp; Admin Boundaries
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {restrictedPermissions.map((perm, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <X size={15} style={{ color: 'var(--status-danger-text)', flexShrink: 0, marginTop: '2px' }} />
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
