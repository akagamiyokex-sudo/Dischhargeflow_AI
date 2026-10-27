import React from 'react';
import { 
  X, 
  Edit3, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Bed, 
  Calendar, 
  CreditCard, 
  ShieldAlert, 
  Clock,
  HeartPulse
} from 'lucide-react';

export default function ViewPatientAdministrativeModal({ patient, isOpen, onClose, onEdit }) {
  if (!isOpen || !patient) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div 
        className="modal-container"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                  {patient.name}
                </h2>
                <span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {patient.id}
                </span>
                <span className={`badge ${
                  patient.status === 'Ready for Discharge' ? 'badge-success' :
                  patient.status === 'Discharged' ? 'badge-neutral' :
                  'badge-info'
                }`}>
                  {patient.status || 'Admitted'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                Administrative Profile &bull; Front Desk Record View
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top Summary Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Age / Gender
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {patient.age} yrs &bull; {patient.gender || 'Not recorded'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Department
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {patient.department || 'General Medicine'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Location
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {patient.ward} {patient.bed ? `&bull; ${patient.bed}` : ''}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Attending Doctor
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {patient.attendingDoctor || 'Assigned on Admission'}
              </div>
            </div>
          </div>

          {/* Section 1: Contact & Demographics */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <User size={15} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Patient Demographics &amp; Contact
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Date of Birth: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.dob || 'Not specified'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.phone || 'None recorded'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.email || 'None recorded'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Residential Address: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.address || 'Standard Address on File'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Emergency Contact */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Phone size={15} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Emergency Contact / Next of Kin
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Contact Name: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                  {patient.emergencyContact?.name || patient.portal?.caregiverName || 'Not specified'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Relationship: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                  {patient.emergencyContact?.relationship || 'Spouse/Family'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Emergency Phone: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                  {patient.emergencyContact?.phone || patient.portal?.caregiverContact || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Hospital & Insurance Information */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Building2 size={15} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Admission &amp; Insurance Details
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Admission Type: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.admissionType || 'Elective'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Admission Date: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.admissionDate || patient.admitted || 'Recent'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Insurance Provider: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                  {patient.billing?.payer || patient.insuranceProvider || 'Self Pay / Cash'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Policy / Member ID: </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  {patient.billing?.policyNumber || patient.policyNumber || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* RBAC Boundary Note */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
            padding: '0.75rem 0.85rem',
            backgroundColor: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldAlert size={15} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)' }}>Role Permission Notice: </strong>
              Front Desk staff are authorized to view and update administrative registration information. Clinical records, diagnosis, electronic prescriptions, and discharge authorizations require clinical role credentials.
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
          >
            Close
          </button>
          
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(patient);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Edit3 size={14} />
            Edit Administrative Details
          </button>
        </div>

      </div>
    </div>
  );
}
