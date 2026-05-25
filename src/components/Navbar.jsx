import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Navbar — authenticated navigation bar for WriteSpace.
 *
 * Sticky top-0 bar with role-based nav links, avatar chip with dropdown,
 * and mobile hamburger toggle. Shown on all authenticated pages.
 */
export default function Navbar() {
  const session = getSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = session?.role;
  const displayName = session?.displayName ?? 'User';

  // ── Nav links by role ──────────────────────────────────────────────
  const navLinks = [
    { to: '/blogs', label: 'All Blogs' },
    { to: '/write', label: 'Write' },
  ];

  if (role === 'admin') {
    navLinks.push(
      { to: '/admin', label: 'Dashboard' },
      { to: '/users', label: 'Users' },
    );
  }

  // ── Link class resolver ────────────────────────────────────────────
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
    }`;

  // ── Logout handler ─────────────────────────────────────────────────
  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between h-16">
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-stone-900 shrink-0"
        >
          WriteSpace
        </Link>

        {/* ── Desktop nav links ────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ── Avatar chip + dropdown (desktop) ─────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-stone-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              {getAvatar(role, 'sm')}
              <span className="text-sm font-medium text-stone-700 hidden lg:inline">
                {displayName}
              </span>
              {/* ChevronDown SVG */}
              <svg
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop to catch outside clicks */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white ring-1 ring-stone-200 shadow-lg py-1 z-50 animate-fade-in">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors duration-150 rounded-lg mx-1"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile hamburger toggle ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {/* Menu (hamburger) SVG — 3 lines */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {mobileOpen ? (
              /* X icon when open */
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              /* Hamburger icon when closed */
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 12h16"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 18h16"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden pb-4 border-t border-stone-100 pt-2 animate-slide-in-from-top">
          <div className="max-w-7xl px-6 mx-auto flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                end
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile avatar + logout row */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                {getAvatar(role, 'sm')}
                <span className="text-sm font-medium text-stone-700">
                  {displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}