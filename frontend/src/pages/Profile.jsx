import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, postsAPI, messagesAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { validateProfile } from '../utils/validation';
import Layout from '../components/Layout';
import AvatarOrAnon from '../components/AvatarOrAnon';
import PostCard from '../components/PostCard';
import { Input, Textarea, Button } from '../components/FormComponents';
import { SkeletonCard, EmptyState, ErrorState, Spinner } from '../components/Loading';
import { useToast } from '../components/Toast';
import { formatTimeAgo } from '../utils/helpers';

const StatBadge = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--primary)' }}>{value}</div>
    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{label}</div>
  </div>
);

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  const toast = useToast();

  const isMe = currentUser?._id === userId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [sendingDM, setSendingDM] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true); setError('');
    try {
      const data = await usersAPI.getProfile(userId);
      setProfile(data.user);
      setEditForm({ name: data.user.name || '', bio: data.user.bio || '' });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    }
    setLoading(false);
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const data = await postsAPI.getUserPosts(userId);
      setPosts(data.posts || []);
    } catch {}
    setPostsLoading(false);
  };

  const handleSave = async () => {
    const errs = validateProfile(editForm);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    setSaving(true);
    try {
      const data = await usersAPI.updateProfile({
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
      });
      setProfile(data.user);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  const handleSendDM = async () => {
    if (!currentUser) { navigate('/login'); return; }
    setSendingDM(true);
    try {
      await messagesAPI.sendRequest(userId);
      toast.success('Chat request sent!');
      navigate('/messages');
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    }
    setSendingDM(false);
  };

  if (loading) return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner size={40} /></div></Layout>;
  if (error) return <Layout><ErrorState message={error} onRetry={fetchProfile} /></Layout>;
  if (!profile) return null;

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Profile card */}
        <div className="fade-in" style={{
          background: 'var(--white)', borderRadius: 'var(--radius-2xl)',
          border: `1px solid ${'var(--border)'}`, boxShadow: 'var(--shadow-md)',
          overflow: 'hidden', marginBottom: '24px',
        }}>
          {/* Cover banner */}
          <div style={{
            height: '120px',
            background: `linear-gradient(135deg, ${'var(--primary)'} 0%, #9333EA 50%, ${'var(--rose)'} 100%)`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            }} />
          </div>

          <div style={{ padding: '0 28px 28px' }}>
            {/* Avatar row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-36px', marginBottom: '16px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: 'var(--radius-full)',
                background: `linear-gradient(135deg, ${'var(--primary)'}, #9333EA)`,
                border: `4px solid ${'var(--white)'}`, boxShadow: 'var(--shadow-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)',
                color: 'var(--white)',
              }}>
                {profile.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '40px' }}>
                {isMe ? (
                  <Button
                    variant={editing ? 'secondary' : 'outline'}
                    onClick={() => { setEditing(!editing); setEditErrors({}); }}
                    icon={editing ? '✕' : '✏️'}
                  >
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                ) : (
                  currentUser && (
                    <Button onClick={handleSendDM} loading={sendingDM} icon="✉️">
                      Send Message
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Name & info */}
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <Input label="Name" name="name" value={editForm.name}
                  onChange={e => { setEditForm(p => ({ ...p, name: e.target.value })); }}
                  error={editErrors.name} required maxLength={60} />
                <Textarea label="Bio" name="bio" value={editForm.bio}
                  onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell people about yourself..."
                  maxLength={200} rows={3} error={editErrors.bio} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleSave} loading={saving}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--text)', marginBottom: '2px' }}>
                  {profile.name}
                </h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  @{profile.username}
                </p>
                {profile.bio && (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px' }}>
                    {profile.bio}
                  </p>
                )}
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  📅 Joined {joinDate}
                </p>
              </>
            )}

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '32px', marginTop: '20px',
              paddingTop: '20px', borderTop: `1px solid ${'var(--border-light)'}`,
            }}>
              <StatBadge value={posts.length} label="Posts" />
              <StatBadge
                value={posts.reduce((acc, p) => acc + (p.likesCount ?? 0), 0)}
                label="Likes Received"
              />
              <StatBadge
                value={posts.reduce((acc, p) => acc + (p.commentsCount ?? 0), 0)}
                label="Comments"
              />
            </div>
          </div>
        </div>

        {/* Posts section */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)',
            color: 'var(--text)', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            📝 Public Posts
            <span style={{
              fontSize: 'var(--text-xs)', padding: '3px 10px', borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600,
            }}>{posts.length}</span>
          </h2>

          {postsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              emoji="📭"
              title="No public posts yet"
              description={isMe ? "Create your first post to get started!" : "This user hasn't made any public posts."}
              action={isMe && (
                <Button onClick={() => navigate('/create')} icon="✏️">Create Post</Button>
              )}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {posts.filter(p => !p.isAnonymous).map(post => (
                <PostCard key={post._id} post={post} />
              ))}
              {posts.filter(p => !p.isAnonymous).length === 0 && (
                <EmptyState emoji="👤" title="Only anonymous posts" description="This user has only posted anonymously." />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
