import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../api/services';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = user?._id || user?.id;
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const loadPending = async () => {
      try {
        const data = await messagesAPI.getRequests();
        if (!active) return;
        setPendingRequests((data.requests || []).filter(r => r.status === 'pending').length);
      } catch {
        // ignore
      }
      try {
        const data = await messagesAPI.getChats();
        if (!active) return;
        setUnreadChats((data.chats || []).filter(chat => (chat.unreadCount || 0) > 0).length);
      } catch {
        // ignore
      }
    };

    loadPending();
    const handleMessagesUpdate = () => { if (active) loadPending(); };
    window.addEventListener('whispercampus:messagesUpdate', handleMessagesUpdate);

    return () => {
      active = false;
      window.removeEventListener('whispercampus:messagesUpdate', handleMessagesUpdate);
    };
  }, [user]);

  // Don't show on login/signup pages or messages (full screen)
  const hiddenPaths = ['/login', '/signup', '/messages'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { icon: 'H', label: 'Feed', path: '/feed' },
    { icon: 'S', label: 'Search', path: '/search' },
    { icon: 'P', label: 'Post', path: '/create', highlight: true },
    { icon: 'M', label: 'DMs', path: '/messages' },
    { icon: 'U', label: 'Profile', path: currentUserId ? `/profile/${currentUserId}` : '/login' },
  ];

  return (
    <nav className="hide-desktop" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderTop: `1px solid ${'var(--border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 16px rgba(91,91,214,0.08)',
    }}>
      {navItems.map(item => {
        const active = isActive(item.path.split('?')[0]);
        const showBadge = item.path === '/messages' && (pendingRequests > 0 || unreadChats > 0);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '3px', padding: '6px 14px', background: 'none',
              border: 'none', cursor: 'pointer', flex: 1,
              transition: 'var(--transition-fast)',
            }}
          >
            {item.highlight ? (
              <div style={{
                width: '44px', height: '44px', borderRadius: 'var(--radius-full)',
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', boxShadow: `0 4px 12px ${'var(--primary)'}40`,
                marginTop: '-20px',
                border: `3px solid ${'var(--white)'}`,
              }}>
                {item.icon}
              </div>
            ) : (
              <span style={{
                position: 'relative',
                fontSize: '20px',
                filter: active ? 'none' : 'grayscale(0.3)',
                transform: active ? 'scale(1.15)' : 'scale(1)',
                transition: 'var(--transition-fast)',
              }}>
                {item.icon}
                {showBadge && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-10px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: 'var(--rose)', border: '2px solid var(--white)',
                  }} />
                )}
              </span>
            )}
            <span style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: active ? 700 : 400,
              color: active ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition-fast)',
            }}>
              {item.label}
            </span>
            {active && !item.highlight && (
              <div style={{
                width: '4px', height: '4px', borderRadius: '50%',
                background: 'var(--primary)', marginTop: '-1px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
