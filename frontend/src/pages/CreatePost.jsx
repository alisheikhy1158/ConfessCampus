const categoryMeta = {
  confession: { label: 'Confession', emoji: '', bg: 'var(--confession-bg)', text: 'var(--confession-text)', border: 'var(--confession-border)' },
  discussion: { label: 'Discussion', emoji: '', bg: 'var(--discussion-bg)', text: 'var(--discussion-text)', border: 'var(--discussion-border)' },
  'lost-found': { label: 'Lost & Found', emoji: '', bg: 'var(--lost-found-bg)', text: 'var(--lost-found-text)', border: 'var(--lost-found-border)' },
  carpool: { label: 'Carpool', emoji: '', bg: 'var(--carpool-bg)', text: 'var(--carpool-text)', border: 'var(--carpool-border)' },
};






import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/services';
import { validatePost } from '../utils/validation';
import Layout from '../components/Layout';
import { Input, Textarea, Select, Button, Toggle, TagInput } from '../components/FormComponents';
import { useToast } from '../components/Toast';

const CategoryCard = ({ catKey, meta, selected, onSelect }) => (
  <button
    onClick={() => onSelect(catKey)}
    style={{
      padding: '24px 16px', borderRadius: 'var(--radius-xl)', cursor: 'pointer',
      border: `2px solid ${selected ? meta.border : 'var(--border)'}`,
      background: selected ? meta.bg : 'var(--white)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
      transition: 'var(--transition-normal)', transform: selected ? 'translateY(-4px)' : 'none',
      boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      flex: 1, minWidth: '120px',
    }}
    onMouseEnter={e => { if (!selected) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } }}
    onMouseLeave={e => { if (!selected) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } }}
  >
    <span style={{ fontSize: '32px' }}>{meta.emoji}</span>
    <span style={{
      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)',
      color: selected ? meta.text : 'var(--text)',
    }}>{meta.label}</span>
    {selected && (
      <span style={{
        fontSize: 'var(--text-xs)', color: meta.text, fontWeight: 600,
        padding: '2px 10px', borderRadius: 'var(--radius-full)',
        background: `${meta.text}18`,
      }}>Selected</span>
    )}
  </button>
);

