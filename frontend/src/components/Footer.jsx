import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'WhisperCampus',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Browse Feed', to: '/feed' },
        { label: 'Confessions', to: '/feed?category=confession' },
        { label: 'Discussions', to: '/feed?category=discussion' },
        { label: 'Lost & Found', to: '/feed?category=lost-found' },
        { label: 'Carpools', to: '/feed?category=carpool' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign Up', to: '/signup' },
        { label: 'Login', to: '/login' },
        { label: 'Messages', to: '/messages' },
      ],
    },
  ];

  return (
    <footer style={{
      background: 'var(--text)',
      color: 'var(--white)',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '60px 24px 32px',
      }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px', marginBottom: '48px',
        }}>
          {/* Brand col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px',
              }}></div>
              <span style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)',
                color: 'var(--white)',
              }}>
                Whisper<span style={{ color: 'var(--primary-mid)' }}>Campus</span>
              </span>
            </div>
            <p style={{
              fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7, maxWidth: '220px',
            }}>
              Your campus, unfiltered. Share, connect, and confess — anonymously or not.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {/* Social links empty */}
            </div>
          </div>

          {/* Link sections */}
          {sections.map(section => (
            <div key={section.title}>
              <h4 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)',
                color: 'var(--white)', marginBottom: '16px', textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>{section.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.to)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-body)', transition: 'var(--transition-fast)',
                        padding: 0, textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                    >{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '24px' }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '12px',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>
            © 2026 WhisperCampus. Made for university students.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>
            Your anonymity is protected. Always.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
