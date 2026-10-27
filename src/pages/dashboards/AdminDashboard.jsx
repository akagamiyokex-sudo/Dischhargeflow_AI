import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminPatientSummaryModal from '../admin/AdminPatientSummaryModal';
import { 
  Building2, 
  Users, 
  Clock, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  Receipt,
  UserCheck,
  FileCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const { patients, staffList, departments, navigateTo } = useApp();
  const [selectedPatientForModal, setSelectedPatientForModal] = useState(null);

  // Compute live metrics dynamically from shared state
  const metrics = useMemo(() => {
    const admittedPatients = patients.filter(p => p.status !== 'Completed');
    const admissionsToday = patients.length; // Active cohort
    const dischargesInProgress = patients.filter(p => p.status !== 'Completed' && (p.stageNumber || 1) >= 1);
    const dischargesCompletedToday = patients.filter(p => p.status === 'Completed').length;
    const waitingForApproval = patients.filter(p => p.stageNumber === 3 || p.status === 'Awaiting doctor review').length;
    const billingClearancesPending = patients.filter(p => p.billing && !p.billing.isCleared && p.status !== 'Completed').length;
    const registeredStaffCount = staffList.filter(s => s.status === 'Active').length;

    return {
      admittedCount: admittedPatients.length,
      admissionsToday,
      inProgressCount: dischargesInProgress.length,
      completedTodayCount: dischargesCompletedToday,
      waitingApprovalCount: waitingForApproval,
      billingPendingCount: billingClearancesPending,
      registeredStaff: registeredStaffCount
    };
  }, [patients, staffList]);

  // Compute department activity summaries dynamically
  const departmentSummaries = useMemo(() => {
    return departments.map(dept => {
      const deptPatients = patients.filter(p => p.department?.toLowerCase() === dept.name?.toLowerCase());
      const admittedCount = deptPatients.filter(p => p.status !== 'Completed').length;
      const activeDischarges = deptPatients.filter(p => p.status !== 'Completed' && (p.stageNumber || 1) >= 1).length;
      const pendingTasks = deptPatients.filter(p => p.holdingUpReason && p.status !== 'Completed').length;

      return {
        ...dept,
        admittedCount,
        activeDischarges,
        pendingTasks
      };
    });
  }, [departments, patients]);

  // Attention Required items - short actionable info
  const attentionItems = useMemo(() => {
    const items = [];

    // 1. Cases waiting for doctor approval
    const awaitingDoc = patients.find(p => p.stageNumber === 3 || p.status === 'Awaiting doctor review');
    if (awaitingDoc) {
      items.push({
        id: 'att-1',
        patientName: awaitingDoc.name,
        action: 'Doctor review required',
        time: '2h',
        urgency: 'high',
        patient: awaitingDoc
      });
    }

    // 2. Billing clearance pending beyond target
    const pendingBilling = patients.find(p => p.billing && !p.billing.isCleared && (p.waitingTimeMinutes || 0) > 180);
    if (pendingBilling) {
      items.push({
        id: 'att-2',
        patientName: pendingBilling.name,
        action: 'Billing clearance pending',
        time: '3h+',
        urgency: 'warning',
        patient: pendingBilling
      });
    }

    // 3. Medical records checklist incomplete
    const incompleteHIM = patients.find(p => p.stageNumber === 2 || !p.summaryDraftGenerated);
    if (incompleteHIM) {
      items.push({
        id: 'att-3',
        patientName: incompleteHIM.name,
        action: 'Clinical summary pending',
        time: '1h',
        urgency: 'warning',
        patient: incompleteHIM
      });
    }

    return items;
  }, [patients]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Hospital Overview</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigateTo('admin-users')}>
            <Users size={15} />
            <span>Staff</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigateTo('admin-discharges')}>
            <Clock size={15} />
            <span>Discharges</span>
          </button>
        </div>
      </div>

      {/* 7 Compact Summary Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* 1. Currently admitted */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">CURRENTLY ADMITTED</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Building2 size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.admittedCount}</div>
        </div>

        {/* 2. Admissions */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">ADMISSIONS</span>
            <div className="metric-icon" style={{ color: '#0284c7' }}>
              <UserCheck size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.admissionsToday}</div>
        </div>

        {/* 3. In discharge */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">IN DISCHARGE</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.inProgressCount}</div>
        </div>

        {/* 4. Completed */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">COMPLETED</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.completedTodayCount}</div>
        </div>

        {/* 5. Pending approval */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">PENDING APPROVAL</span>
            <div className="metric-icon" style={{ color: '#b91c1c' }}>
              <AlertCircle size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.waitingApprovalCount}</div>
        </div>

        {/* 6. Billing */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">BILLING</span>
            <div className="metric-icon" style={{ color: '#059669' }}>
              <Receipt size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.billingPendingCount}</div>
        </div>

        {/* 7. Staff */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">STAFF</span>
            <div className="metric-icon" style={{ color: '#6366f1' }}>
              <Users size={15} />
            </div>
          </div>
          <div className="metric-value">{metrics.registeredStaff}</div>
        </div>
      </div>

      {/* Main 2-Column Section: Left (Activity & Departments) + Right (Attention Required) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Left Column: Current Hospital Activity & Department Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section: Current Hospital Activity */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Current Hospital Activity</span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('admin-discharges')}>
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="hospital-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Department</th>
                    <th>Ward / Bed</th>
                    <th>Admission Date</th>
                    <th>Discharge Status</th>
                    <th>Assigned Doctor</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No active patient records.
                      </td>
                    </tr>
                  ) : (
                    patients.map((p) => (
                      <tr 
                        key={p.id} 
                        onClick={() => setSelectedPatientForModal(p)}
                        style={{ cursor: 'pointer' }}
                        title="View patient summary"
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
                            {p.age}y • {p.gender}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78125rem', color: 'var(--text-main)' }}>
                            {p.department}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.ward} ({p.bed})
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.admissionDate}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${p.statusType || 'neutral'}`} style={{ fontSize: '0.6875rem' }}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                            {p.attendingDoctor || 'Attending Physician'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                            {p.dischargeStarted || 'Today'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Department Summary */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Department Summary</span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('admin-departments')}>
                Departments
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="hospital-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Code</th>
                    <th>Department Head</th>
                    <th>Admitted</th>
                    <th>In Discharge</th>
                    <th>Pending Tasks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentSummaries.map((dept) => (
                    <tr key={dept.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                          {dept.name}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          {dept.location}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                          {dept.code}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                          {dept.head}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                          {dept.admittedCount}
                        </strong>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}> / {dept.totalBeds}</span>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {dept.activeDischarges} active
                        </span>
                      </td>
                      <td>
                        {dept.pendingTasks > 0 ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                            {dept.pendingTasks} pending
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${dept.status === 'Active' ? 'success' : 'neutral'}`} style={{ fontSize: '0.6875rem' }}>
                          {dept.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Attention Required & Quick Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Attention Required Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">ATTENTION REQUIRED</span>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                {attentionItems.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {attentionItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  No pending bottlenecks.
                </div>
              ) : (
                attentionItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      if (item.patient) {
                        setSelectedPatientForModal(item.patient);
                      }
                    }}
                    style={{
                      padding: '0.625rem 0.75rem',
                      background: 'var(--bg-surface-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: item.patient ? 'pointer' : 'default',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: item.urgency === 'high' ? '#dc2626' : '#d97706',
                        flexShrink: 0 
                      }} />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {item.patientName}
                        </div>
                        <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                          {item.action}
                        </div>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: item.urgency === 'high' ? '#dc2626' : '#d97706' 
                    }}>
                      {item.time}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => navigateTo('admin-discharges')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Discharges</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick Administrative Shortcuts */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Directory</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => navigateTo('admin-users')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span>Staff</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{staffList.length}</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => navigateTo('admin-departments')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span>Departments</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{departments.length}</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => navigateTo('admin-operations')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span>Operations</span>
                <ArrowRight size={13} />
              </button>

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => navigateTo('admin-reports')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span>Reports</span>
                <ArrowRight size={13} />
              </button>

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => navigateTo('admin-audit-logs')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span>Audit Logs</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Patient Summary Modal */}
      {selectedPatientForModal && (
        <AdminPatientSummaryModal
          patient={selectedPatientForModal}
          onClose={() => setSelectedPatientForModal(null)}
          onNavigateDischarge={() => navigateTo('admin-discharges')}
        />
      )}
    </div>
  );
}
