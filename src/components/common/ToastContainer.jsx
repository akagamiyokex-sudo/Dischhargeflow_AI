import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = '#38bdf8';
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = '#4ade80';
        } else if (toast.type === 'warning' || toast.type === 'danger') {
          Icon = AlertCircle;
          iconColor = '#fbbf24';
        }

        return (
          <div key={toast.id} className="toast">
            <Icon size={16} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ flex: 1, lineHeight: 1.35 }}>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ color: '#94a3b8', padding: '0.1rem', marginLeft: '0.5rem' }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
