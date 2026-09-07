import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAuth();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let statusClass = '';
        let icon = <Info size={16} color="#60a5fa" style={{ flexShrink: 0 }} />;

        if (toast.type === 'success') {
          statusClass = 'success';
          icon = <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />;
        } else if (toast.type === 'error') {
          statusClass = 'error';
          icon = <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />;
        }

        return (
          <div
            key={toast.id}
            className={`toast-item ${statusClass} animate-fade-in`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {icon}
              <span style={{ fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
