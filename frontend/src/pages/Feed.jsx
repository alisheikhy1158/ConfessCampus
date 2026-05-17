const categoryMeta = {
  confession: { label: 'Confession', emoji: '', bg: 'var(--confession-bg)', text: 'var(--confession-text)', border: 'var(--confession-border)' },
  discussion: { label: 'Discussion', emoji: '', bg: 'var(--discussion-bg)', text: 'var(--discussion-text)', border: 'var(--discussion-border)' },
  'lost-found': { label: 'Lost & Found', emoji: '', bg: 'var(--lost-found-bg)', text: 'var(--lost-found-text)', border: 'var(--lost-found-border)' },
  carpool: { label: 'Carpool', emoji: '', bg: 'var(--carpool-bg)', text: 'var(--carpool-text)', border: 'var(--carpool-border)' },
};






import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postsAPI } from '../api/services';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import { SkeletonCard, EmptyState, ErrorState } from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const TrendingTags = ({ onTagClick }) => {
  const tags = ['react', 'finals', 'carpool', 'campus', 'lostkeys', 'confession', 'internship', 'housing', 'study', 'football'];
  return (
    <div style={{
      background: 'var(--white)', borderRadius: 'var(--radius-xl)',
      border: `1px solid ${'var(--border)'}`, padding: '20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)',
        color: 'var(--text)', marginBottom: '14px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        Trending Tags
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            style={{
              padding: '5px 12px', borderRadius: 'var(--radius-full)',
              background: 'var(--bg-muted)', border: 'none', cursor: 'pointer',
              color: 'var(--primary)', fontSize: 'var(--text-xs)', fontWeight: 600,
              fontFamily: 'var(--font-body)', transition: 'var(--transition-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-muted)'}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

const CategoryQuickLinks = ({ active, onChange }) => {
  const cats = Object.entries(categoryMeta);
  return (
    <div style={{
      background: 'var(--white)', borderRadius: 'var(--radius-xl)',
      border: `1px solid ${'var(--border)'}`, padding: '20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)',
        color: 'var(--text)', marginBottom: '14px',
      }}>Browse Categories</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {cats.map(([key, meta]) => (
          <button
            key={key}
            onClick={() => onChange(active === key ? '' : key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: 'var(--radius-md)',
              background: active === key ? meta.bg : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              color: active === key ? meta.text : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
              fontWeight: active === key ? 600 : 400, transition: 'var(--transition-fast)',
            }}
            onMouseEnter={e => { if (active !== key) e.currentTarget.style.background = 'var(--bg-muted)'; }}
            onMouseLeave={e => { if (active !== key) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '18px' }}>{meta.emoji}</span>
            <span>{meta.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const CampusTip = () => {
  const tips = [
    'Anonymous posts fully protect your identity',
    'Share a carpool and save on commute costs',
    'Lost something? Post it — someone might have it!',
    'Ask anything — the campus community helps',
  ];
  const tip = tips[Math.floor(Date.now() / 86400000) % tips.length];
  return (
    <div style={{
      background: 'var(--bg-light)',
      borderRadius: 'var(--radius-xl)', padding: '16px 18px',
      border: `1px solid ${'var(--primary-mid)'}`,
    }}>
      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
        Info
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.5 }}>{tip}</p>
    </div>
  );
};

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const category = searchParams.get('category') || '';
  const observerRef = useRef();
  const sentinelRef = useRef();

  const fetchPosts = useCallback(async (pageNum = 1, cat = category, replace = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError('');
    try {
      const filters = { page: pageNum, limit: 10 };
      if (cat) filters.category = cat;
      const data = await postsAPI.getAll(filters);
      const newPosts = data.posts || [];
      setPosts(prev => replace || pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === 10);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    }
    setLoading(false);
    setLoadingMore(false);
  }, [category]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, category, true);
  }, [category]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPosts(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, page]);

  const handleCategoryChange = (cat) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const handleTagClick = (tag) => navigate(`/search?tag=${tag}`);

  return (
    <Layout>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: '24px',
        }}>
          {/* Desktop 3-col layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? '220px minmax(0,1fr) 240px' : '1fr',
            gap: '24px',
            alignItems: 'start',
          }}>
            {/* Left sidebar */}
            <aside className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '88px' }}>
              <CategoryQuickLinks active={category} onChange={handleCategoryChange} />
              <CampusTip />
            </aside>

            {/* Main feed */}
            <main>
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
              }}>
                <div>
                  <h1 style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)',
                    color: 'var(--text)', letterSpacing: '-0.5px',
                  }}>
                    {category ? categoryMeta[category]?.label : 'Campus Feed'}
                  </h1>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {category ? `Browse all ${categoryMeta[category]?.label?.toLowerCase()} posts` : 'All posts from your campus community'}
                  </p>
                </div>
                {user && (
                  <button
                    onClick={() => navigate('/create')}
                    style={{
                      padding: '10px 20px', background: 'var(--primary)', color: 'var(--white)',
                      borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontWeight: 600,
                      fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: `0 4px 14px ${'var(--primary)'}40`, transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    New Post
                  </button>
                )}
              </div>

              {/* Category filter bar */}
              <div style={{ marginBottom: '20px' }}>
                <CategoryFilter active={category} onChange={handleCategoryChange} />
              </div>

              {/* Posts */}
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : error ? (
                <ErrorState message={error} onRetry={() => fetchPosts(1, category, true)} />
              ) : posts.length === 0 ? (
                <EmptyState
                  title="No posts yet"
                  description={category ? `Be the first to post in ${categoryMeta[category]?.label}!` : 'The feed is empty. Be the first to post!'}
                  action={user && (
                    <button
                      onClick={() => navigate('/create')}
                      style={{
                        padding: '10px 22px', background: 'var(--primary)', color: 'var(--white)',
                        border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)',
                      }}
                    >
                      Create First Post
                    </button>
                  )}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))}

                  {/* Infinite scroll sentinel */}
                  <div ref={sentinelRef} style={{ height: '20px' }} />

                  {loadingMore && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  )}

                  {!hasMore && posts.length > 0 && (
                    <div style={{
                      textAlign: 'center', padding: '24px',
                      color: 'var(--text-muted)', fontSize: 'var(--text-sm)',
                    }}>
                      You've seen all posts!
                    </div>
                  )}
                </div>
              )}
            </main>

            {/* Right sidebar */}
            <aside className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '88px' }}>
              <TrendingTags onTagClick={handleTagClick} />
              <div style={{
                background: 'var(--primary)',
                borderRadius: 'var(--radius-xl)', padding: '20px', color: 'var(--white)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}></div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-base)', marginBottom: '8px' }}>
                  Anonymous Posts
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85, lineHeight: 1.6 }}>
                  Share your thoughts without revealing your identity. 100% private.
                </p>
                {user && (
                  <button
                    onClick={() => navigate('/create')}
                    style={{
                      marginTop: '14px', padding: '9px 18px',
                      background: 'rgba(255,255,255,0.2)', color: 'var(--white)',
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      borderRadius: 'var(--radius-full)', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-xs)',
                      width: '100%', transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  >
                    Confess Anonymously
                  </button>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      {user && (
        <button
          className="hide-desktop"
          onClick={() => navigate('/create')}
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            width: '56px', height: '56px', borderRadius: 'var(--radius-full)',
            background: 'var(--primary)',
            color: 'var(--white)', fontSize: '24px', border: 'none',
            cursor: 'pointer', boxShadow: 'var(--shadow-xl)', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ✏️
        </button>
      )}
    </Layout>
  );
};

export default Feed;
