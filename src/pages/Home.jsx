import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';

/**
 * Home — authenticated blog list page for WriteSpace at route /blogs.
 *
 * Reads posts from localStorage via getPosts(), sorts newest-first by
 * createdAt, and renders a responsive grid of BlogCards. Admins and the
 * post author see an edit affordance. An empty state with a CTA to /write
 * is shown when no posts exist.
 */
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPosts = getPosts();
    const storedSession = getSession();

    // Sort newest first
    const sorted = [...storedPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setPosts(sorted);
    setSession(storedSession);
    setLoading(false);
  }, []);

  // ── Empty state ──────────────────────────────────────────────────────
  if (!loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-8">
            All Blogs
          </h1>

          <div className="py-16 text-center">
            {/* File-text icon */}
            <svg
              className="w-16 h-16 mx-auto text-stone-300"
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>

            <h2 className="text-2xl font-semibold text-stone-900 mt-4">
              No blogs yet
            </h2>
            <p className="text-base text-stone-500 mt-2">
              Be the first to write one!
            </p>

            <Link
              to="/write"
              className="inline-block mt-6 bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Write your first post
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ── Loading skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-8">
            All Blogs
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-6 md:p-8 ring-1 ring-stone-200 animate-pulse"
              >
                <div className="h-1 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-4 rounded-t-xl bg-stone-200" />
                <div className="h-6 bg-stone-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-stone-100 rounded w-full mb-2" />
                <div className="h-4 bg-stone-100 rounded w-5/6 mb-2" />
                <div className="h-4 bg-stone-100 rounded w-2/3 mb-4" />
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-200" />
                    <div className="h-3 bg-stone-200 rounded w-20" />
                  </div>
                  <div className="h-3 bg-stone-100 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── Posts grid ───────────────────────────────────────────────────────
  const isAdmin = session?.role === 'admin';

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-8">
          All Blogs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              showEdit={isAdmin || session?.userId === post.authorId}
            />
          ))}
        </div>
      </main>
    </div>
  );
}