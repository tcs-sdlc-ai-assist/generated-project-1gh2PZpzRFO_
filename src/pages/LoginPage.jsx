import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // On mount, check if already authenticated — redirect to home route
  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    // 1. Hard-coded admin check
    if (username === 'admin' && password === 'admin') {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      navigate('/admin', { replace: true });
      return;
    }

    // 2. Check registered users in localStorage
    const users = getUsers();
    const matchedUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (matchedUser) {
      setSession({
        userId: matchedUser.id,
        username: matchedUser.username,
        displayName: matchedUser.displayName,
        role: matchedUser.role,
      });
      navigate('/blogs', { replace: true });
    } else {
      setError('Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-zoom-in">
        {/* Logo / Title */}
        <h1 className="text-2xl font-semibold text-stone-900 text-center mb-6 tracking-tight">
          WriteSpace
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              className="w-full px-3.5 py-2.5 rounded-lg border-0 ring-1 ring-stone-300
                         text-stone-900 placeholder:text-stone-400
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         transition-shadow duration-200 text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-lg border-0 ring-1 ring-stone-300
                         text-stone-900 placeholder:text-stone-400
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         transition-shadow duration-200 text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="text-red-600 text-sm font-medium animate-fade-in"
            >
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:ring-offset-2 transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-medium
                       transition-colors duration-200"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}