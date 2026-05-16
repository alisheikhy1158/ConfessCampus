import { useState } from 'react';
import Layout from '../components/Layout';
import { Input, Textarea, Button } from '../components/FormComponents';
import { useToast } from '../components/Toast';

const ContactCard = ({ emoji, title, desc, sub }) => (
  <div style={{
    padding: '24px', background: 'var(--white)', borderRadius: 'var(--radius-xl)',
    border: `1px solid ${'var(--border)'}`, boxShadow: 'var(--shadow-sm)',
  }}>
    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{emoji}</div>
    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text)', marginBottom: '4px' }}>{title}</h3>
    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '6px' }}>{desc}</p>
    {sub && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600 }}>{sub}</p>}
  </div>
);

const Contact = () => {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.length < 20) errs.message = 'Message too short (min 20 chars)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate send
    toast.success('Message sent! We\'ll get back to you within 24 hours 💜');
    setSent(true);
    setSubmitting(false);
  };

  const contactItems = [
    { emoji: '📧', title: 'Email Us', desc: 'For general inquiries and support', sub: 'support@whispercampus.com' },
    { emoji: '⚡', title: 'Response Time', desc: 'We typically respond within', sub: '24 hours on weekdays' },
    { emoji: '🔒', title: 'Privacy Concerns', desc: 'For privacy & data requests', sub: 'privacy@whispercampus.com' },
    { emoji: '🚨', title: 'Report Abuse', desc: 'To report urgent safety issues', sub: 'safety@whispercampus.com' },
  ];

  const faqs = [
    { q: 'Is my anonymity truly protected?', a: 'Yes. When you post anonymously, we strip all identifying information before storing. Not even our team can trace an anonymous post back to you.' },
    { q: 'How do I delete my account?', a: 'Go to Settings → Account → Delete Account. All your data, including anonymous posts, will be permanently removed.' },
    { q: 'Can I report a post?', a: 'Yes! Click the ⚑ flag icon on any post or comment. Our moderation team reviews all reports within 24 hours.' },
    { q: 'Why did my post get removed?', a: 'Posts are removed if they violate our community guidelines — hate speech, harassment, spam, or illegal content.' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${'var(--primary)'}, #9333EA)`,
        padding: '60px 24px', textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-3xl)',
          color: 'var(--white)', marginBottom: '12px', letterSpacing: '-0.5px',
        }}>
          📬 Get in Touch
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.82)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
          Have questions, concerns, or suggestions? We'd love to hear from you.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Contact cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '48px',
        }}>
          {contactItems.map(c => <ContactCard key={c.title} {...c} />)}
        </div>

        {/* Form + FAQ side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
          gap: '32px', alignItems: 'start',
        }}>
          {/* Form */}
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-2xl)',
            border: `1px solid ${'var(--border)'}`, boxShadow: 'var(--shadow-md)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: `1px solid ${'var(--border-light)'}`,
              background: 'var(--bg-muted)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
                Send a Message
              </h2>
            </div>
            <div style={{ padding: '24px' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text)', marginBottom: '8px' }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    style={{
                      marginTop: '20px', padding: '9px 20px', background: 'var(--primary-light)',
                      color: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-full)',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)',
                    }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input label="Your Name" name="name" value={form.name}
                    onChange={handleChange} placeholder="John Doe"
                    error={errors.name} required icon="👤" />
                  <Input label="Email" name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="john@university.edu"
                    error={errors.email} required icon="📧" />
                  <Input label="Subject" name="subject" value={form.subject}
                    onChange={handleChange} placeholder="What's this about?"
                    error={errors.subject} required />
                  <Textarea label="Message" name="message" value={form.message}
                    onChange={handleChange} placeholder="Tell us more..."
                    error={errors.message} required rows={5} maxLength={1000} />
                  <Button type="submit" fullWidth loading={submitting} size="lg">
                    Send Message 📬
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)',
              color: 'var(--text)', marginBottom: '20px',
            }}>
              ❓ Frequently Asked
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: 'var(--white)', borderRadius: 'var(--radius-xl)',
      border: `1px solid ${open ? 'var(--primary-mid)' : 'var(--border)'}`,
      overflow: 'hidden', transition: 'var(--transition-fast)',
      boxShadow: open ? 'var(--shadow-sm)' : 'none',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: open ? 'var(--primary-light)' : 'transparent',
          border: 'none', cursor: 'pointer', gap: '12px',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
          color: open ? 'var(--primary)' : 'var(--text)', textAlign: 'left',
          transition: 'var(--transition-fast)',
        }}
      >
        <span>{q}</span>
        <span style={{ flexShrink: 0, fontSize: '18px', transition: 'var(--transition-fast)', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div className="slide-down" style={{ padding: '0 20px 16px' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{a}</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
