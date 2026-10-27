import React from 'react';
import { useApp } from '../../context/AppContext';
import { PHARMACY_DASHBOARD_DATA } from '../../data/mockRoleData';
import { 
  Pill, 
  PackageCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Boxes, 
  ArrowRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function PharmacyDashboard() {
  const { navigateTo, currentUser, addToast } = useApp();
  const data = PHARMACY_DASHBOARD_DATA;

  const handleDispenseItem = (patientName) => {
    addToast(`Take-home medication pack for ${patientName} packaged and ready for bedside counseling.`, 'success');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              Inpatient Pharmacy Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Dispensary & Clinical Pharmacy
            </span>
          </div>
          <h1>Pharmacy — {currentUser.name}</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('pharmacy-inventory')}>
            <Boxes size={15} />
            <span>Inventory</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('pharmacy-dispensing')}>
            <PackageCheck size={15} />
            <span>Queue</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Rx in Queue</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Pill size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.pendingDischargeRx}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Dispensed Today</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.dispensedToday}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Stock Alerts</span>
            <div className="metric-icon" style={{ color: '#dc2626' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.criticalStockAlerts}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Counselings</span>
            <div className="metric-icon" style={{ color: '#2563eb' }}>
              <UserCheck size={16} />
            </div>
          </div>
          <div className="metric-value">{data.stats.counselingCompleted}</div>
        </div>
      </div>

      {/* Stock Alerts Notice */}
      <div className="card" style={{ borderLeft: '4px solid #f59e0b', marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={17} style={{ color: '#d97706' }} />
            <span className="card-title">Inventory Alerts</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('pharmacy-inventory')}>
            Reorder
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {data.stockAlerts.map((stk, idx) => (
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
                  {stk.drug}
                </span>
                <span className="badge badge-warning" style={{ fontSize: '0.675rem' }}>
                  {stk.status}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Stock: <strong>{stk.currentStock}</strong> (Min: {stk.minThreshold})
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Supplier: {stk.supplier}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Dispensing Queue & Counseling Record */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        {/* Left: Active Take-Home Prescriptions Queue */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Dispensing Queue</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('pharmacy-prescriptions')}>
              Prescriptions
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {data.dischargePrescriptionsQueue.map(rx => (
              <div 
                key={rx.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {rx.patientName} ({rx.patientId})
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {rx.ward} • Prescribed by {rx.doctor} at {rx.timeReceived}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${rx.priority === 'STAT' ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                      {rx.priority} Priority
                    </span>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDispenseItem(rx.patientName)}
                    >
                      Authorize & Dispense
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.78125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Ordered Take-Home Medications:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {rx.items.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '0.5rem 0.625rem',
                        fontSize: '0.75rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{item.dose} • {item.freq} ({item.days})</div>
                      <div style={{ color: 'var(--color-primary)', fontSize: '0.6875rem', fontWeight: 500, marginTop: '0.15rem' }}>{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bedside Counseling Logs */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={17} style={{ color: 'var(--color-primary)' }} />
              <span className="card-title">Recent Bedside Counseling Sessions</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.recentCounseling.map((c, idx) => (
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
                    {c.patient}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Recipient: {c.caregiver} • Counseled by {c.pharmacist}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Topic: {c.topic}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('pharmacy-dispensing')}
            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
          >
            Open Bedside Handover Log
          </button>
        </div>
      </div>
    </div>
  );
}
