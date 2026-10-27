import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function BillingWorkspacePage() {
  const { patients, loadPatients, addToast, navigateTo, currentUser } = useApp();
  const [selectedBillingPatient, setSelectedBillingPatient] = useState(() => (patients.length > 0 ? patients[0] : null));
  const [activeFilter, setActiveFilter] = useState('All'); // All, Pending, Cleared
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter patients based on clearance
  const filteredPatients = patients.filter(p => {
    if (activeFilter === 'Pending') return !p.billing.isCleared;
    if (activeFilter === 'Cleared') return p.billing.isCleared;
    return true;
  });

  // Sync selected patient when patient list updates
  React.useEffect(() => {
    if (!selectedBillingPatient && filteredPatients.length > 0) {
      setSelectedBillingPatient(filteredPatients[0]);
    } else if (selectedBillingPatient && !filteredPatients.some(p => p.id === selectedBillingPatient.id)) {
      setSelectedBillingPatient(filteredPatients[0] || null);
    }
  }, [filteredPatients, selectedBillingPatient]);

  const activeCount = patients.filter(p => !p.billing.isCleared).length;
  const clearedCount = patients.filter(p => p.billing.isCleared).length;

  const handleUpdateStatus = async (patientId, newStatus) => {
    setIsUpdating(true);
    try {
      await apiService.updateBillingStatus(patientId, newStatus, currentUser.name, `Updated by ${currentUser.name} (${currentUser.title})`);
      await loadPatients();
      addToast(`Billing for ${selectedBillingPatient.name} marked as "${newStatus}".`, 'success');
      
      // Update local drawer state
      const updated = await apiService.getPatientById(patientId);
      setSelectedBillingPatient(updated);
    } catch (e) {
      addToast('Failed to update billing: ' + e.message, 'danger');
    } finally {
      setIsUpdating(false);
    }
  };

  const sel = selectedBillingPatient;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Billing & Financial Clearance Workspace</h1>
          <p>Insurance pre-authorization, patient co-pay settlement, and discharge release token auditing.</p>
        </div>

        <div className="page-header-actions">
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.78125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheck size={15} style={{ color: 'var(--color-primary)' }} />
            <span>Assigned Officer: <strong>{currentUser.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.25rem' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Awaiting Billing Clearance</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value">{activeCount}</div>
          <div className="metric-meta">
            <span>Pending insurer pre-auth or co-pay</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Cleared Today</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{clearedCount}</div>
          <div className="metric-meta">
            <span>Financial release token generated</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Clearance Time</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Receipt size={16} />
            </div>
          </div>
          <div className="metric-value">46m</div>
          <div className="metric-meta">
            <span>Target turnaround &lt; 45 minutes</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Billing Table & Patient Account Statement */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
        {/* Left: Queue Table */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Discharge Billing Queue</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className={`btn btn-sm ${activeFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveFilter('All')}
                >
                  All ({patients.length})
                </button>
                <button
                  className={`btn btn-sm ${activeFilter === 'Pending' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveFilter('Pending')}
                >
                  Pending ({activeCount})
                </button>
                <button
                  className={`btn btn-sm ${activeFilter === 'Cleared' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveFilter('Cleared')}
                >
                  Cleared ({clearedCount})
                </button>
              </div>
            </div>

            <table className="hospital-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>ID</th>
                  <th>Payer / Insurer</th>
                  <th>Total / Co-pay</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Review</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(p => {
                    const isSelected = sel && sel.id === p.id;
                    return (
                      <tr 
                        key={p.id} 
                        onClick={() => setSelectedBillingPatient(p)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent'
                        }}
                      >
                        <td>
                          <div className="patient-cell">
                            <span className="patient-name-text">{p.name}</span>
                            <span className="patient-meta-text">{p.ward}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.78125rem' }}>{p.id}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                            {p.billing.payer.split(' ')[0]}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.78125rem' }}>
                              ${p.billing.totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Co-pay: ${p.billing.patientCoPay.toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${p.billing.isCleared ? 'badge-success' : 'badge-warning'}`}>
                            {p.billing.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <ChevronRight size={16} style={{ color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No patients currently in billing queue
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Patient's Itemized Statement & Actions */}
        {sel ? (
          <div>
            <div className="card" style={{ borderTop: '4px solid var(--color-primary)' }}>
              <div className="card-header">
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {sel.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    MRN: {sel.id} • {sel.ward} ({sel.bed})
                  </div>
                </div>

                <span className={`badge ${sel.billing.isCleared ? 'badge-success' : 'badge-warning'}`}>
                  {sel.billing.status}
                </span>
              </div>

              {/* Account Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Primary Payer & Pre-Authorization
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                    {sel.billing.payer}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Policy: {sel.billing.policyNumber} • Auth: {sel.billing.preAuthNumber}
                  </div>
                </div>

                {/* Charges Breakdown */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Itemized Inpatient Charges
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span>Room & Board / Nursing Care</span>
                      <span>${(sel.billing.totalCharges * 0.45).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span>Diagnostic Imaging & Laboratory</span>
                      <span>${(sel.billing.totalCharges * 0.25).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span>Inpatient Pharmacy & Take-Home Pack</span>
                      <span>${(sel.billing.totalCharges * 0.18).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span>Attending Physician Consultation</span>
                      <span>${(sel.billing.totalCharges * 0.12).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontWeight: 700, fontSize: '0.875rem' }}>
                      <span>Total Inpatient Bill</span>
                      <span>${sel.billing.totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', color: 'var(--status-success-text)' }}>
                      <span>Covered by Insurer</span>
                      <span>-${sel.billing.coveredAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontWeight: 700, borderTop: '2px solid var(--border-subtle)', color: 'var(--text-main)' }}>
                      <span>Patient Co-Pay Amount</span>
                      <span>${sel.billing.patientCoPay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Audit & Notes */}
                <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                  <strong>Billing Audit Notes:</strong> {sel.billing.notes}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                {!sel.billing.isCleared ? (
                  <>
                    <button 
                      className="btn btn-primary"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(sel.id, 'Cleared')}
                    >
                      <CheckCircle2 size={16} />
                      <span>Issue Financial Clearance (Mark as Cleared)</span>
                    </button>

                    <button 
                      className="btn btn-secondary"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(sel.id, 'Pending Insurer Clarification')}
                    >
                      <span>Request Insurer Clarification</span>
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                      padding: '0.625rem',
                      background: 'var(--status-success-bg)',
                      border: '1px solid var(--status-success-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--status-success-text)',
                      fontSize: '0.78125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <CheckCircle2 size={16} />
                      <span>Cleared by {sel.billing.clearedBy} on {sel.billing.clearedAt}</span>
                    </div>

                    <button 
                      className="btn btn-secondary btn-sm"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(sel.id, 'Pending Review')}
                    >
                      Revoke Clearance (Mark as Pending)
                    </button>
                  </div>
                )}

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigateTo('workflow', sel.id)}
                  style={{ marginTop: '0.25rem' }}
                >
                  View in Workflow Tracker
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <Receipt size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Patient Selected</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Select a patient from the queue or admit a new patient to inspect billing details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
