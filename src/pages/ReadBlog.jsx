import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import { getAvatar } from '../components/Avatar';
import Navbar from '../components/Navbar';

/**
 * Formats an ISO date string into a human-readable "MMM DD, YYYY" format.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * ReadBlog — full post reading view at route /blog/:id.
 *
 * Displays the complete post with title, author avatar + name, formatted date,
 * and full content. Ownership-based controls: admins see Edit/Delete on all
 * posts; users see Edit/Delete only on their own posts; otherwise only a
 * "Back to All Posts" link is shown.
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const session = getSession();

  // ── Fetch post on mount ──────────────────────────────────────────────
  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id) ?? null;
    setPost(found);
    setLoading(false);
  }, [id]);

  // ── Delete handler ───────────────────────────────────────────────────
  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const posts = getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    savePosts(filtered);
    navigate('/blogs');
  };

  // ── Determine ownership / permissions ────────────────────────────────
  const isAdmin = session?.role === 'admin';
  const isOwner = session?.userId === post?.authorId;
  const canEdit = isAdmin || isOwner;
  const canDelete = isAdmin || isOwner;

  // ── Determine avatar role from authorId ──────────────────────────────
  const avatarRole = post?.authorId === 'admin' ? 'admin' : 'user';

  // ── Loading state ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-stone-500 text-sm">Loading post…</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Not-found state ──────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-xl p-10 md:p-14 ring-1 ring-stone-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-6">
              <svg
                className="w-8 h-8 text-stone-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-stone-900 mb-3">
              Post not found
            </h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
              The post you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Back to All Posts
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ── Post found — render full view ────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* ── Action buttons ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-stone-500 rounded-lg px-3 py-2 hover:bg-stone-100 hover:text-stone-700 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to All Posts
          </Link>

          {canEdit && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="inline-flex items-center gap-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                  />
                  <path d="m15 5 4 4" />
                </svg>
                Edit
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-100 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Post card ──────────────────────────────────────────────── */}
        <article className="bg-white rounded-xl p-8 md:p-12 ring-1 ring-stone-200 shadow-sm">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {post.title}
          </h1>

          {/* Author line */}
          <div className="flex items-center gap-3 mb-6">
            {getAvatar(avatarRole, 'md')}
            <div className="flex flex-col">
              <span className="text-stone-700 font-medium">
                {post.authorName}
              </span>
              <time
                dateTime={post.createdAt}
                className="text-stone-400 text-sm"
              >
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          {/* Content */}
          <div className="whitespace-pre-wrap text-base leading-relaxed text-stone-800">
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
}