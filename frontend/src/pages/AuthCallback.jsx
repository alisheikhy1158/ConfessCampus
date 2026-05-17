import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { FullPageLoader } from '../components/Loading';

/**
 * This page handles the redirect from Google OAuth.
 * The backend redirects to /auth/callback?token=xxx&refreshToken=xxx&user=xxx
 */
const AuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userRaw = searchParams.get('user');

    if (accessToken && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        login(user, accessToken, refreshToken || '');
        toast.success(`Welcome, ${user.name}!`);
        navigate('/feed', { replace: true });
      } catch {
        toast.error('Login failed. Please try again.');
        navigate('/login', { replace: true });
      }
    } else {
      toast.error('Authentication failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, []);

  return <FullPageLoader />;
};

export default AuthCallback;
