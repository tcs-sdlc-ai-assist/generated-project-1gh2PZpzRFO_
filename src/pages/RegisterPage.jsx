import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers, saveUser } from '../utils/storage';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // On mount, check if already authenticated — redirect to appropriate route
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
    setErrors({});
    setLoading(true);

    const newErrors = {};

    // 3a. All fields required
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required.';
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    }

    // 3b. Password and confirmPassword must match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // 3c. Username uniqueness: check getUsers() array AND hard-coded 'admin'
    if (username.trim()) {
      const trimmedUsername = username.trim();
      if (trimmedUsername === 'admin') {
        newErrors.username = 'This username is already taken.';
      } else {
        const users = getUsers();
        const exists = users.some(
          (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
        );
        if (exists) {
          newErrors.username = 'This username is already taken.';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // 4. On success — create user, save, set session, navigate
    const user = {
      id: crypto.randomUUID(),
      displayName: displayName.trim(),
      username: username.trim(),
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    saveUser(user);

    setSession({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: 'user',
    });

    navigate('/blogs', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-zoom-in">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-stone-900 text-center mb-6 tracking-tight">
          Create Account
        </h1>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Display Name Field */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className={`w-full px-3.5 py-2.5 rounded-lg border-0 ring-1
                         text-stone-900 placeholder:text-stone-400
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         transition-shadow duration-200 text-sm
                         ${errors.displayName ? 'ring-red-500 focus:ring-red-500' : 'ring-stone-300'}`}
            />
            {errors.displayName && (
              <p role="alert" className="text-red-600 text-sm mt-1 animate-fade-in">
                {errors.displayName}
              </p>
            )}
          </div>

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
              placeholder="Choose a username"
              autoComplete="username"
              className={`w-full px-3.5 py-2.5 rounded-lg border-0 ring-1
                         text-stone-900 placeholder:text-stone-400
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         transition-shadow duration-200 text-sm
                         ${errors.username ? 'ring-red-500 focus:ring-red-500' : 'ring-stone-300'}`}
            />
            {errors.username && (
              <p role="alert" className="text-red-600 text-sm mt-1 animate-fade-in">
                {errors.username}
              </p>
            )}
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
              placeholder="Create a password"
              autoComplete="new-password"
              className={`w-full px-3.5 py-2.5 rounded-lg border-0 ring-1
                         text-stone-900 placeholder:text-stone-400
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         transition-shadow duration-200 text-sm
                         ${errors.password ? 'ring-red-500 focus:ring-red-500' : 'ring-stone-300'}`}
            />
            {errors.password && (
              <p role="alert" className="text-red-600 text-sm mt-1 animate-fade-in">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`w-full px-3.5 py-2.5 rounded-lg border-0 ring-1
                         text-stone-900 placeholder:text-stone-400
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         transition-shadow duration-200 text-sm
                         ${errors.confirmPassword ? 'ring-red-500 focus:ring-red-500' : 'ring-stone-300'}`}
            />
            {errors.confirmPassword && (
              <p role="alert" className="text-red-600 text-sm mt-1 animate-fade-in">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:ring-offset-2 transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium
                       transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}