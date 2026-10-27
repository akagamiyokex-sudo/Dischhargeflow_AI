import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Calendar, 
  Building2, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  FileCheck, 
  Activity,
  Heart,
  Pill,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function PatientDetailsPage() {
  const { selectedPatient, navigateTo, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // overview, clinical, documents, progress

  if (!selectedPatient) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>No patient selected</h3>
          <p>Please return to the dashboard and select a patient to view clinical records.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const p = selectedPatient;

  // Documents list with statuses
  const documents = [
    {
      id: 'doc-1',
      title: 'Clinical Discharge Summary',
      type: 'Medical Summary',
      status: p.summaryApproved ? 'Approved & Signed' : (p.summaryDraftGenerated ? 'Draft Prepared' : 'Pending Generation'),
      statusBadge: p.summaryApproved ? 'badge-success' : (p.summaryDraftGenerated ? 'badge-warning' : 'badge-neutral'),
      author: p.attendingDoctor,
      updatedAt: p.summaryApprovedAt || 'Draft in progress',
      canEdit: true
    },
    {
      id: 'doc-2',
      title: 'Nursing Handover & Vitals Trend',
      type: 'Nursing Records',
      status: 'Completed',
      statusBadge: 'badge-success',
      author: 'Ward Nursing Staff',
      updatedAt: 'Today, 09:30 AM',
      canEdit: false
    },
    {
      id: 'doc-3',
      title: 'Pharmacy Discharge Slip & Reconciliation',
      type: 'Pharmacy',
      status: p.billing.isCleared ? 'Cleared for Dispensing' : 'Pending Clearance',
      statusBadge: p.billing.isCleared ? 'badge-success' : 'badge-warning',
      author: 'Inpatient Pharmacy',
      updatedAt: 'Today, 10:15 AM',
      canEdit: false
    },
    {
      id: 'doc-4',
      title: 'Inpatient Bill & Insurance Clearance Token',
      type: 'Financial',
      status: p.billing.isCleared ? 'Cleared & Audited' : 'Pending Pre-auth',
      statusBadge: p.billing.isCleared ? 'badge-success' : 'badge-warning',
      author: p.billing.assignedOfficer,
      updatedAt: p.billing.clearedAt || 'In review',
      canEdit: false
    }
  ];

  return (
    <div className="page-container">
      {/* Patient Header Card */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</h1>
              <span style={{ 
                fontFamily: 'monospace', 
                background: 'var(--bg-surface-secondary)', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.78125rem',
                border: '1px solid var(--border-subtle)'
              }}>
                {p.id}
              </span>
              <span className={`badge badge-${p.statusType}`}>
                <span className="badge-dot" />
                {p.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <div><strong>Age / Gender:</strong> {p.age} years • {p.gender}</div>
              <div><strong>Ward:</strong> {p.ward} ({p.bed})</div>
              <div><strong>Admission Date:</strong> {p.admissionDate}</div>
              <div><strong>Attending:</strong> {p.attendingDoctor}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigateTo('summary-editor', p.id)}
            >
              <FileText size={15} />
              <span>Discharge Summary</span>
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('workflow', p.id)}
            >
              <ArrowRight size={15} />
              <span>Track Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clinical' ? 'active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          Clinical Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents & Handover
        </button>
        <button 
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Discharge Progress & Tasks
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
          <div>
            {/* Bottleneck alert if applicable */}
            {p.holdingUpReason && p.status !== 'Completed' && (
              <div className="delay-banner">
                <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="delay-banner-title">Current Bottleneck / Active Responsibility</div>
                  <div className="delay-banner-desc">{p.holdingUpReason}</div>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.35rem' }}>
                    Responsible Unit: <strong>{p.holdingUpDepartment}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Clinical Snapshot */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-header">
                <span className="card-title">Admission & Clinical Synopsis</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Reason for Admission
                  </div>
                  <p style={{ fontSize: '0.84rem', marginTop: '0.2rem' }}>{p.reasonForAdmission}</p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Confirmed Primary Diagnosis
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {p.confirmedDiagnosis} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({p.icd10})</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Condition at Discharge
                  </div>
                  <p style={{ fontSize: '0.84rem', marginTop: '0.2rem' }}>{p.conditionAtDischarge}</p>
                </div>
              </div>
            </div>

            {/* Vitals at Discharge */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Discharge Vital Signs</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recorded by {p.assignedStaff}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Blood Pressure</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.vitalsAtDischarge.bp}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Heart Rate</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.vitalsAtDischarge.hr}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Oxygen Saturation</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.vitalsAtDischarge.spo2}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Respiratory Rate</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.vitalsAtDischarge.rr}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Body Temperature</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.vitalsAtDischarge.temp}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Weight</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.vitalsAtDischarge.weight}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Workflow snapshot & Logistics */}
          <div>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-header">
                <span className="card-title">Discharge Milestone</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78125rem', marginBottom: '0.35rem' }}>
                  <span>Stage {p.stageNumber} of 6</span>
                  <span style={{ fontWeight: 600 }}>{Math.round((p.stages.filter(s => s.status === 'completed').length / 6) * 100)}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(p.stages.filter(s => s.status === 'completed').length / 6) * 100}%`,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div><strong>Current:</strong> {p.stageName}</div>
                <div><strong>Started:</strong> {p.dischargeStarted}</div>
                <div><strong>Target Release:</strong> {p.estimatedDischargeTime}</div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => navigateTo('workflow', p.id)}
              >
                Go to Workflow Tracker
              </button>
            </div>

            {/* Caregiver & Transport */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Post-Discharge Logistics</span>
              </div>
              <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Primary Caregiver / Family Contact</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.portal.caregiverName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.portal.caregiverContact}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Transport Arrangements</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{p.portal.transportStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clinical Information */}
      {activeTab === 'clinical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Diagnosis & Medical History</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>PRIMARY DIAGNOSIS</h4>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {p.confirmedDiagnosis}
                </div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  ICD-10 Code: {p.icd10}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>SECONDARY COMORBIDITIES</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {p.secondaryDiagnoses && p.secondaryDiagnoses.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>DOCUMENTED ALLERGIES & ADVERSE REACTIONS</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {p.allergies && p.allergies.map((a, i) => (
                  <span key={i} className="badge badge-danger">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Procedures, Surgeries & Investigations</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <h4 style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>PROCEDURES PERFORMED</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {p.procedures && p.procedures.map((proc, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{proc}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>DIAGNOSTIC & LAB FINDINGS</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{p.investigations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'documents' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Required Discharge Documentation</span>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => addToast('Exporting compiled discharge packet...', 'info')}
            >
              <Download size={14} />
              <span>Export Packet</span>
            </button>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Author / Responsible</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={16} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.title}</span>
                    </div>
                  </td>
                  <td>{doc.type}</td>
                  <td>
                    <span className={`badge ${doc.statusBadge}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>{doc.author}</td>
                  <td>{doc.updatedAt}</td>
                  <td style={{ textAlign: 'right' }}>
                    {doc.canEdit ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => navigateTo('summary-editor', p.id)}
                      >
                        Open Editor
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => addToast(`Opening ${doc.title}...`, 'info')}
                      >
                        View File
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Discharge Progress */}
      {activeTab === 'progress' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Discharge Milestone Status (6 Stages)</span>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigateTo('workflow', p.id)}
            >
              Manage Tasks in Workflow Tracker
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {p.stages.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in-progress';
              return (
                <div 
                  key={stage.id}
                  style={{
                    padding: '0.875rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    background: isInProgress ? 'var(--color-primary-light)' : 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--color-primary)' : (isInProgress ? '#ffffff' : 'var(--bg-surface-secondary)'),
                        color: isCompleted ? '#ffffff' : (isInProgress ? 'var(--color-primary)' : 'var(--text-muted)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {stage.id}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {stage.name}
                      </span>
                    </div>

                    <span className={`badge ${isCompleted ? 'badge-success' : (isInProgress ? 'badge-info' : 'badge-neutral')}`}>
                      {stage.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '2rem' }}>
                    Responsible Unit: {stage.department}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
