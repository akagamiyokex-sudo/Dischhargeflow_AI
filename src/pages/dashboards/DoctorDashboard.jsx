import React from 'react';
import { useApp } from '../../context/AppContext';
import { DOCTOR_DASHBOARD_DATA } from '../../data/mockRoleData';
import { 
  Users, 
  Stethoscope, 
  FileEdit, 
  Sparkles, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  FolderClock
} from 'lucide-react';

export default function DoctorDashboard() {
  const { navigateTo, selectPatient, currentUser } = useApp();
  const data = DOCTOR_DASHBOARD_DATA;

  const handleReviewSummary = (patientId) => {
    selectPatient(patientId);
    navigateTo('doctor-summary', patientId);
  };

  const handleViewRecords = (patientId) => {
    selectPatient(patientId);
    navigateTo('doctor-records', patientId);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              Doctor / Consultant Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {currentUser.department}
            </span>
          </div>
          <h1>Clinical Dashboard — {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('doctor-patients')}>
            <Users size={15} />
            <span>Inpatients</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('doctor-summary')}>
            <Sparkles size={15} />
            <span>AI Summary</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Assigned Inpatients</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.assignedInpatients}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pending Sign-Off</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <Sparkles size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.pendingSummaryApprovals}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Rounds Today</span>
            <div className="metric-icon" style={{ color: '#2563eb' }}>
              <Calendar size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.consultationsToday}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Critical Alerts</span>
            <div className="metric-icon" style={{ color: '#dc2626' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.criticalLabAlerts}</div>
        </div>
      </div>

      {/* Priority Action Card: Discharge Summaries Awaiting Signature */}
      {data.pendingApprovals.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #d97706', marginBottom: '1.25rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: '#d97706' }} />
              <div>
                <span className="card-title">Discharge Summaries Awaiting Review</span>
              </div>
            </div>
            <span className="badge badge-warning">{data.pendingApprovals.length} pending</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {data.pendingApprovals.map(approval => (
              <div
                key={approval.patientId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {approval.patientName}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {approval.patientId}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>
                      {approval.ward}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                    <strong>Diagnosis:</strong> {approval.diagnosis}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Submitted by {approval.submittedBy} • Waiting for {approval.waitingTime}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewRecords(approval.patientId)}
                  >
                    <FolderClock size={14} />
                    <span>View Records</span>
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleReviewSummary(approval.patientId)}
                  >
                    <Sparkles size={14} />
                    <span>Review & Sign Summary</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Inpatients & Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        {/* Left: Active Assigned Inpatients */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Inpatients Under Active Care</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('doctor-patients')}>
              View All
            </button>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Ward / Bed</th>
                <th>Primary Diagnosis</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.assignedPatients.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {p.age}y • {p.id}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78125rem' }}>{p.ward}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.bed}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                      {p.diagnosis}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.status.includes('Doctor') ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewRecords(p.id)}
                        title="Patient Records"
                      >
                        Records
                      </button>
                      {p.summaryReady && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleReviewSummary(p.id)}
                          title="Open Summary"
                        >
                          Summary
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Schedule & Clinical Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Today's Schedule Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={17} style={{ color: 'var(--color-primary)' }} />
                <span className="card-title">Today's Schedule</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {data.todaySchedule.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '0.625rem 0.75rem',
                    background: 'var(--bg-surface-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {item.time}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                      {item.type}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Alerts Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={17} style={{ color: '#dc2626' }} />
                <span className="card-title">Clinical Diagnostic Alerts</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.clinicalAlerts.map(alt => (
                <div 
                  key={alt.id}
                  style={{
                    padding: '0.625rem 0.75rem',
                    background: alt.severity === 'warning' ? 'var(--status-warning-bg)' : 'var(--status-info-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: alt.severity === 'warning' ? 'var(--status-warning-border)' : 'var(--status-info-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.75rem', color: alt.severity === 'warning' ? 'var(--status-warning-text)' : 'var(--status-info-text)' }}>
                      {alt.patient}
                    </span>
                    <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>{alt.time}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {alt.alert}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
