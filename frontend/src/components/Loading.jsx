
// ─── Spinner ──────────────────────────────────────────────────────────
export const Spinner = ({ size = 32, color = 'var(--primary)' }) => (
  <div style={{
    width: `${size}px`, height: `${size}px`,
    border: `3px solid ${color}20`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  }} />
);

// ─── FullPageLoader ───────────────────────────────────────────────────
export const FullPageLoader = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '16px',
  }}>
    <Spinner size={40} />
    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
  </div>
);

// ─── SkeletonCard ─────────────────────────────────────────────────────
const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f8 25%, #e8e8f5 50%, #f0f0f8 75%)',
  backgroundSize: '1000px 100%',
  animation: 'shimmer 1.5s infinite linear',
  borderRadius: 'var(--radius-sm)',
};

const SkeletonLine = ({ width = '100%', height = '14px', style }) => (
  <div style={{ ...shimmerStyle, width, height, ...style }} />
);

export const SkeletonCard = () => (
  <div style={{
    background: '#fff', borderRadius: 'var(--radius-xl)',
    border: `1.5px solid ${'var(--border)'}`,
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
  }}>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div style={{ ...shimmerStyle, width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <SkeletonLine width="120px" height="12px" />
        <SkeletonLine width="80px" height="10px" />
      </div>
      <SkeletonLine width="70px" height="22px" style={{ borderRadius: '999px' }} />
    </div>
    <SkeletonLine width="70%" height="18px" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine width="60%" />
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      {['40%', '30%', '20%'].map((w, i) => (
        <SkeletonLine key={i} width={w} height="22px" style={{ borderRadius: '999px' }} />
      ))}
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────
export const EmptyState = ({ emoji = '🌐', title = 'Nothing here yet', description, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '64px 24px', gap: '16px', textAlign: 'center',
  }}>
    <div style={{ fontSize: '56px', lineHeight: 1 }}>{emoji}</div>
    <h3 style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', color: 'var(--text)',
    }}>{title}</h3>
    {description && (
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.6 }}>
        {description}
      </p>
    )}
    {action}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────
export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '48px 24px', gap: '14px', textAlign: 'center',
  }}>
    <div style={{ fontSize: '48px' }}>😵</div>
    <p style={{ fontSize: '15px', color: 'var(--error)' }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: '9px 20px', background: 'var(--primary)', color: '#fff',
          border: 'none', borderRadius: '999px', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '14px',
        }}
      >
        Try Again
      </button>
    )}
  </div>
);
