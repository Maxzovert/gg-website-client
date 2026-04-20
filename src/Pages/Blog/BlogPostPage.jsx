import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (_error) {
    return '';
  }
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch(`/api/blogs/${encodeURIComponent(slug || '')}`);
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load blog post');
        }
        if (!cancelled) {
          setPost(payload.data || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load this blog post.');
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!contentRef.current) return;
    const links = contentRef.current.querySelectorAll('a');
    links.forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('http://') || href.startsWith('https://')) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [post?.id]);

  const displayDate = useMemo(
    () => formatDate(post?.published_at || post?.created_at),
    [post?.published_at, post?.created_at],
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
          <FaArrowLeft aria-hidden />
          Back to blogs
        </Link>
        <p className="mt-8 text-center text-base text-red-600">{error || 'Blog post not found.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50/95 py-10 sm:py-14">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <img src={post.header_image_url || post.hero_image_url} alt={post.title} className="h-auto w-full object-cover" />

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            <FaArrowLeft aria-hidden />
            Back to blogs
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-stone-900 sm:text-4xl">{post.title}</h1>
          {displayDate ? <p className="mt-2 text-sm text-stone-500">{displayDate}</p> : null}
          {post.excerpt ? <p className="mt-4 text-base leading-relaxed text-stone-700">{post.excerpt}</p> : null}

          <div
            ref={contentRef}
            className="prose prose-stone mt-8 max-w-none prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.html_content || '' }}
          />

          {post.primary_link_url ? (
            <div className="mt-8 border-t border-stone-200 pt-6">
              <a
                href={post.primary_link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                {post.primary_link_label || 'Learn more'}
              </a>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
