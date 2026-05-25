import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

export default function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-stone-900 hover:text-stone-700 transition-colors"
        >
          WriteSpace
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!session ? (
            <>
              {/* Guest: Login + Get Started */}
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-stone-700 bg-transparent rounded-lg hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-stone-50 bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Logged in: Avatar chip + displayName + Dashboard */}
              <div className="flex items-center gap-2">
                {getAvatar(session.role, 'sm')}
                <span className="text-sm font-medium text-stone-700 hidden sm:inline">
                  {session.displayName}
                </span>
              </div>
              <Link
                to={session.role === 'admin' ? '/admin' : '/blogs'}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}