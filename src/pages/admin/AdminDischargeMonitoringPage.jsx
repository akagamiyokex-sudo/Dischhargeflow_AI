import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminPatientSummaryModal from './AdminPatientSummaryModal';
import { 
  Clock, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ShieldAlert,
  ArrowRight,
  Eye
} from 'lucide-react';

export default function AdminDischargeMonitoringPage() {
  const { patients, departments, navigateTo } = useApp();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [delayedOnly, setDelayedOnly] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const TARGET_THRESHOLD_MINUTES = 300; // 5 hours

  // Calculate elapsed time string and delay status
  const formatElapsedTime = (patient) => {
    if (patient.status === 'Completed') {
      const mins = patient.waitingTimeMinutes || 240;
      return {
        text: `${Math.floor(mins / 60)}h ${mins % 60}m (Completed)`,
        isDelayed: mins > TARGET_THRESHOLD_MINUTES,
        rawMinutes: mins
      };
    }

    if (!patient.dischargeStartedRaw && !patient.dischargeStarted) {
      return { text: 'Not initialized', isDelayed: false, rawMinutes: 0 };
    }

    // Use available waitingTimeMinutes or compute
    const mins = patient.waitingTimeMinutes || 120;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    return {
      text: `${hours}h ${remainingMins}m`,
      isDelayed: mins > TARGET_THRESHOLD_MINUTES,
      rawMinutes: mins
    };
  };

  // Filtered patients
  const filteredCases = useMemo(() => {
    return patients.filter(p => {
      // Search
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        p.name.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term) || 
        p.department?.toLowerCase().includes(term);

      // Dept
      const matchesDept = deptFilter === 'ALL' || p.department?.toLowerCase() === deptFilter.toLowerCase();

      // Stage
      const matchesStage = stageFilter === 'ALL' || String(p.stageNumber) === stageFilter;

      // Status
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

      // Delayed only
      const timing = formatElapsedTime(p);
      const matchesDelayed = !delayedOnly || timing.isDelayed;

      return matchesSearch && matchesDept && matchesStage && matchesStatus && matchesDelayed;
    });
  }, [patients, searchTerm, deptFilter, stageFilter, statusFilter, delayedOnly]);

  // Overall metrics
  const monitorStats = useMemo(() => {
    const active = patients.filter(p => p.status !== 'Completed');
    const delayed = active.filter(p => (p.waitingTimeMinutes || 0) > TARGET_THRESHOLD_MINUTES);
    const completedToday = patients.filter(p => p.status === 'Completed');
    const onTargetCompleted = completedToday.filter(p => (p.waitingTimeMinutes || 0) <= TARGET_THRESHOLD_MINUTES);
    const complianceRate = completedToday.length > 0 
      ? Math.round((onTargetCompleted.length / completedToday.length) * 100) 
      : 78;

    return {
      activeCount: active.length,
      delayedCount: delayed.length,
      completedTodayCount: completedToday.length,
      complianceRate
    };
  }, [patients]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Discharge Monitoring</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigateTo('admin-reports')}>
            Reports
          </button>
        </div>
      </div>

      {/* Monitoring Summary Counters */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">ACTIVE CASES</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="metric-value">{monitorStats.activeCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">EXCEEDING 5H SLA</span>
            <div className="metric-icon" style={{ color: monitorStats.delayedCount > 0 ? '#b91c1c' : '#16a34a' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="metric-value" style={{ color: monitorStats.delayedCount > 0 ? '#b91c1c' : 'inherit' }}>
            {monitorStats.delayedCount}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">COMPLETED TODAY</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="metric-value">{monitorStats.completedTodayCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">SLA COMPLIANCE</span>
            <div className="metric-icon" style={{ color: '#0d9488' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="metric-value">{monitorStats.complianceRate}%</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search patients, MRN, diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Stages</option>
            <option value="1">Stage 1: Doctor marked ready</option>
            <option value="2">Stage 2: Summary prepared</option>
            <option value="3">Stage 3: Doctor sign-off</option>
            <option value="4">Stage 4: Pharmacy pack</option>
            <option value="5">Stage 5: Billing clearance</option>
            <option value="6">Stage 6: Final departure</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Statuses</option>
            <option value="Awaiting doctor review">Awaiting Doctor Review</option>
            <option value="Billing pending">Billing Pending</option>
            <option value="Discharge ready">Discharge Ready</option>
            <option value="Completed">Completed</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: '#b91c1c', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <input 
              type="checkbox"
              checked={delayedOnly}
              onChange={(e) => setDelayedOnly(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Delayed (&gt;5h)</span>
          </label>
        </div>
      </div>

      {/* Discharge Cases Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Discharge Cases ({filteredCases.length})</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Department</th>
                <th>Discharge Started</th>
                <th>Current Stage</th>
                <th>Pending Task / Bottleneck</th>
                <th>Responsible Team</th>
                <th>Elapsed Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No discharge cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((p) => {
                  const timing = formatElapsedTime(p);
                  return (
                    <tr 
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: timing.isDelayed && p.status !== 'Completed' ? '#fffbeb' : 'transparent'
                      }}
                    >
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.75rem' }}>
                          {p.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          {p.ward} ({p.bed})
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78125rem', color: 'var(--text-main)' }}>
                          {p.department}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.dischargeStarted || 'Not initialized'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                            S{p.stageNumber}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {p.stageName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.75rem', color: timing.isDelayed ? '#b91c1c' : 'var(--text-muted)', maxWidth: '240px', lineHeight: 1.3 }}>
                          {p.holdingUpReason || 'Proceeding on schedule'}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                          {p.holdingUpDepartment || p.assignedStaff || 'Care Team'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {timing.isDelayed && p.status !== 'Completed' && (
                            <AlertTriangle size={13} style={{ color: '#b91c1c' }} />
                          )}
                          <strong 
                            style={{ 
                              fontSize: '0.78125rem', 
                              color: timing.isDelayed && p.status !== 'Completed' ? '#b91c1c' : 'var(--text-main)' 
                            }}
                          >
                            {timing.text}
                          </strong>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${p.statusType || 'neutral'}`} style={{ fontSize: '0.6875rem' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(p);
                          }}
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Summary Modal */}
      {selectedPatient && (
        <AdminPatientSummaryModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
