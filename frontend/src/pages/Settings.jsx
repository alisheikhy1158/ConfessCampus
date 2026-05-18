import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, authAPI } from '../api/services';
import { apiRequest } from '../api/config';
import { validateProfile } from '../utils/validation';
import Layout from '../components/Layout';
import { Input, Textarea, Button } from '../components/FormComponents';
import { useToast } from '../components/Toast';

const SectionCard = ({ title, subtitle, children }) => (
  <div style={{
    background: 'var(--white)', borderRadius: 'var(--radius-xl)',
    border: `1px solid ${'var(--border)'}`, boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden', marginBottom: '20px',
  }}>
    <div style={{
      padding: '18px 24px', borderBottom: `1px solid ${'var(--border-light)'}`,
      background: 'var(--bg-muted)',
    }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text)' }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>}
    </div>
    <div style={{ padding: '24px' }}>
      {children}
    </div>
  </div>
);

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passErrors, setPassErrors] = useState({});
  const [savingPass, setSavingPass] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSaveProfile = async () => {
    const errs = validateProfile(profileForm);
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }
    setSavingProfile(true);
    try {
      const data = await usersAPI.updateProfile({
        name: profileForm.name.trim(),
        bio: profileForm.bio.trim(),
      });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async () => {
    const errs = {};
    if (!passForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!passForm.newPassword) errs.newPassword = 'New password is required';
    else if (passForm.newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
    if (passForm.newPassword !== passForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length > 0) { setPassErrors(errs); return; }

    setSavingPass(true);
    try {
      await apiRequest('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        }),
      });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      setPassErrors({ currentPassword: err.message || 'Current password is incorrect' });
    }
    setSavingPass(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.username) {
      toast.error('Username doesn\'t match');
      return;
    }
    if (!window.confirm('This will permanently delete your account and all your data. Are you absolutely sure?')) return;
    setDeleting(true);
    try {
      await apiRequest('/users/delete', { method: 'DELETE' });
      logout();
      toast.info('Account deleted. Goodbye');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
    }
    setDeleting(false);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
            color: 'var(--text)', letterSpacing: '-0.5px',
          }}>
            ⚙️ Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            Manage your account preferences and privacy
          </p>
        </div>

        {/* Account info */}
        <SectionCard title="Account Info" subtitle="Your current account details">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: 'var(--radius-full)',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--white)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-base)',
              flexShrink: 0,
            }}>
              {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 'var(--text-base)' }}>{user?.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {user?.username ? '@' + user.username : user?.name} · {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Display Name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
              required
              maxLength={60}
              icon="✨"
            />
            <Textarea
              label="Bio"
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              placeholder="Tell people about yourself..."
              maxLength={200}
              rows={3}
              error={profileErrors.bio}
              hint="Max 200 characters"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleSaveProfile} loading={savingProfile} icon="">
                Save Profile
              </Button>
            </div>
          </div>
        </SectionCard>

        {/* Change password */}
        {!user?.googleId && (
          <SectionCard title="Change Password" subtitle="Update your password regularly to stay secure">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Current Password', name: 'currentPassword', key: 'current' },
                { label: 'New Password', name: 'newPassword', key: 'new' },
                { label: 'Confirm New Password', name: 'confirmPassword', key: 'confirm' },
              ].map(field => (
                <div key={field.name} style={{ position: 'relative' }}>
                  <Input
                    label={field.label}
                    name={field.name}
                    type={showPass[field.key] ? 'text' : 'password'}
                    value={passForm[field.name]}
                    onChange={e => {
                      setPassForm(prev => ({ ...prev, [field.name]: e.target.value }));
                      if (passErrors[field.name]) setPassErrors(prev => ({ ...prev, [field.name]: '' }));
                    }}
                    error={passErrors[field.name]}
                    icon=""
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                    style={{
                      position: 'absolute', right: '14px', top: '37px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '15px', color: 'var(--text-muted)',
                    }}
                  >
                    {showPass[field.key] ? 'Hide' : 'Show'}
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleChangePassword} loading={savingPass} icon="">
                  Update Password
                </Button>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Privacy */}
        <SectionCard title="Privacy & Anonymity" subtitle="How your data is used on WhisperCampus">
          {[
            { icon: '', text: 'Anonymous posts are fully de-identified — even we can\'t trace them back to you.' },
            { icon: '', text: 'Messages auto-delete after 24 hours from our servers.' },
            { icon: '', text: 'Anonymous posts never appear on your public profile.' },
            { icon: '', text: 'We don\'t sell your data to third parties. Ever.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', padding: '12px',
              borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)',
              marginBottom: i < 3 ? '10px' : 0,
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </SectionCard>

        {/* Danger zone */}
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-xl)',
          border: `1.5px solid ${'var(--error)'}30`,
          boxShadow: `0 0 0 1px ${'var(--error)'}10`,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 24px', borderBottom: `1px solid ${'var(--error)'}20`,
            background: 'var(--error-light)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--error)' }}>
              ⚠️ Danger Zone
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', opacity: 0.7, marginTop: '2px' }}>
              These actions are permanent and cannot be undone
            </p>
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              Deleting your account will permanently remove all your data, posts (public only — anonymous posts are already de-identified), and messages.
            </p>
            <Input
              label={`Type your username to confirm: @${user?.username}`}
              name="deleteConfirm"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={user?.username}
              icon="⚠️"
            />
            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                loading={deleting}
                disabled={deleteConfirm !== user?.username}
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
