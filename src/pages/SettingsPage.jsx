import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_ROLES } from '../data/mockData';
import { apiService } from '../services/apiService';
import { 
  Settings, 
  ShieldCheck, 
  RotateCcw, 
  Database, 
  Server, 
  Layers, 
  CheckCircle2, 
  UserCheck,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, switchRole, clearAllPatients, restoreSampleData } = useApp();

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Settings</h1>
        </div>
      </div>

      {/* Role Management Simulation */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div>
            <span className="card-title">Hospital Roles</span>
          </div>
          <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {DEMO_ROLES.map(role => {
            const isActive = currentUser.role === role.id;
            return (
              <div
                key={role.id}
                style={{
                  padding: '0.875rem 1rem',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                      {role.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                        {role.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {role.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Department: {role.department}
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {role.permissions.map((perm, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: '0.675rem',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '3px',
                          background: 'var(--bg-surface-secondary)',
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace'
                        }}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => switchRole(role.id)}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {isActive ? 'Active' : 'Switch Role'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Patient Data Management Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Inpatient Data Controls
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={clearAllPatients} style={{ color: 'var(--status-danger-text)' }}>
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={restoreSampleData}>
              <RotateCcw size={14} />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
