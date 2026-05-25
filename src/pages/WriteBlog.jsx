import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import Navbar from '../components/Navbar';

/**
 * WriteBlog — create (/write) and edit (/edit/:id) form for WriteSpace.
 *
 * Behaviour:
 *  - Guests are redirected to /login.
 *  - Create mode: generates a new post with UUID, createdAt, authorId,
 *    authorName from the session, saves to writespace_posts, then
 *    navigates to /blog/:newId.
 *  - Edit mode: pre-fills the form from the existing post, merges updates
 *    on save, and navigates to /blog/:id.
 *  - Ownership check: only the post author or an admin may edit.
 *  - Inline validation with role="alert" error messages.
 *  - Character counter below the Content textarea.
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const mode = id ? 'edit' : 'create';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Auth guard + edit-mode pre-fill ──────────────────────────────────
  useEffect(() => {
    const session = getSession();

    // 1. Guest guard
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    // 2. Edit mode: load post, verify ownership, pre-fill
    if (mode === 'edit') {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      // Post not found
      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      // Ownership check: admin can edit any; others only their own
      if (session.role !== 'admin' && post.authorId !== session.userId) {
        navigate('/blogs', { replace: true });
        return;
      }

      // Pre-fill form
      setTitle(post.title ?? '');
      setContent(post.content ?? '');
    }
  }, [id, mode, navigate]);

  // ── Validation ──────────────────────────────────────────────────────
  const validate = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!content.trim()) {
      setContentError('Content is required.');
      valid = false;
    } else {
      setContentError('');
    }

    return valid;
  };

  // ── Submit handler ───────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const session = getSession();
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (mode === 'create') {
      // Build new post
      const newPost = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName ?? session.username ?? 'Anonymous',
      };

      const posts = getPosts();
      posts.push(newPost);
      savePosts(posts);

      navigate(`/blog/${newPost.id}`, { replace: true });
    } else {
      // Edit mode: update existing post
      const posts = getPosts();
      const index = posts.findIndex((p) => p.id === id);

      if (index === -1) {
        navigate('/blogs', { replace: true });
        return;
      }

      posts[index] = {
        ...posts[index],
        title: title.trim(),
        content: content.trim(),
      };
      savePosts(posts);

      navigate(`/blog/${id}`, { replace: true });
    }
  };

  // ── Cancel handler ───────────────────────────────────────────────────
  const handleCancel = () => {
    navigate(-1);
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-8 ring-1 ring-stone-200 shadow-sm">
          <h1 className="text-2xl font-semibold text-stone-900 mb-6">
            {mode === 'edit' ? 'Edit Post' : 'Create New Post'}
          </h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* ── Title field ────────────────────────────────────────── */}
            <div>
              <label
                htmlFor="post-title"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError('');
                }}
                placeholder="Enter your post title"
                className={`w-full px-3.5 py-2.5 rounded-lg border-0 ring-1 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:outline-none transition-shadow duration-200 text-sm ${
                  titleError
                    ? 'ring-red-400 focus:ring-red-500'
                    : 'ring-stone-300 focus:ring-indigo-500'
                }`}
              />
              {titleError && (
                <p role="alert" className="text-red-600 text-sm mt-1.5 animate-fade-in">
                  {titleError}
                </p>
              )}
            </div>

            {/* ── Content field ──────────────────────────────────────── */}
            <div>
              <label
                htmlFor="post-content"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Content
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (contentError) setContentError('');
                }}
                placeholder="Write your post content…"
                rows={10}
                className={`w-full min-h-[256px] px-3.5 py-2.5 rounded-lg border-0 ring-1 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:outline-none transition-shadow duration-200 text-sm resize-y ${
                  contentError
                    ? 'ring-red-400 focus:ring-red-500'
                    : 'ring-stone-300 focus:ring-indigo-500'
                }`}
              />
              {/* Character counter */}
              <p className="text-sm text-stone-400 mt-1.5">
                {content.length} character{content.length !== 1 ? 's' : ''}
              </p>
              {contentError && (
                <p role="alert" className="text-red-600 text-sm mt-1.5 animate-fade-in">
                  {contentError}
                </p>
              )}
            </div>

            {/* ── Action buttons ─────────────────────────────────────── */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Saving…'
                  : mode === 'edit'
                    ? 'Update Post'
                    : 'Publish Post'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="ring-1 ring-stone-300 bg-white hover:bg-stone-50 text-stone-900 rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}