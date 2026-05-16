import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px',
      }}>
        <div className="fade-in-scale" style={{ textAlign: 'center', maxWidth: '480px' }}>
          {/* Animated 404 */}
          <div style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800,
            fontSize: '120px', lineHeight: 1,
            background: `linear-gradient(135deg, ${'var(--primary)'}, #9333EA, ${'var(--rose)'})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: '8px',
            letterSpacing: '-4px',
          }}>
            404
          </div>

          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🤫</div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
            color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.5px',
          }}>
            This page went incognito
          </h1>

          <p style={{
            fontSize: 'var(--text-base)', color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: '32px',
          }}>
            The page you're looking for doesn't exist, was removed, or maybe it was an anonymous post that's been taken down.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/feed')}
              style={{
                padding: '12px 28px', background: 'var(--primary)', color: 'var(--white)',
                borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)',
                boxShadow: `0 4px 16px ${'var(--primary)'}40`, transition: 'var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${'var(--primary)'}50`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 16px ${'var(--primary)'}40`; }}
            >
              🏠 Go to Feed
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '12px 28px', background: 'var(--white)', color: 'var(--text)',
                borderRadius: 'var(--radius-full)', border: `1.5px solid ${'var(--border)'}`,
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
                fontSize: 'var(--text-base)', transition: 'var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              ← Go Back
            </button>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: `1px solid ${'var(--border-light)'}` }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Quick links
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Confessions', path: '/feed?category=confession' },
                { label: 'Discussions', path: '/feed?category=discussion' },
                { label: 'Lost & Found', path: '/feed?category=lost-found' },
                { label: 'Carpool', path: '/feed?category=carpool' },
              ].map(link => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-muted)', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
