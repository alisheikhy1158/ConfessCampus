import { apiRequest } from './config';
import { buildQueryString } from '../utils/helpers';

// ─── Auth ─────────────────────────────────────────────────────────────

export const authAPI = {
  signup: (data) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  refresh: (refreshToken) => apiRequest('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }),

  googleLogin: () => {
    window.location.href = 'http://localhost:8000/api/auth/google';
  },
};

// ─── Users ────────────────────────────────────────────────────────────

export const usersAPI = {
  getProfile: (userId) => apiRequest(`/users/${userId}`),

  updateProfile: (data) => apiRequest('/users/profile/update', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ─── Posts ────────────────────────────────────────────────────────────

export const postsAPI = {
  getAll: (filters = {}) => apiRequest(`/posts${buildQueryString(filters)}`),

  getOne: (postId) => apiRequest(`/posts/${postId}`),

  getUserPosts: (userId) => apiRequest(`/posts/user/${userId}`),

  create: (data) => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (postId, data) => apiRequest(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (postId) => apiRequest(`/posts/${postId}`, { method: 'DELETE' }),

  like: (postId) => apiRequest(`/posts/${postId}/like`, { method: 'POST' }),

  unlike: (postId) => apiRequest(`/posts/${postId}/unlike`, { method: 'POST' }),
};

// ─── Comments ─────────────────────────────────────────────────────────

export const commentsAPI = {
  getForPost: (postId) => apiRequest(`/comments/post/${postId}`),

  getOne: (commentId) => apiRequest(`/comments/${commentId}`),

  create: (data) => apiRequest('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (commentId, content) => apiRequest(`/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }),

  delete: (commentId) => apiRequest(`/comments/${commentId}`, { method: 'DELETE' }),
};

// ─── Messages ─────────────────────────────────────────────────────────

export const messagesAPI = {
  sendRequest: (recipientId) => apiRequest('/messages/request', {
    method: 'POST',
    body: JSON.stringify({ recipientId }),
  }),

  getRequests: () => apiRequest('/messages/requests'),

  acceptRequest: (requestId) => apiRequest(`/messages/request/${requestId}/accept`, { method: 'PUT' }),

  rejectRequest: (requestId) => apiRequest(`/messages/request/${requestId}/reject`, { method: 'PUT' }),

  getChats: () => apiRequest('/messages'),

  getMessages: (chatId) => apiRequest(`/messages/chat/${chatId}`),

  sendMessage: (chatId, content) => apiRequest(`/messages/chat/${chatId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  deleteMessage: (messageId) => apiRequest(`/messages/message/${messageId}`, { method: 'DELETE' }),
};

// ─── Reports ──────────────────────────────────────────────────────────

export const reportsAPI = {
  create: (data) => apiRequest('/reports/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getPending: () => apiRequest('/reports/pending'),

  getAll: () => apiRequest('/reports/all'),

  getStats: () => apiRequest('/reports/stats'),

  update: (reportId, data) => apiRequest(`/reports/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};
