import React from 'react';
import { useApp } from '../../context/AppContext';
import { LAB_DASHBOARD_DATA } from '../../data/mockRoleData';
import { 
  FlaskConical, 
  TestTube2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileEdit, 
  ClipboardList, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function LabDashboard() {
  const { navigateTo, currentUser, addToast } = useApp();
  const data = LAB_DASHBOARD_DATA;

  const handleAuthorizeResult = (orderId, patientName) => {
    addToast(`Laboratory findings for ${patientName} (${orderId}) verified and authorized into patient medical record.`, 'success');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              Central Laboratory & Pathology Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Diagnostic Chemistry & Hematology
            </span>
          </div>
          <h1>Laboratory & Diagnostics — {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('lab-requests')}>
            <ClipboardList size={15} />
            <span>Orders</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('lab-results')}>
            <FileEdit size={15} />
            <span>Results</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">STAT Orders</span>
            <div className="metric-icon" style={{ color: '#dc2626' }}>
              <FlaskConical size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.statDischargeOrders}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Intake Samples</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <TestTube2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.pendingSamplesInIntake}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Awaiting Review</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.awaitingPathologistReview}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed Today</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.totalTestsToday}</div>
        </div>
      </div>

      {/* Main Grid: STAT Orders & Completed Verifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        {/* Left: STAT Pre-Discharge Orders Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">STAT Pre-Discharge Requests</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('lab-requests')}>
              View All
            </button>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Order / Patient</th>
                <th>Requested Tests</th>
                <th>Elapsed Time</th>
                <th>Analyzer Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.statDischargeOrders.map(order => (
                <tr key={order.orderId}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      {order.patientName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {order.orderId} • {order.ward}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {order.tests.join(', ')}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} style={{ color: order.elapsedMinutes > 30 ? '#dc2626' : 'var(--color-primary)' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.78125rem', color: order.elapsedMinutes > 30 ? '#dc2626' : 'inherit' }}>
                        {order.elapsedMinutes} mins
                      </span>
                    </div>
                    <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Target: {order.targetTurnaround}</span>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAuthorizeResult(order.orderId, order.patientName)}
                    >
                      Authorize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Pathologist Validated Results */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={17} style={{ color: 'var(--color-primary)' }} />
              <span className="card-title">Recently Authorized Results</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filed to EHR</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.completedReviews.map((rev, idx) => (
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
                    {rev.test} — {rev.patient}
                  </span>
                  <span className={`badge ${rev.flag.includes('Low') ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.675rem' }}>
                    {rev.flag}
                  </span>
                </div>
                <div style={{ fontSize: '0.78125rem', fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {rev.result}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Verified at {rev.time} by {rev.verifiedBy}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('lab-completed')}
            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
          >
            View Completed Test History
          </button>
        </div>
      </div>
    </div>
  );
}
