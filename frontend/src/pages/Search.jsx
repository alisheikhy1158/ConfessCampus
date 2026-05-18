import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsAPI } from '../api/services';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import { SkeletonCard, EmptyState, ErrorState } from '../components/Loading';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const fetchResults = useCallback(async (category, tagFilter) => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (category) filters.category = category;
      if (tagFilter) filters.tag = tagFilter;
      const data = await postsAPI.getAll(filters);
      setResults(data.posts || []);
    } catch (err) {
      setError(err.message || 'Search failed');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResults(activeCategory, tag);
  }, [activeCategory, tag, fetchResults]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const params = {};
    if (category) params.category = category;
    if (tag) params.tag = tag;
    setSearchParams(params);
  };

  const clearTag = () => {
    const params = {};
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
            color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '6px',
          }}>
            Search Results
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Filter posts, confessions, lost items, and carpools across campus
          </p>
        </div>

        {tag && (
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Filtering by tag:</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)', color: 'var(--primary)',
              fontSize: 'var(--text-xs)', fontWeight: 600,
            }}>
              #{tag}
              <button onClick={clearTag} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--primary)', fontSize: '12px', padding: '0 2px',
              }}>×</button>
            </span>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchResults(activeCategory, tag)} />
        ) : results.length === 0 ? (
          <EmptyState
            emoji=""
            title="No results found"
            description="Try a different filter or remove the selected tag."
            action={
              <button
                onClick={() => { setActiveCategory(''); setSearchParams({}); }}
                style={{
                  padding: '9px 20px', background: 'var(--primary)', color: 'var(--white)',
                  border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)',
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div>
            <p style={{
              fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '14px',
              display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
            }}>
              <span style={{
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700,
              }}>{results.length}</span>
              result{results.length !== 1 ? 's' : ''} found
              {activeCategory && <span> in <strong>{activeCategory.replace('-', ' ')}</strong></span>}
              {tag && <span> tagged <strong>#{tag}</strong></span>}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {results.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
