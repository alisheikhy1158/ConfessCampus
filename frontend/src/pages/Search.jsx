import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/services';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import { SkeletonCard, EmptyState, ErrorState } from '../components/Loading';
import { debounce } from '../utils/helpers';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';
  const cat = searchParams.get('category') || '';

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(cat);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback(async (searchQuery, category, tagFilter) => {
    if (!searchQuery && !tagFilter) { setResults([]); setHasSearched(false); return; }
    setLoading(true); setError(''); setHasSearched(true);
    try {
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (category) filters.category = category;
      if (tagFilter) filters.tag = tagFilter;
      const data = await postsAPI.getAll(filters);
      setResults(data.posts || []);
    } catch (err) {
      setError(err.message || 'Search failed');
    }
    setLoading(false);
  }, []);

  const debouncedSearch = useCallback(debounce(doSearch, 400), [doSearch]);

  useEffect(() => {
    debouncedSearch(q, activeCategory, tag);
  }, [q, activeCategory, tag]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const params = {};
    if (val) params.q = val;
    if (activeCategory) params.category = activeCategory;
    if (tag) params.tag = tag;
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const params = {};
    if (q) params.q = q;
    if (cat) params.category = cat;
    if (tag) params.tag = tag;
    setSearchParams(params);
  };

  const clearTag = () => {
    const params = {};
    if (q) params.q = q;
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params);
    navigate(`/search${q ? `?q=${q}` : ''}`);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)',
            color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '6px',
          }}>
            🔍 Search
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Find posts, confessions, lost items, and carpools across campus
          </p>
        </div>

        {/* Search input */}
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-xl)',
          border: `1.5px solid ${'var(--border)'}`, boxShadow: 'var(--shadow-sm)',
          padding: '20px', marginBottom: '16px',
        }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '20px', pointerEvents: 'none',
            }}>🔍</span>
            <input
              value={query}
              onChange={handleQueryChange}
              placeholder="Search posts, keywords, topics..."
              autoFocus
              style={{
                width: '100%', padding: '14px 20px 14px 50px',
                border: `1.5px solid ${'var(--primary)'}`,
                borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-md)',
                fontFamily: 'var(--font-body)', color: 'var(--text)',
                background: 'var(--bg)', outline: 'none',
                boxShadow: `0 0 0 3px ${'var(--primary-light)'}`,
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSearchParams(tag ? { tag } : {}); }}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'var(--bg-muted)', border: 'none', borderRadius: 'var(--radius-full)',
                  width: '24px', height: '24px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: 'var(--text-muted)',
                }}
              >✕</button>
            )}
          </div>

          {/* Active tag filter */}
          {tag && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        </div>

        {/* Category filter */}
        <div style={{ marginBottom: '20px' }}>
          <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => doSearch(q, activeCategory, tag)} />
        ) : !hasSearched ? (
          <EmptyState
            emoji="🔍"
            title="Start searching"
            description="Type a keyword above to search across all posts and categories"
          />
        ) : results.length === 0 ? (
          <EmptyState
            emoji="😔"
            title="No results found"
            description={`No posts match "${q || tag}". Try different keywords or remove filters.`}
            action={
              <button
                onClick={() => { setQuery(''); setSearchParams({}); setActiveCategory(''); }}
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
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700,
              }}>{results.length}</span>
              result{results.length !== 1 ? 's' : ''} found
              {q && <span> for <strong>"{q}"</strong></span>}
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
