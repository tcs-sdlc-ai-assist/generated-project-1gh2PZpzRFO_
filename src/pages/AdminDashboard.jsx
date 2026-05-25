import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getUsers } from '../utils/storage';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchedPosts = getPosts();
    const fetchedUsers = getUsers();
    setPosts(fetchedPosts);
    setUsers(fetchedUsers);
    setLoading(false);
  }, []);

  // ── Computed stats ──────────────────────────────────────────────────
  const totalPosts = posts.length;
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── Date formatter ──────────────────────────────────────────────────
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* ── Gradient header ─────────────────────────────────────────── */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            Manage your blog and users
          </p>
        </div>
      </header>

      {/* ── Stat cards (bento grid, overlaps header) ─────────────────── */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            value={loading ? '—' : totalPosts}
            label="Total Posts"
            icon="📝"
            bgColor="bg-indigo-500"
          />
          <StatCard
            value={loading ? '—' : totalUsers}
            label="Total Users"
            icon="👥"
            bgColor="bg-violet-500"
          />
          <StatCard
            value={loading ? '—' : totalAdmins}
            label="Admins"
            icon="👑"
            bgColor="bg-pink-500"
          />
          <StatCard
            value={loading ? '—' : totalUsers}
            label="Total Users"
            icon="👥"
            bgColor="bg-teal-500"
          />
        </div>
      </section>

      {/* ── Quick actions ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/write"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Write New Post
          </Link>
          <Link
            to="/users"
            className="inline-flex items-center gap-2 bg-white text-stone-900 ring-1 ring-stone-300 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            Manage Users
          </Link>
        </div>
      </section>

      {/* ── Recent posts ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          Recent Posts
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 ring-1 ring-stone-200 animate-pulse"
              >
                <div className="h-5 bg-stone-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-stone-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 ring-1 ring-stone-200 text-center">
            <svg
              className="w-12 h-12 text-stone-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-stone-500 text-lg">No posts yet</p>
            <p className="text-stone-400 text-sm mt-1">
              Create your first post to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-4 ring-1 ring-stone-200 flex items-center justify-between hover:shadow-md hover:ring-stone-300 transition-shadow duration-200"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-stone-900 truncate">
                    {post.title || 'Untitled'}
                  </p>
                  <p className="text-sm text-stone-400 mt-0.5">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                <Link
                  to={`/edit/${post.id}`}
                  className="shrink-0 text-indigo-600 text-sm font-medium hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 transition-colors duration-200"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}