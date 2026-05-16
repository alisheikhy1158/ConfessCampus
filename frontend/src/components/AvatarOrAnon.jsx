
const AvatarOrAnon = ({ user, isAnonymous, size = 40 }) => {
  const fontSize = size > 36 ? 'var(--text-sm)' : 'var(--text-xs)';

  if (isAnonymous || !user || (!user.name && !user.username)) {
    return (
      <div style={{
        width: `${size}px`, height: `${size}px`,
        borderRadius: 'var(--radius-full)',
        background: 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size > 36 ? '18px' : '14px',
        flexShrink: 0,
        border: '2px solid #F3F4F6',
      }}>
        👤
      </div>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  // Color based on username for consistency
  const hue = (user.username || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const bg = `hsl(${hue}, 65%, 55%)`;

  return (
    <div
      title={user.name || user.username}
      style={{
        width: `${size}px`, height: `${size}px`,
        borderRadius: 'var(--radius-full)',
        background: `linear-gradient(135deg, ${bg}, hsl(${(hue + 40) % 360}, 65%, 55%))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--white)', fontFamily: 'var(--font-heading)', fontWeight: 700,
        fontSize, flexShrink: 0,
        border: `2px solid rgba(255,255,255,0.9)`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      {initials}
    </div>
  );
};

export default AvatarOrAnon;
