import React from 'react';
import { Layers, ArrowRight, Clock, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRoleConfig, getDefaultRouteForRole } from '../../config/rolesConfig';

export default function PlaceholderPage({ 
  title, 
  subtitle, 
  plannedFeatures = [], 
  backRoute 
}) {
  const { currentUser, navigateTo } = useApp();
  const roleConfig = getRoleConfig(currentUser.role);
  const homeRoute = backRoute || getDefaultRouteForRole(currentUser.role);

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.04em' }}>
              {roleConfig.label}
            </span>
          </div>
          <h1>{title}</h1>
        </div>

        <div className="page-header-actions">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => navigateTo(homeRoute)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Module Overview Card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} style={{ color: 'var(--color-primary)' }} />
            <span className="card-title">{title}</span>
          </div>
        </div>

        {plannedFeatures.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.78125rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Module Features
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {plannedFeatures.map((feat, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem'
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
