import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api';
import { formatBlogListDate, stripHtmlForExcerpt } from '../../utils/blogListDisplay';

const LATEST_COUNT = 3;
const DEFAULT_HERO_IMAGE = 'https://via.placeholder.com/1200x630?text=Gawri+Ganga+Blog';

const cardClass =
  'flex h-full flex-col overflow-hidden rounded-2xl border-2 border-amber-300/85 bg-white shadow-[0_8px_24px_-6px_rgba(62,47,28,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_16px_36px_-10px_rgba(62,47,28,0.18)]';

const LatestPostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch('/api/blogs');
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load blogs');
        }
        if (!cancelled) {
          const list = Array.isArray(payload.data) ? payload.data : [];
          const sorted = [...list].sort((a, b) => {
            const da = new Date(a.published_at || a.created_at || 0).getTime();
            const db = new Date(b.published_at || b.created_at || 0).getTime();
            return db - da;
          });
          setPosts(sorted.slice(0, LATEST_COUNT));
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load posts right now.');
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(
    () =>
      posts.map((post) => {
        const rawExcerpt = post.excerpt || stripHtmlForExcerpt(post.html_content);
        const excerpt = rawExcerpt.length > 160 ? `${rawExcerpt.slice(0, 160)}...` : rawExcerpt;
        return {
          ...post,
          excerpt,
          displayDate: formatBlogListDate(post.published_at || post.created_at),
          heroUrl: post.hero_image_url || DEFAULT_HERO_IMAGE,
        };
      }),
    [posts],
  );

  if (!loading && !error && cards.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16 lg:py-20"
      aria-labelledby="latest-posts-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span
              className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-[#FFFAEB] shadow-md sm:mx-0 sm:h-16 sm:w-16"
              aria-hidden
            >
              <FaBookOpen className="text-2xl sm:text-3xl" />
            </span>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2
                id="latest-posts-heading"
                className="font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-[2rem]"
              >
                Latest posts
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
                Rituals, care guides, and stories from the Gawri Ganga journal—read the newest articles
                on Rudraksha, japa, and everyday sadhana.
              </p>
            </div>
          </div>
          <Link
            to="/blog"
            className="inline-flex w-full min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-stone-800 sm:w-auto sm:px-7 sm:py-3.5"
          >
            View all posts
            <FaArrowRight className="text-sm" aria-hidden />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center py-8">
            <Loader />
          </div>
        ) : error ? (
          <p className="mt-10 text-center text-sm font-medium text-red-600">{error}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {cards.map((post) => (
              <article key={post.id} className={`${cardClass} min-w-0`}>
                <Link to={`/blog/${post.slug}`} className="block min-w-0 shrink-0">
                  <img
                    src={post.heroUrl}
                    alt={post.title}
                    className="h-44 w-full max-w-full object-cover sm:h-52"
                    loading="lazy"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  {post.displayDate ? (
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      {post.displayDate}
                    </p>
                  ) : null}
                  <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold text-stone-900 sm:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">
                    {post.excerpt || 'Read the full article for more details.'}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Read more
                    <FaArrowRight className="text-xs" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPostsSection;