const CreatePost = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({
    title: '', content: '', isAnonymous: true, tags: [],
    itemType: '', itemDescription: '', location: '',
    departure: '', destination: '', departureTime: '', seatsAvailable: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setErrors({});
  };

  const handleNext = () => {
    if (!category) { toast.warning('Please select a category'); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    const errs = validatePost({ ...form, category });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        category,
        content: form.content.trim(),
        isAnonymous: form.isAnonymous,
      };

      if (category === 'discussion' || category === 'carpool') {
        payload.title = form.title.trim();
      }
      if (category === 'discussion') {
        payload.tags = form.tags;
      }
      if (category === 'lost-found') {
        payload.itemType = form.itemType;
        payload.location = form.location.trim();
        if (form.itemDescription) payload.itemDescription = form.itemDescription.trim();
      }
      if (category === 'carpool') {
        payload.departure = form.departure.trim();
        payload.destination = form.destination.trim();
        payload.departureTime = new Date(form.departureTime).toISOString();
        payload.seatsAvailable = Number(form.seatsAvailable);
      }

      const data = await postsAPI.create(payload);
      toast.success('Post created successfully');
      navigate(`/post/${data.post._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    }
    setSubmitting(false);
  };

  const minDateTime = new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <Layout>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button
            onClick={() => step === 2 ? setStep(1) : navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 'var(--text-sm)',
              marginBottom: '16px', padding: 0, fontFamily: 'var(--font-body)',
            }}
          >
            ← {step === 2 ? 'Back to category' : 'Back'}
          </button>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
            color: 'var(--text)', letterSpacing: '-0.5px',
          }}>
            {step === 1 ? 'Create a Post' : `New ${categoryMeta[category]?.label}`}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            {step === 1 ? 'Choose what kind of post you want to make' : 'Fill in the details below'}
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
                  background: s <= step ? 'var(--primary)' : 'var(--bg-muted)',
                  color: s <= step ? 'var(--white)' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-xs)', fontWeight: 700, fontFamily: 'var(--font-heading)',
                  transition: 'var(--transition-fast)',
                }}>{s}</div>
                <span style={{
                  fontSize: 'var(--text-xs)', color: s <= step ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: s === step ? 600 : 400,
                }}>
                  {s === 1 ? 'Category' : 'Details'}
                </span>
                {s < 2 && <div style={{ width: '32px', height: '2px', background: step > s ? 'var(--primary)' : 'var(--border)', borderRadius: '1px' }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-2xl)',
          border: `1px solid ${'var(--border)'}`, boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}>
          {step === 1 ? (
            <div style={{ padding: '32px' }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
                What type of post is this?
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {Object.entries(categoryMeta).map(([key, meta]) => (
                  <CategoryCard key={key} catKey={key} meta={meta}
                    selected={category === key} onSelect={handleCategorySelect} />
                ))}
              </div>

              {category && (
                <div className="slide-down" style={{
                  marginTop: '20px', padding: '14px 16px',
                  background: categoryMeta[category].bg, borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${categoryMeta[category].border}`,
                }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: categoryMeta[category].text, fontWeight: 600 }}>
                    {categoryMeta[category].emoji}{' '}
                    {category === 'confession' && 'Your identity stays completely hidden.'}
                    {category === 'discussion' && 'Start a conversation. Mark it solved when answered.'}
                    {category === 'lost-found' && 'Report a lost or found item to help reunite it.'}
                    {category === 'carpool' && 'Share a ride and split costs with fellow students.'}
                  </p>
                </div>
              )}

              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleNext} disabled={!category} size="lg" icon="→">
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Confession */}
              {category === 'confession' && (
                <Textarea
                  label="Your Confession"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Share what's on your mind... this is a safe space 💜"
                  error={errors.content}
                  required
                  maxLength={1000}
                  rows={6}
                  hint="Your identity will be completely hidden"
                />
              )}

              {/* Discussion */}
              {category === 'discussion' && (
                <>
                  <Input label="Title" name="title" value={form.title}
                    onChange={handleChange}
                    placeholder="What's your question or topic?"
                    error={errors.title} required maxLength={100} />
                  <Textarea label="Details" name="content" value={form.content}
                    onChange={handleChange}
                    placeholder="Provide more context or details..."
                    error={errors.content} required maxLength={1000} rows={5} />
                  <TagInput label="Tags" tags={form.tags}
                    onTagsChange={tags => setForm(prev => ({ ...prev, tags }))}
                    maxTags={5} placeholder="react, campus, help..." />
                </>
              )}

              {/* Lost & Found */}
              {category === 'lost-found' && (
                <>
                  <Select
                    label="Item Status"
                    name="itemType"
                    value={form.itemType}
                    onChange={handleChange}
                    placeholder="Select status"
                    options={[
                      { value: 'lost', label: '❌ I Lost Something' },
                      { value: 'found', label: '✅ I Found Something' },
                    ]}
                    error={errors.itemType}
                    required
                  />
                  <Input label="Location" name="location" value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Library G-08, Main Gate..."
                    icon="📍" error={errors.location} />
                  <Textarea label="Description" name="itemDescription"
                    value={form.itemDescription} onChange={handleChange}
                    placeholder="Describe the item — color, size, unique features..."
                    maxLength={300} rows={3} error={errors.itemDescription} />
                  <Textarea label="Additional Info" name="content" value={form.content}
                    onChange={handleChange}
                    placeholder="When did you lose/find it? Any other details..."
                    error={errors.content} required maxLength={1000} rows={4} />
                </>
              )}

              {/* Carpool */}
              {category === 'carpool' && (
                <>
                  <Input label="Title" name="title" value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Ride to Downtown this Friday"
                    error={errors.title} required maxLength={100} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input label="From (Departure)" name="departure" value={form.departure}
                      onChange={handleChange} placeholder="University Gate A"
                      icon="📍" error={errors.departure} required />
                    <Input label="To (Destination)" name="destination" value={form.destination}
                      onChange={handleChange} placeholder="City Center Mall"
                      icon="🏁" error={errors.destination} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input label="Departure Time" name="departureTime"
                      type="datetime-local" value={form.departureTime}
                      onChange={handleChange} error={errors.departureTime} required
                      style={{ min: minDateTime }}
                    />
                    <Input label="Seats Available" name="seatsAvailable"
                      type="number" value={form.seatsAvailable}
                      onChange={handleChange} placeholder="3"
                      icon="💺" error={errors.seatsAvailable} required />
                  </div>
                  <Textarea label="Details" name="content" value={form.content}
                    onChange={handleChange}
                    placeholder="Route details, contact info, cost sharing info..."
                    error={errors.content} required maxLength={1000} rows={4} />
                </>
              )}

              {/* Anonymous Toggle */}
              <Toggle
                label={`Post ${form.isAnonymous ? 'Anonymously 👤' : 'Publicly 😊'}`}
                checked={form.isAnonymous}
                onChange={val => setForm(prev => ({ ...prev, isAnonymous: val }))}
                description={form.isAnonymous
                  ? 'Your name and profile will be hidden from everyone'
                  : 'Your profile will be visible on this post'}
              />

              {/* Submit */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={handleSubmit} loading={submitting} size="lg">
                  Publish Post 🚀
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
