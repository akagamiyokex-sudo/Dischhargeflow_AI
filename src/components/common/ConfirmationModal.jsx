import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  confirmVariant = 'primary', // primary, danger
  onConfirm, 
  onClose,
  details
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {confirmVariant === 'danger' && <AlertCircle size={18} style={{ color: 'var(--status-danger-text)' }} />}
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{title}</span>
          </div>
          <button 
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: details ? '0.75rem' : 0 }}>
            {message}
          </p>
          {details && (
            <div style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              fontSize: '0.78125rem',
              color: 'var(--text-secondary)'
            }}>
              {details}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
