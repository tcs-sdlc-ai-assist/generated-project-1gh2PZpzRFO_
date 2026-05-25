import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

/* ──────────────────────────────────────────────
   Inline SVG icons for feature cards
   ────────────────────────────────────────────── */

function PenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Floating card component (CSS-only animation)
   ────────────────────────────────────────────── */

function FloatingPreviewCard() {
  return (
    <div className="relative">
      {/* Decorative glow behind the card */}
      <div className="absolute inset-0 rounded-2xl bg-white/20 blur-3xl" />

      {/* Main floating card */}
      <div
        className="relative rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-white/20"
        style={{
          animation: 'float 4s ease-in-out infinite',
        }}
      >
        {/* Mock blog post preview */}
        <div className="space-y-4">
          {/* Title skeleton */}
          <div className="h-5 w-3/4 rounded-md bg-stone-200" />
          {/* Excerpt lines */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="h-3 w-5/6 rounded bg-stone-100" />
            <div className="h-3 w-2/3 rounded bg-stone-100" />
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100" />
            <div className="space-y-1">
              <div className="h-2.5 w-20 rounded bg-stone-200" />
              <div className="h-2 w-14 rounded bg-stone-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes for the float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Feature card component
   ────────────────────────────────────────────── */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl bg-white p-8 ring-1 ring-stone-200 hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Latest post preview card
   ────────────────────────────────────────────── */

function PostPreviewCard({ post, session }) {
  const excerpt =
    post.content && post.content.length > 100
      ? post.content.slice(0, 100) + '…'
      : post.content || '';

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={session ? `/blog/${post.id}` : '/login'}
      className="block rounded-xl bg-white p-6 ring-1 ring-stone-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      <h3 className="text-lg font-semibold text-stone-900 mb-2 line-clamp-2">
        {post.title || 'Untitled'}
      </h3>
      {excerpt && (
        <p className="text-stone-600 text-sm mb-3 line-clamp-2">{excerpt}</p>
      )}
      <time className="text-xs text-stone-400" dateTime={post.createdAt}>
        {formattedDate}
      </time>
    </Link>
  );
}

/* ──────────────────────────────────────────────
   LandingPage (default export)
   ────────────────────────────────────────────── */

export default function LandingPage() {
  const [session, setSession] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    // Read session on mount
    setSession(getSession());

    // Read posts, sort by createdAt desc, take first 3
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatestPosts(sorted.slice(0, 3));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* ── Public Navbar ── */}
      <PublicNavbar />

      <main className="flex-1">
        {/* ════════════════════════════════════════
            HERO SECTION
            ════════════════════════════════════════ */}
        <section className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 flex items-center">
          <div className="max-w-6xl px-6 mx-auto py-24 md:py-32 lg:py-40 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* ── Left column ── */}
              <div className="lg:col-span-7">
                <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter text-white">
                  WriteSpace
                </h1>
                <p className="text-lg md:text-xl leading-relaxed text-white/80 mt-6 max-w-prose">
                  Your thoughts. Your space. Beautifully simple.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link
                    to={session ? '/blogs' : '/login'}
                    className="inline-flex items-center bg-white text-indigo-600 rounded-lg px-6 py-3 font-medium hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
                  >
                    Start Reading
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center bg-stone-900 text-stone-50 rounded-lg px-6 py-3 font-medium hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>

              {/* ── Right column: floating card ── */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-sm">
                  <FloatingPreviewCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES SECTION
            ════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-stone-50">
          <div className="max-w-6xl px-6 mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 text-center mb-12">
              Why WriteSpace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<PenIcon />}
                title="Write Freely"
                description="Create beautiful blog posts with our distraction-free editor. Just you and your words."
              />
              <FeatureCard
                icon={<LockIcon />}
                title="Private &amp; Local"
                description="Your data stays on your device. No servers, no tracking, complete privacy."
              />
              <FeatureCard
                icon={<ZapIcon />}
                title="Instant &amp; Fast"
                description="Lightning-fast page loads and instant navigation. Built with Vite for maximum speed."
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LATEST POSTS PREVIEW
            ════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl px-6 mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 text-center mb-12">
              Latest from the Blog
            </h2>

            {latestPosts.length === 0 ? (
              <p className="text-stone-500 text-center py-8 text-lg">
                No posts yet — check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestPosts.map((post) => (
                  <PostPreviewCard
                    key={post.id}
                    post={post}
                    session={session}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}