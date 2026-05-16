import { useState, useCallback } from 'react';
import { postsAPI } from '../api/services';

const usePosts = (initialFilters = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const fetchPosts = useCallback(async (pageNum = 1, newFilters = filters, replace = true) => {
    if (pageNum === 1) setLoading(true);
    setError('');
    try {
      const data = await postsAPI.getAll({ ...newFilters, page: pageNum, limit: 10 });
      const newPosts = data.posts || [];
      setPosts(prev => replace || pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === 10);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    }
    setLoading(false);
  }, [filters]);

  const loadMore = () => {
    if (hasMore && !loading) fetchPosts(page + 1, filters, false);
  };

  const refresh = (newFilters) => {
    const f = newFilters ?? filters;
    if (newFilters) setFilters(newFilters);
    fetchPosts(1, f, true);
  };

  const updatePost = (postId, updates) => {
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, ...updates } : p));
  };

  const removePost = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  return { posts, loading, error, hasMore, page, fetchPosts, loadMore, refresh, updatePost, removePost };
};

export default usePosts;
