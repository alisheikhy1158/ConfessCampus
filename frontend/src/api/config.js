const BASE_URL = 'http://localhost:8000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        config.headers = getAuthHeaders();
        const retryResponse = await fetch(url, config);
        if (!retryResponse.ok) {
          const err = await retryResponse.json();
          throw new Error(err.message || 'Request failed');
        }
        return retryResponse.json();
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return;
      }
    }

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || err.error || 'Request failed');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export default BASE_URL;
