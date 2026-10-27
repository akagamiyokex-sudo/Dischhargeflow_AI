import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Building2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Stethoscope, 
  ArrowRight
} from 'lucide-react';

export default function AdminPatientSummaryModal({ patient, onClose, onNavigateDischarge }) {
  if (!patient) return null;

  const stages = [
    { num: 1, name: 'Doctor marks ready' },
    { num: 2, name: 'Draft summary' },
    { num: 3, name: 'Doctor approval' },
    { num: 4, name: 'Pharmacy pack' },
    { num: 5, name: 'Billing clearance' },
    { num: 6, name: 'Departure' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '680px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className={`badge badge-${patient.statusType || 'info'}`} style={{ fontSize: '0.7rem' }}>
                {patient.status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {patient.name}
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              MRN: <strong style={{ color: 'var(--text-main)' }}>{patient.id}</strong> • {patient.age}y {patient.gender} • {patient.department} ({patient.ward}, {patient.bed})
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-icon" 
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ padding: '0.625rem 0.75rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Admission Date</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {patient.admissionDate}
              </div>
            </div>

            <div style={{ padding: '0.625rem 0.75rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Discharge Started</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {patient.dischargeStarted || 'Not started'}
              </div>
            </div>

            <div style={{ padding: '0.625rem 0.75rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Elapsed Time</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: patient.waitingTimeMinutes > 300 ? '#b91c1c' : 'var(--text-main)', marginTop: '0.15rem' }}>
                {Math.floor((patient.waitingTimeMinutes || 0) / 60)}h {(patient.waitingTimeMinutes || 0) % 60}m
              </div>
            </div>
          </div>

          {/* Workflow Stage Progress */}
          <div className="card" style={{ padding: '0.875rem', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                Discharge Pipeline (Stage {patient.stageNumber} of 6)
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                {patient.stageName}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', margin: '0.5rem 0' }}>
              {stages.map((stg) => {
                const isComplete = stg.num < patient.stageNumber || patient.status === 'Completed';
                const isCurrent = stg.num === patient.stageNumber && patient.status !== 'Completed';
                return (
                  <div key={stg.num} style={{ flex: 1, textAlign: 'center' }}>
                    <div 
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: isComplete ? '#0d9488' : isCurrent ? '#f59e0b' : '#e2e8f0',
                        marginBottom: '0.25rem'
                      }}
                    />
                    <span style={{ fontSize: '0.65rem', color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 500 }}>
                      S{stg.num}
                    </span>
                  </div>
                );
              })}
            </div>

            {patient.holdingUpReason && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem', padding: '0.5rem', background: '#fffbeb', borderRadius: 'var(--radius-sm)', border: '1px solid #fef3c7' }}>
                <AlertCircle size={15} style={{ color: '#d97706', marginTop: '0.1rem', flexShrink: 0 }} />
                <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                  <strong>Bottleneck:</strong> {patient.holdingUpReason}
                  {patient.holdingUpDepartment && <div><strong>Holding Department:</strong> {patient.holdingUpDepartment}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Clinical & Care Team Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Primary Diagnosis
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {patient.confirmedDiagnosis || patient.reasonForAdmission || 'Under Clinical Evaluation'}
              </div>
              {patient.icd10 && (
                <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  ICD-10 Code: {patient.icd10}
                </div>
              )}
            </div>

            <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Clinical Care Team
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {patient.attendingDoctor || 'Attending Physician Unassigned'}
              </div>
              <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Assigned Team: {patient.assignedStaff || 'Ward Nursing Staff'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
          {onNavigateDischarge ? (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onNavigateDischarge();
              }}
            >
              <span>Discharge Monitor</span>
              <ArrowRight size={13} />
            </button>
          ) : <div />}

          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
