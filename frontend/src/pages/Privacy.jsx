import Layout from '../components/Layout';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{
      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)',
      color: 'var(--text)', marginBottom: '12px', paddingBottom: '10px',
      borderBottom: `2px solid ${'var(--primary-light)'}`,
    }}>{title}</h2>
    <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

const Privacy = () => (
  <Layout>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-light)',
        borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '40px',
        border: `1px solid ${'var(--primary-mid)'}`,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}></div>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
          color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.5px',
        }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Last updated: May 2026 · Effective immediately
        </p>
      </div>

      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-xl)',
        border: `1px solid ${'var(--border)'}`, padding: '40px', boxShadow: 'var(--shadow-sm)',
      }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
          At WhisperCampus, your privacy isn't just a feature — it's our core promise. This policy explains what data we collect, how we use it, and the extraordinary lengths we go to protect your anonymity.
        </p>

        <Section title="1. What We Collect">
          <p><strong style={{ color: 'var(--text)' }}>Account Information:</strong> When you sign up, we collect your name, email address, and username. For Google OAuth users, we receive your Google profile name and email.</p>
          <br />
          <p><strong style={{ color: 'var(--text)' }}>Post Content:</strong> The content, category, and metadata of posts you create. For anonymous posts, the link between your user account and the post is deliberately severed in our storage layer.</p>
          <br />
          <p><strong style={{ color: 'var(--text)' }}>Messages:</strong> Direct messages between users. Note: all messages are auto-deleted from our servers after 24 hours via a TTL database index.</p>
          <br />
          <p><strong style={{ color: 'var(--text)' }}>Usage Data:</strong> Standard server logs including IP addresses, browser type, and pages visited. These are retained for 30 days for security purposes only.</p>
        </Section>

        <Section title="2. Anonymity Architecture">
          <div style={{
            background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)',
            padding: '16px 20px', marginBottom: '16px',
            border: `1px solid ${'var(--primary-mid)'}`,
          }}>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
              Technical Anonymity Guarantee
            </p>
          </div>
          <p>When you toggle "Post Anonymously," our system deliberately does not store a direct reference from the post to your user ID in a way that is accessible through normal application queries. Anonymous posts return <code style={{ background: 'var(--bg-muted)', padding: '1px 6px', borderRadius: '4px', fontSize: 'var(--text-xs)' }}>null</code> for user information in all API responses.</p>
          <br />
          <p>Even our team cannot run a simple query to discover who wrote an anonymous post. We consider this a core product commitment, not just a policy.</p>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'To provide and improve the WhisperCampus service',
              'To authenticate your account and maintain session security',
              'To send important account-related notifications (not marketing)',
              'To moderate content and enforce community guidelines',
              'To analyze aggregate (non-personal) usage patterns for product improvement',
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="4. What We Never Do">
          {[
            'We never sell your personal data to advertisers or third parties',
            'We never display targeted advertising based on your personal data',
            'We never share your data with other students or users',
            'We never store anonymous post authorship in a retrievable format',
            'We never retain direct messages beyond the 24-hour auto-delete window',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              padding: '10px', borderRadius: 'var(--radius-sm)',
              background: i % 2 === 0 ? 'var(--bg-muted)' : 'transparent',
              marginBottom: '4px',
            }}>
              <span style={{ color: 'var(--success)', flexShrink: 0, fontWeight: 700 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </Section>

        <Section title="5. Data Retention">
          <p>Public posts are retained until you delete them or your account. Anonymous posts, once created, are stored without user attribution and remain until explicitly deleted via the post's delete option. Messages auto-delete after 24 hours. Account data is deleted within 30 days of account deletion.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to access, correct, or delete your personal data at any time. You can do this through Settings → Account, or by contacting <strong style={{ color: 'var(--primary)' }}>privacy@whispercampus.com</strong>. We respond to all requests within 30 days.</p>
        </Section>

        <Section title="7. Cookies">
          <p>We use only essential cookies necessary for authentication (JWT tokens stored in localStorage) and session management. We do not use tracking cookies or third-party analytics cookies.</p>
        </Section>

        <Section title="8. Contact">
          <p>For privacy questions or data requests, contact us at <strong style={{ color: 'var(--primary)' }}>privacy@whispercampus.com</strong>. For urgent safety concerns, use <strong style={{ color: 'var(--primary)' }}>safety@whispercampus.com</strong>.</p>
        </Section>
      </div>
    </div>
  </Layout>
);

export default Privacy;
