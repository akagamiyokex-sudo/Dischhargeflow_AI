import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DISCHARGE_DASHBOARD_DATA } from '../../data/mockRoleData';
import AddPatientModal from '../../components/common/AddPatientModal';
import { 
  GitFork, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight, 
  Search, 
  Building2, 
  ShieldCheck, 
  Car,
  FolderArchive
} from 'lucide-react';

export default function DischargeDashboard() {
  const { navigateTo, selectPatient, currentUser, addPatient, patients } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const data = DISCHARGE_DASHBOARD_DATA;

  const handleOpenWorkflow = (patientId) => {
    selectPatient(patientId);
    navigateTo('discharge-workflow', patientId);
  };

  const activeCasesCount = patients.length > 0 
    ? patients.filter(p => p.status !== 'Completed').length 
    : data.stats.activeDischarges;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
              Discharge Operator & Records Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hospital Care Continuity Desk
            </span>
          </div>
          <h1>Discharge Operations — {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('discharge-queue')}>
            <Clock size={15} />
            <span>Queue</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <UserPlus size={15} />
            <span>+ Admit</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Pipeline</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <GitFork size={16} />
            </div>
          </div>
          <div className="metric-value">{activeCasesCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">On Target (&lt; 5h)</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.casesOnTarget}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Delayed</span>
            <div className="metric-icon" style={{ color: '#dc2626' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.delayedCases}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Ready for Handover</span>
            <div className="metric-icon" style={{ color: '#0d9488' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.readyForHandover}</div>
        </div>
      </div>

      {/* Bottleneck Alerts Banner */}
      <div className="card" style={{ borderLeft: '4px solid #ef4444', marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={17} style={{ color: '#dc2626' }} />
            <span className="card-title">Bottlenecks</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {data.bottleneckSummary.map((b, idx) => (
            <div 
              key={idx}
              style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                  {b.department}
                </span>
                <span className="badge badge-warning" style={{ fontSize: '0.675rem' }}>
                  {b.count} cases
                </span>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#b91c1c', fontWeight: 500 }}>
                Avg wait: {b.avgWait}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {b.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Active Cases & Transport Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        {/* Left: Active Discharge Cases Pipeline */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Cases in Progress</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('discharge-queue')}>
              Full Queue
            </button>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Ward / Bed</th>
                <th>Current Stage</th>
                <th>Holding Department</th>
                <th style={{ textAlign: 'right' }}>Workflow</th>
              </tr>
            </thead>
            <tbody>
              {data.pipelineCases.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => handleOpenWorkflow(c.id)}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {c.id}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78125rem' }}>{c.ward}</span>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      Stage {c.stage}: {c.stageName}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.78125rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        {c.holdingDept}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: c.targetMet ? 'var(--text-muted)' : '#dc2626' }}>
                        Waiting {c.waitingTime} {!c.targetMet && '(Delayed)'}
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenWorkflow(c.id);
                      }}
                    >
                      Tracker
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Transport & Pickup Coordination */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car size={17} style={{ color: 'var(--color-primary)' }} />
              <span className="card-title">Family Pickup & Transport Schedule</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.transportTracker.map((t, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                    {t.patient}
                  </span>
                  <span className={`badge ${t.status === 'Lounge Ready' ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.675rem' }}>
                    {t.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Pickup Time: <strong>{t.scheduledTime}</strong> • {t.vehicle}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Contact: {t.contact} • {t.ward}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('discharge-checklist')}
            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
          >
            Review Document Checklist
          </button>
        </div>
      </div>

      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addPatient}
      />
    </div>
  );
}
