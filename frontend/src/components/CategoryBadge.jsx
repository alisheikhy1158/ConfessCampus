const categoryMeta = {
  confession: { label: 'Confession', emoji: '', bg: 'var(--confession-bg)', text: 'var(--confession-text)', border: 'var(--confession-border)' },
  discussion: { label: 'Discussion', emoji: '', bg: 'var(--discussion-bg)', text: 'var(--discussion-text)', border: 'var(--discussion-border)' },
  'lost-found': { label: 'Lost & Found', emoji: '', bg: 'var(--lost-found-bg)', text: 'var(--lost-found-text)', border: 'var(--lost-found-border)' },
  carpool: { label: 'Carpool', emoji: '', bg: 'var(--carpool-bg)', text: 'var(--carpool-text)', border: 'var(--carpool-border)' },
};








const CategoryBadge = ({ category, size = 'sm' }) => {
  const meta = categoryMeta[category];
  if (!meta) return null;

  const padding = size === 'lg' ? '6px 14px' : '3px 10px';
  const fontSize = size === 'lg' ? 'var(--text-sm)' : 'var(--text-xs)';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding, borderRadius: 'var(--radius-full)',
      background: meta.bg, color: meta.text,
      border: `1px solid ${meta.border}`,
      fontSize, fontWeight: 600, fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
};

export default CategoryBadge;
