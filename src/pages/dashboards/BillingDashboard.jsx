import React from 'react';
import { useApp } from '../../context/AppContext';
import { BILLING_DASHBOARD_DATA } from '../../data/mockRoleData';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  FileSpreadsheet, 
  ArrowRight,
  DollarSign
} from 'lucide-react';

export default function BillingDashboard() {
  const { navigateTo, selectPatient, currentUser } = useApp();
  const data = BILLING_DASHBOARD_DATA;

  const handleOpenBillingWorkspace = (patientId) => {
    selectPatient(patientId);
    navigateTo('billing-clearance', patientId);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Billing & Financial Clearance Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Patient Accounts Counter
            </span>
          </div>
          <h1>Billing & Accounts — {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('billing-bills')}>
            <FileSpreadsheet size={15} />
            <span>Bills</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('billing-clearance')}>
            <ShieldCheck size={15} />
            <span>Clearance</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pending Clearance</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.pendingClearance}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Cleared Today</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.clearedToday}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Co-Pays Collected</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.totalCopayCollected}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pre-Auths</span>
            <div className="metric-icon" style={{ color: '#dc2626' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.outstandingPreAuths}</div>
        </div>
      </div>

      {/* Main Grid: Billing Clearance Queue & Insurance Tracking */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        {/* Left: Queue Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Clearance Queue</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('billing-clearance')}>
              Clearance Desk
            </button>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Insurer / Payer</th>
                <th>Total Charges</th>
                <th>Patient Co-Pay</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.billingQueue.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      {item.patient}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {item.id} • {item.ward}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                      {item.payer}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Auth: {item.preAuth}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      ${item.totalCharges.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      ${item.copay.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.status.includes('Approved') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.675rem' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenBillingWorkspace(item.id)}
                    >
                      Audit & Clear
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Insurance Pre-Auth & Recent Tokens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pre-Auth Status Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={17} style={{ color: 'var(--color-primary)' }} />
                <span className="card-title">Carrier Pre-Authorization Log</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {data.insuranceAuthorizations.map((auth, idx) => (
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
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      {auth.carrier}
                    </span>
                    <span className={`badge ${auth.status === 'Cleared' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.675rem' }}>
                      {auth.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Patient: {auth.patient} • Policy: {auth.policy}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.35 }}>
                    {auth.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Financial Clearance Tokens */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Issued Clearance Tokens</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audit Log</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.recentClearances.map((c, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.625rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {c.patient} ({c.mrn})
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                      Cleared at {c.time} by {c.officer}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    {c.token}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
