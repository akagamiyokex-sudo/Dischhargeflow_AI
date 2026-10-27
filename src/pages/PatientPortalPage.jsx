import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  Phone, 
  Download, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function PatientPortalPage() {
  const { patients, selectedPatientId, selectPatient, addToast, navigateTo } = useApp();
  const [activePatientId, setActivePatientId] = useState(selectedPatientId || (patients.length > 0 ? patients[0].id : null));
  const [checkedItems, setCheckedItems] = useState({});

  const currentPatient = (patients && patients.length > 0)
    ? (patients.find(p => p.id === activePatientId) || patients[0])
    : null;
  const p = currentPatient;

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!p) {
    return (
      <div className="page-container" style={{ maxWidth: '960px' }}>
        <div className="empty-state" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <HeartHandshake size={44} className="empty-state-icon" style={{ opacity: 0.6, marginBottom: '0.75rem' }} />
          <h3 className="empty-state-title">No Patient Records in Portal</h3>
          <p className="empty-state-desc" style={{ maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            There are currently no patients active in the discharge care portal. Please admit a patient from the overview screen to view their personalized discharge checklist and care instructions.
          </p>
          <button className="btn btn-primary" onClick={() => navigateTo('dashboard')}>
            Return to Overview
          </button>
        </div>
      </div>
    );
  }

  // Plain-language medication schedule parsed from approved data
  const medicationsList = p.summaryContent && p.summaryContent.medications ? p.summaryContent.medications : [];

  const handleDownloadSummary = () => {
    addToast('Downloading approved discharge care instructions (PDF)...', 'success');
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Patient Switcher for Demo testing */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.625rem 1rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartHandshake size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Patient & Family Care Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Viewing portal for:</span>
          <select
            className="form-control"
            value={activePatientId}
            onChange={(e) => {
              setActivePatientId(e.target.value);
              selectPatient(e.target.value);
            }}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.78125rem', width: 'auto' }}
          >
            {patients.map(pat => (
              <option key={pat.id} value={pat.id}>
                {pat.name} ({pat.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reassuring Welcome & Status Banner */}
      <div className="card" style={{ 
        marginBottom: '1.25rem', 
        borderLeft: '4px solid var(--color-primary)',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Welcome, {p.name}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Here is your discharge status, doctor-approved medication plan, and care instructions to help you recover comfortably at home.
            </p>
          </div>

          <div style={{
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.625rem 1rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-text)', fontWeight: 500 }}>
              Estimated Release Time
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-hover)' }}>
              {p.estimatedDischargeTime}
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
              {p.status === 'Completed' ? 'Discharge completed — You are cleared to head home' : `Discharge in progress (Step ${p.stageNumber} of 6)`}
            </span>
            <span style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
              {p.ward} ({p.bed})
            </span>
          </div>

          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(p.stages.filter(s => s.status === 'completed').length / 6) * 100}%`,
              backgroundColor: 'var(--color-primary)'
            }} />
          </div>

          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {p.status === 'Completed'
              ? 'All discharge documentation, pharmacy packets, and follow-up appointments have been completed.'
              : `Current step: ${p.stageName}. Hospital staff are finalizing necessary reviews. You do not need to take any action right now.`}
          </p>
        </div>
      </div>

      {/* Discharge Summary Document Availability */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: p.summaryApproved ? 'var(--status-success-bg)' : 'var(--bg-surface-secondary)',
              color: p.summaryApproved ? 'var(--status-success-text)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {p.summaryApproved ? 'Your discharge summary is ready' : 'Your discharge summary is being prepared'}
              </div>
              <div style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
                {p.summaryApproved 
                  ? `Approved and signed by ${p.attendingDoctor}` 
                  : 'Your medical team is reviewing your clinical instructions and prescriptions.'}
              </div>
            </div>
          </div>

          {p.summaryApproved && (
            <button className="btn btn-primary" onClick={handleDownloadSummary}>
              <Download size={15} />
              <span>Download Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* Medication Schedule (Doctor-Approved) */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div>
            <span className="card-title">Your Medication Schedule</span>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Please take only the medications listed below. Do not stop taking them without consulting your doctor.
            </p>
          </div>
          <Pill size={18} style={{ color: 'var(--color-primary)' }} />
        </div>

        {medicationsList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {medicationsList.map((med, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  background: 'var(--bg-surface)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {med.name} — <span style={{ color: 'var(--color-primary)' }}>{med.dose}</span>
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    How to take: <strong>{med.frequency}</strong> ({med.route}) • Duration: {med.duration}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-surface-secondary)',
                  color: 'var(--text-secondary)'
                }}>
                  Purpose: {med.purpose}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            Medication instructions will appear here as soon as your attending doctor finalizes your prescription.
          </div>
        )}
      </div>

      {/* Upcoming Appointments & Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Appointments */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Appointments</span>
            <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              padding: '0.75rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-secondary)'
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                Outpatient Follow-up with {p.attendingDoctor.split(',')[0]}
              </div>
              <div style={{ fontSize: '0.78125rem', color: 'var(--color-primary)', fontWeight: 500, marginTop: '0.2rem' }}>
                {p.summaryContent && p.summaryContent.followUpPlan ? p.summaryContent.followUpPlan : 'In 2 weeks (details will be printed on release)'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Hospital Specialty Outpatient Clinic, Level 3
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Please bring your discharge summary packet and home medication bottles with you to this appointment.
            </p>
          </div>
        </div>

        {/* Follow-up Checklist */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Your Recovery Checklist</span>
            <CheckCircle2 size={18} style={{ color: 'var(--color-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'c1', label: 'Receive discharge medications and pharmacist explanation' },
              { id: 'c2', label: 'Verify family transport or driver arrival' },
              { id: 'c3', label: 'Store emergency hospital contact number in your phone' },
              { id: 'c4', label: 'Schedule recommended routine laboratory test before follow-up' }
            ].map(item => (
              <label 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  fontSize: '0.8125rem',
                  color: checkedItems[item.id] ? 'var(--text-muted)' : 'var(--text-main)',
                  textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0'
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  style={{ cursor: 'pointer' }}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Warning Signs / Red Flags */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid #dc2626' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: '#dc2626' }} />
            <span className="card-title" style={{ color: '#991b1b' }}>When to Seek Urgent Medical Care</span>
          </div>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Contact the hospital emergency department or call emergency services immediately if you experience any of the following symptoms:
        </p>

        <div style={{
          background: 'var(--status-danger-bg)',
          border: '1px solid var(--status-danger-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.875rem 1rem',
          fontSize: '0.8125rem',
          color: 'var(--status-danger-text)',
          lineHeight: 1.5
        }}>
          {p.summaryContent && p.summaryContent.warningInstructions
            ? p.summaryContent.warningInstructions
            : 'Fever above 38.5°C, sudden shortness of breath, acute chest pain, persistent dizziness, or bleeding from surgical sites.'}
        </div>
      </div>

      {/* Hospital Contact Info */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Phone size={18} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Questions about your care?
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ward {p.ward} Nursing Station: (555) 019-4820 • 24/7 Hospital Careline: (555) 019-9000
            </div>
          </div>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => addToast('Hospital careline phone number saved.', 'info')}
        >
          Contact Hospital
        </button>
      </div>
    </div>
  );
}
