import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NURSE_DASHBOARD_DATA } from '../../data/mockRoleData';
import { 
  HeartPulse, 
  Users, 
  CheckSquare, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertCircle, 
  FileEdit,
  ArrowRight
} from 'lucide-react';

export default function NurseDashboard() {
  const { navigateTo, currentUser, addToast } = useApp();
  const data = NURSE_DASHBOARD_DATA;
  const [tasks, setTasks] = useState(data.shiftTasks);

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        addToast(nextState ? `Task marked as complete: ${t.task}` : 'Task reopened', 'info');
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              Ward Nursing Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {data.wardName}
            </span>
          </div>
          <h1>Ward Care — {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('nurse-observations')}>
            <Activity size={15} />
            <span>Vitals</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('nurse-readiness')}>
            <CheckCircle2 size={15} />
            <span>Readiness</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Bed Census</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.occupiedBeds} / {data.stats.totalBeds}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Discharges Today</span>
            <div className="metric-icon" style={{ color: '#0d9488' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.dischargesPlannedToday}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Observations</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.highPriorityObservations}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Shift Tasks</span>
            <div className="metric-icon" style={{ color: '#2563eb' }}>
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="metric-value">
            {tasks.filter(t => t.completed).length} / {tasks.length}
          </div>
        </div>
      </div>

      {/* Main Grid: Ward Patient Roster & Shift Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        {/* Left: Ward Patient Status List */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">{data.wardName} — Bed Roster</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('nurse-patients')}>
              View Ward
            </button>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Bed</th>
                <th>Patient</th>
                <th>Diagnosis</th>
                <th>Latest Vitals</th>
                <th>Discharge Plan</th>
              </tr>
            </thead>
            <tbody>
              {data.wardPatients.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-primary)' }}>
                      {p.bed}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      {p.patient}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {p.age} yrs
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                      {p.diagnosis}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                      {p.vitals}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.dischargeStatus.includes('Discharge') ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                      {p.dischargeStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Shift Care Tasks & Discharge Readiness */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Shift Checklist */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={17} style={{ color: 'var(--color-primary)' }} />
                <span className="card-title">Shift Task Checklist</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to {currentUser.name}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    padding: '0.625rem 0.75rem',
                    background: t.completed ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={t.completed} 
                    onChange={() => {}} 
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: 500, 
                      color: t.completed ? 'var(--text-muted)' : 'var(--text-main)',
                      textDecoration: t.completed ? 'line-through' : 'none'
                    }}>
                      {t.task}
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      Due by {t.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discharge Readiness Checklist */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={17} style={{ color: '#0d9488' }} />
                <span className="card-title">Discharge Milestone Tracker</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.dischargeChecklist.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-surface-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {item.patient}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>Cannula: <strong>{item.cannulaRemoved ? 'Removed' : 'Intact'}</strong></span>
                    <span>•</span>
                    <span>Meds: <strong>{item.medsExplained ? 'Counselled' : 'Pending'}</strong></span>
                    <span>•</span>
                    <span>Transport: <strong>{item.transportConfirmed ? 'Confirmed' : 'Pending'}</strong></span>
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span className="badge badge-warning" style={{ fontSize: '0.675rem' }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
