import Layout from '../components/Layout';

const Section = ({ number, title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2 style={{
      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)',
      color: 'var(--text)', marginBottom: '12px', paddingBottom: '10px',
      borderBottom: `2px solid ${'var(--primary-light)'}`,
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <span style={{
        width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
        background: 'var(--primary-light)', color: 'var(--primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 'var(--text-xs)', fontWeight: 800, flexShrink: 0,
      }}>{number}</span>
      {title}
    </h2>
    <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

const Terms = () => (
  <Layout>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${'var(--primary-light)'}, ${'var(--rose-light)'})`,
        borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '40px',
        border: `1px solid ${'var(--primary-mid)'}`,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
          color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.5px',
        }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Last updated: May 2026 · Please read carefully before using WhisperCampus
        </p>
      </div>

      {/* Highlight box */}
      <div style={{
        background: 'var(--warning-light)', border: `1px solid #FDE68A`,
        borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '32px',
        display: 'flex', gap: '12px',
      }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>⚡</span>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.6 }}>
          <strong>TL;DR:</strong> Be kind, don't abuse the platform, respect anonymity, and don't post harmful content. By using WhisperCampus, you agree to these terms.
        </p>
      </div>

      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-xl)',
        border: `1px solid ${'var(--border)'}`, padding: '40px', boxShadow: 'var(--shadow-sm)',
      }}>
        <Section number="1" title="Acceptance of Terms">
          <p>By creating an account or using WhisperCampus ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of updated terms.</p>
        </Section>

        <Section number="2" title="Eligibility">
          <p>You must be at least 13 years of age to use WhisperCampus. By creating an account, you confirm you meet this requirement. The Service is intended for university and college students, though we do not technically restrict use to enrolled students.</p>
        </Section>

        <Section number="3" title="User Accounts">
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You may not share your account with others or create accounts on behalf of others.</li>
            <li>One person may maintain only one active account.</li>
            <li>You agree to provide accurate and truthful information during registration.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </Section>

        <Section number="4" title="Prohibited Content & Behavior">
          <p style={{ marginBottom: '12px' }}>You agree <strong style={{ color: 'var(--text)' }}>not</strong> to post, share, or engage in:</p>
          {[
            { icon: '🚫', text: 'Hate speech, racism, sexism, or discrimination based on any protected characteristic' },
            { icon: '🚫', text: 'Harassment, bullying, threats, or targeted abuse of individuals' },
            { icon: '🚫', text: 'Sexual or explicit content of any kind' },
            { icon: '🚫', text: 'Content involving minors in any inappropriate context' },
            { icon: '🚫', text: 'Doxxing or sharing private personal information of others without consent' },
            { icon: '🚫', text: 'Spam, phishing, or any form of deceptive content' },
            { icon: '🚫', text: 'Content that promotes self-harm, suicide, or dangerous activities' },
            { icon: '🚫', text: 'Impersonating other users, public figures, or WhisperCampus staff' },
            { icon: '🚫', text: 'Illegal content of any kind, including copyrighted material without authorization' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
              background: i % 2 === 0 ? 'var(--error-light)' : 'transparent', marginBottom: '4px',
            }}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 'var(--text-sm)' }}>{item.text}</span>
            </div>
          ))}
        </Section>

        <Section number="5" title="Anonymity & Privacy">
          <p>WhisperCampus provides anonymous posting features to protect sensitive expression. However, anonymity is not a license to engage in prohibited behavior. We reserve the right to cooperate with law enforcement when legally required, even for anonymous posts. By using anonymous features, you acknowledge this limitation.</p>
        </Section>

        <Section number="6" title="Content Ownership & License">
          <p>You retain ownership of all content you post. By posting on WhisperCampus, you grant us a non-exclusive, royalty-free license to display and distribute your content within the Service. You may delete your content at any time. We do not claim ownership over user-generated content.</p>
        </Section>

        <Section number="7" title="Moderation & Reporting">
          <p>We actively moderate content to maintain community standards. You can report posts, comments, or users using the in-app reporting tools. We review all reports and take action at our discretion. Repeated violations will result in permanent account suspension. We are not liable for content posted by users before moderation occurs.</p>
        </Section>

        <Section number="8" title="Messages & Direct Communication">
          <p>Direct messages require both users to consent via a request/accept system. Messages are automatically deleted from our servers after 24 hours. Do not use direct messages for commercial solicitation, harassment, or any prohibited activity. We reserve the right to review messages flagged by our safety systems.</p>
        </Section>

        <Section number="9" title="Limitation of Liability">
          <p>WhisperCampus is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed the amount you have paid us in the past 12 months (if any).</p>
        </Section>

        <Section number="10" title="Governing Law">
          <p>These Terms are governed by applicable law. Any disputes shall be resolved through binding arbitration rather than court proceedings, except for matters involving intellectual property rights or emergency injunctive relief.</p>
        </Section>

        <Section number="11" title="Contact">
          <p>For questions about these Terms, contact us at <strong style={{ color: 'var(--primary)' }}>legal@whispercampus.com</strong>. For urgent safety concerns, use <strong style={{ color: 'var(--primary)' }}>safety@whispercampus.com</strong>.</p>
        </Section>
      </div>
    </div>
  </Layout>
);

export default Terms;
