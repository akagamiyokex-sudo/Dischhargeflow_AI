import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLES, ROLE_CONFIGS } from '../../config/rolesConfig';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { 
  Settings, 
  Building2, 
  Clock, 
  Users, 
  Bell, 
  RotateCcw, 
  ShieldCheck, 
  Save, 
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { hospitalSettings, updateHospitalSettings, resetHospitalDemoData, departments } = useApp();

  const [activeTab, setActiveTab] = useState('profile');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [settingsForm, setSettingsForm] = useState(hospitalSettings);

  const handleChange = (field, value) => {
    setSettingsForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateHospitalSettings(settingsForm);
  };

  const handleConfirmReset = async () => {
    setShowResetConfirm(false);
    await resetHospitalDemoData();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Settings</h1>
        </div>

        <div className="page-header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowResetConfirm(true)}
            style={{ color: '#b91c1c' }}
          >
            <RotateCcw size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem' }}>
        {/* Left: Tab Navigation */}
        <div className="card" style={{ padding: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('profile')}
              className="btn btn-sm"
              style={{
                justifyContent: 'flex-start',
                background: activeTab === 'profile' ? 'var(--bg-surface-secondary)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--text-main)',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                border: 'none',
                gap: '0.5rem'
              }}
            >
              <Building2 size={15} />
              <span>Hospital Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className="btn btn-sm"
              style={{
                justifyContent: 'flex-start',
                background: activeTab === 'workflow' ? 'var(--bg-surface-secondary)' : 'transparent',
                color: activeTab === 'workflow' ? 'var(--color-primary)' : 'var(--text-main)',
                fontWeight: activeTab === 'workflow' ? 700 : 500,
                border: 'none',
                gap: '0.5rem'
              }}
            >
              <Clock size={15} />
              <span>Discharge Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('access')}
              className="btn btn-sm"
              style={{
                justifyContent: 'flex-start',
                background: activeTab === 'access' ? 'var(--bg-surface-secondary)' : 'transparent',
                color: activeTab === 'access' ? 'var(--color-primary)' : 'var(--text-main)',
                fontWeight: activeTab === 'access' ? 700 : 500,
                border: 'none',
                gap: '0.5rem'
              }}
            >
              <Lock size={15} />
              <span>User & Access</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className="btn btn-sm"
              style={{
                justifyContent: 'flex-start',
                background: activeTab === 'notifications' ? 'var(--bg-surface-secondary)' : 'transparent',
                color: activeTab === 'notifications' ? 'var(--color-primary)' : 'var(--text-main)',
                fontWeight: activeTab === 'notifications' ? 700 : 500,
                border: 'none',
                gap: '0.5rem'
              }}
            >
              <Bell size={15} />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className="btn btn-sm"
              style={{
                justifyContent: 'flex-start',
                background: activeTab === 'demo' ? 'var(--bg-surface-secondary)' : 'transparent',
                color: activeTab === 'demo' ? '#b91c1c' : 'var(--text-main)',
                fontWeight: activeTab === 'demo' ? 700 : 500,
                border: 'none',
                gap: '0.5rem'
              }}
            >
              <RotateCcw size={15} />
              <span>Developer & Demo Info</span>
            </button>
          </div>
        </div>

        {/* Right: Tab Content */}
        <div className="card">
          <form onSubmit={handleSave}>
            {/* 1. Hospital Profile */}
            {activeTab === 'profile' && (
              <div>
                <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Hospital Institutional Profile</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.875rem' }}>
                    <div className="form-group">
                      <label className="form-label">Hospital Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={settingsForm.hospitalName} 
                        onChange={(e) => handleChange('hospitalName', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Facility / Hospital Code *</label>
                      <input 
                        type="text" 
                        required 
                        value={settingsForm.hospitalCode} 
                        onChange={(e) => handleChange('hospitalCode', e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.875rem' }}>
                    <div className="form-group">
                      <label className="form-label">Administrative Contact Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={settingsForm.contactEmail} 
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Central Switchboard Phone</label>
                      <input 
                        type="text" 
                        value={settingsForm.contactPhone} 
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hospital Physical Address</label>
                    <input 
                      type="text" 
                      value={settingsForm.address} 
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State Healthcare Operating License Number</label>
                    <input 
                      type="text" 
                      value={settingsForm.licenseNumber || 'HOSP-LIC-2026-9941-A'} 
                      onChange={(e) => handleChange('licenseNumber', e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Discharge Workflow */}
            {activeTab === 'workflow' && (
              <div>
                <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Discharge Workflow Policy & SLA</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div className="form-group">
                      <label className="form-label">Target Turnaround Time (Hours) *</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={24} 
                        required 
                        value={settingsForm.targetTurnaroundHours} 
                        onChange={(e) => handleChange('targetTurnaroundHours', parseInt(e.target.value, 10))}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delay Warning Threshold (Hours) *</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={12} 
                        required 
                        value={settingsForm.delayWarningThresholdHours} 
                        onChange={(e) => handleChange('delayWarningThresholdHours', parseInt(e.target.value, 10))}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Required Standard Discharge Pipeline Stages (6 Stages)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem' }}>
                      {settingsForm.requiredStages?.map((stg) => (
                        <div 
                          key={stg.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            background: 'var(--bg-surface-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.75rem'
                          }}
                        >
                          <div>
                            <strong style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }}>Stage {stg.id}:</strong>
                            <span>{stg.name}</span>
                          </div>
                          <span className="badge badge-neutral" style={{ fontSize: '0.675rem' }}>
                            {stg.department}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. User & Access */}
            {activeTab === 'access' && (
              <div>
                <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>User Roles & Access Configuration</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Inactivity Session Timeout (Minutes)</label>
                    <input 
                      type="number" 
                      min={15} 
                      max={480} 
                      value={settingsForm.sessionTimeoutMinutes || 60} 
                      onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value, 10))}
                      className="form-control"
                      style={{ maxWidth: '240px' }}
                    />
                  </div>

                  <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Active Role Architecture (8 Roles Supported)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                      {Object.values(ROLE_CONFIGS).map(rc => (
                        <div key={rc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{rc.shortTitle}</span>
                          <span style={{ color: 'var(--text-main)' }}>{rc.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      id="mfaCheck"
                      checked={settingsForm.enforceMFA}
                      onChange={(e) => handleChange('enforceMFA', e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="mfaCheck" style={{ fontSize: '0.78125rem', cursor: 'pointer', margin: 0 }}>
                      Enforce Multi-Factor Authentication (2FA) for administrative and clinical sign-off roles
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Hospital Notification Preferences</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      id="emailAlerts"
                      checked={settingsForm.emailAlerts}
                      onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                      style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                    />
                    <div>
                      <label htmlFor="emailAlerts" style={{ fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                        In-App Clinical Handover Alerts
                      </label>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Notify ward nursing and attending physicians when a discharge order is authorized.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      id="delayEscalations"
                      checked={settingsForm.delayEscalations}
                      onChange={(e) => handleChange('delayEscalations', e.target.checked)}
                      style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                    />
                    <div>
                      <label htmlFor="delayEscalations" style={{ fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                        Automated Delay Warning Escalations
                      </label>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Flag discharge cases in the administrative overview when waiting time exceeds configured threshold.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Demo Environment */}
            {activeTab === 'demo' && (
              <div>
                <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#b91c1c' }}>
                    Developer & Demo Information
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '0.875rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <AlertTriangle size={16} style={{ color: '#d97706' }} />
                      <strong style={{ fontSize: '0.8125rem', color: '#92400e' }}>Demo Credential & Environment Notice</strong>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, lineHeight: 1.4 }}>
                      Staff profiles registered update the shared demonstration directory and demo login switcher. Deactivated staff are immediately blocked from logging in. Production accounts require Firebase Authentication SSO and enterprise LDAP integration.
                    </p>
                  </div>

                  <div style={{ padding: '0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                    <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, margin: '0 0 0.35rem 0' }}>
                      Restore Default Hospital Demonstration Data
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                      Reset all modified departments, staff directory edits, added patients, and audit trails back to the baseline dataset.
                    </p>

                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowResetConfirm(true)}
                      style={{ color: '#b91c1c' }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset All Demonstration Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Save Button */}
            {activeTab !== 'demo' && (
              <div style={{ marginTop: '1.5rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  <span>Save Configuration</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <ConfirmationModal
          isOpen={true}
          title="Reset Demonstration Data to Baseline?"
          message="Are you sure you want to reset the demonstration database? This will clear any newly added staff, department changes, and patient records, restoring the standard initial test dataset."
          confirmLabel="Reset All Demo Data"
          confirmVariant="danger"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}
