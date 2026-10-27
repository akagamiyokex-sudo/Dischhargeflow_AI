import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PATIENT_DASHBOARD_DATA } from '../../data/mockRoleData';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Pill, 
  Download, 
  Phone, 
  AlertTriangle, 
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

export default function PatientDashboard() {
  const { navigateTo, currentUser, addToast } = useApp();
  const data = PATIENT_DASHBOARD_DATA;
  const [checklistState, setChecklistState] = useState({
    transport: true,
    meds: false,
    folder: false,
    cannula: false
  });

  const toggleChecklistItem = (key) => {
    setChecklistState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownload = () => {
    addToast('Downloading approved discharge care instructions (PDF)...', 'success');
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              Patient & Family Care Portal
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Inpatient In: {currentUser.assignedWard || data.patient.ward}
            </span>
          </div>
          <h1>Welcome, {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('patient-appointments')}>
            <Calendar size={15} />
            <span>Appointments</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleDownload}>
            <Download size={15} />
            <span>Instructions</span>
          </button>
        </div>
      </div>

      {/* Discharge Progress Bar Card */}
      <div className="card" style={{ borderTop: '4px solid var(--color-primary)', marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div>
            <span className="card-title">Preparing for Your Departure</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Estimated departure time: <strong>{data.patient.estimatedDischargeTime}</strong>
            </p>
          </div>
          <span className="badge badge-info">Step 3 of 5</span>
        </div>

        {/* Milestone Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {data.dischargeMilestones.map((m) => {
            const isDone = m.status === 'completed';
            const isCurr = m.status === 'current';
            return (
              <div 
                key={m.step}
                style={{
                  padding: '0.75rem',
                  background: isCurr ? 'var(--color-primary-light)' : (isDone ? 'var(--bg-surface)' : 'var(--bg-surface-secondary)'),
                  border: '1px solid',
                  borderColor: isCurr ? 'var(--color-primary)' : (isDone ? 'var(--border-subtle)' : 'transparent'),
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  {isDone ? (
                    <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                  ) : isCurr ? (
                    <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--border-subtle)', display: 'inline-block' }} />
                  )}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isCurr ? 'var(--color-primary)' : 'var(--text-main)' }}>
                    Step {m.step}
                  </span>
                </div>
                <div style={{ fontSize: '0.78125rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.3 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {m.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Prescribed Medications & Follow-up Appointment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Left: Take-Home Prescribed Medications */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill size={18} style={{ color: 'var(--color-primary)' }} />
              <span className="card-title">Your Take-Home Medications</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('patient-prescriptions')}>
              Full Details
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.takeHomeMedications.map((med, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.875rem',
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {med.name}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>
                    {med.dose}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  <strong>How to take:</strong> {med.instructions}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Purpose: {med.purpose}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Follow-up Appointment & Emergency Alert */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Follow-up Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                <span className="card-title">Follow-up Appointment</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {data.followUpAppointment.doctor}
              </div>
              <div style={{ fontSize: '0.78125rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                {data.followUpAppointment.date} at {data.followUpAppointment.time}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {data.followUpAppointment.location}
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.35 }}>
                {data.followUpAppointment.instructions}
              </p>
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => navigateTo('patient-appointments')}
              style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            >
              Manage Appointments
            </button>
          </div>

          {/* Emergency Warning Signs */}
          <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={17} style={{ color: '#dc2626' }} />
                <span className="card-title" style={{ color: '#991b1b' }}>When to Seek Emergency Care</span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Call emergency services (911 / hospital hotline) immediately if you experience:
            </p>

            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {data.emergencySigns.map((sign, idx) => (
                <li key={idx}>{sign}</li>
              ))}
            </ul>

            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: '#fef2f2',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#991b1b',
              fontWeight: 600
            }}>
              <Phone size={14} />
              <span>Hospital Hotline: +1 (555) 019-9000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
