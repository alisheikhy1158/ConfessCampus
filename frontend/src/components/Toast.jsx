import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const toastStyles = {
  success: { bg: 'var(--success-light)', color: 'var(--success)', border: '#A7F3D0', icon: 'V' },
  error: { bg: 'var(--error-light)', color: 'var(--error)', border: '#FECACA', icon: 'X' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning)', border: '#FDE68A', icon: '!' },
  info: { bg: 'var(--primary-light)', color: 'var(--primary)', border: 'var(--primary-mid)', icon: 'i' },
};

const Toast = ({ toast, onDismiss }) => {
  const style = toastStyles[toast.type] || toastStyles.info;

  return (
    <div
      className="slide-in-right"
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', borderRadius: 'var(--radius-lg)',
        background: style.bg, border: `1.5px solid ${style.border}`,
        boxShadow: 'var(--shadow-md)', maxWidth: '360px', pointerEvents: 'all',
        cursor: 'pointer',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{style.icon}</span>
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: style.color }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: 'var(--text-sm)', color: style.color, opacity: toast.title ? 0.8 : 1 }}>
          {toast.message}
        </div>
      </div>
      <button style={{
        background: 'none', border: 'none', color: style.color,
        opacity: 0.5, cursor: 'pointer', fontSize: '14px', flexShrink: 0,
      }}>×</button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  // Convenience helpers
  toast.success = (message, title) => toast({ type: 'success', message, title });
  toast.error = (message, title) => toast({ type: 'error', message, title });
  toast.warning = (message, title) => toast({ type: 'warning', message, title });
  toast.info = (message, title) => toast({ type: 'info', message, title });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
