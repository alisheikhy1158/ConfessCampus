const categoryMeta = {
  confession: { label: 'Confession', emoji: '', bg: 'var(--confession-bg)', text: 'var(--confession-text)', border: 'var(--confession-border)' },
  discussion: { label: 'Discussion', emoji: '', bg: 'var(--discussion-bg)', text: 'var(--discussion-text)', border: 'var(--discussion-border)' },
  'lost-found': { label: 'Lost & Found', emoji: '', bg: 'var(--lost-found-bg)', text: 'var(--lost-found-text)', border: 'var(--lost-found-border)' },
  carpool: { label: 'Carpool', emoji: '', bg: 'var(--carpool-bg)', text: 'var(--carpool-text)', border: 'var(--carpool-border)' },
};








const categories = [
  { value: '', label: 'All Posts' },
  { value: 'confession', label: 'Confessions' },
  { value: 'discussion', label: 'Discussions' },
  { value: 'lost-found', label: 'Lost & Found' },
  { value: 'carpool', label: 'Carpool' },
];

const CategoryFilter = ({ active, onChange }) => {
  return (
    <div style={{
      display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0',
      scrollbarWidth: 'none',
    }}>
      {categories.map(cat => {
        const isActive = active === cat.value;
        const meta = cat.value ? categoryMeta[cat.value] : null;

        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: 'var(--radius-full)', border: 'none',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-fast)',
              fontFamily: 'var(--font-body)', fontWeight: isActive ? 600 : 500,
              fontSize: 'var(--text-sm)', flexShrink: 0,
              background: isActive
                ? (meta ? meta.bg : 'var(--primary-light)')
                : 'var(--white)',
              color: isActive
                ? (meta ? meta.text : 'var(--primary)')
                : 'var(--text-secondary)',
              border: isActive
                ? `1.5px solid ${meta ? meta.border : 'var(--primary-mid)'}`
                : `1.5px solid ${'var(--border)'}`,
              boxShadow: isActive ? '0 2px 8px rgba(91,91,214,0.12)' : 'none',
              transform: isActive ? 'translateY(-1px)' : 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-muted)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--white)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
