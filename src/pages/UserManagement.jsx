import React, { useState, useEffect } from 'react';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);

  // ── Form state ──────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  // ── Feedback state ──────────────────────────────────────────────────
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // ── Load data on mount ──────────────────────────────────────────────
  useEffect(() => {
    setUsers(getUsers());
    setSession(getSession());
  }, []);

  // ── Refresh users from storage ──────────────────────────────────────
  const refreshUsers = () => {
    setUsers(getUsers());
  };

  // ── Validate form ───────────────────────────────────────────────────
  const validate = () => {
    const nextErrors = {};

    if (!displayName.trim()) {
      nextErrors.displayName = 'Display name is required.';
    }

    if (!username.trim()) {
      nextErrors.username = 'Username is required.';
    } else {
      // Uniqueness check: against hard-coded admin AND stored users
      const trimmed = username.trim();
      if (trimmed === 'admin') {
        nextErrors.username = 'Username "admin" is reserved.';
      } else {
        const existingUsers = getUsers();
        const duplicate = existingUsers.find(
          (u) => u.username.toLowerCase() === trimmed.toLowerCase()
        );
        if (duplicate) {
          nextErrors.username = 'A user with this username already exists.';
        }
      }
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (password.trim().length < 3) {
      nextErrors.password = 'Password must be at least 3 characters.';
    }

    if (!role) {
      nextErrors.role = 'Role is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ── Handle form submit ──────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    const newUser = {
      id: crypto.randomUUID(),
      displayName: displayName.trim(),
      username: username.trim(),
      password: password.trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    const currentUsers = getUsers();
    currentUsers.push(newUser);
    saveUsers(currentUsers);

    // Reset form
    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setErrors({});
    setSuccessMessage('User created successfully!');

    refreshUsers();
  };

  // ── Handle delete ───────────────────────────────────────────────────
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    if (!confirmed) return;

    const currentUsers = getUsers();
    const filtered = currentUsers.filter((u) => u.id !== id);
    saveUsers(filtered);
    refreshUsers();
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-stone-900 mb-8">
          User Management
        </h1>

        {/* ── Create User Form ──────────────────────────────────────── */}
        <section className="bg-white rounded-xl p-6 ring-1 ring-stone-200 mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Create New User
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Display Name */}
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
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (errors.displayName) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.displayName;
                        return next;
                      });
                    }
                  }}
                  placeholder="Jane Doe"
                  autoComplete="off"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 ring-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 ${
                    errors.displayName ? 'ring-red-400' : 'ring-stone-300'
                  }`}
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Username */}
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
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.username;
                        return next;
                      });
                    }
                  }}
                  placeholder="janedoe"
                  autoComplete="off"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 ring-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 ${
                    errors.username ? 'ring-red-400' : 'ring-stone-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.password;
                        return next;
                      });
                    }
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 ring-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 ${
                    errors.password ? 'ring-red-400' : 'ring-stone-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-stone-700 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (errors.role) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.role;
                        return next;
                      });
                    }
                  }}
                  className={`w-full rounded-lg px-4 py-2.5 text-sm text-stone-900 ring-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 bg-white ${
                    errors.role ? 'ring-red-400' : 'ring-stone-300'
                  }`}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button + success message */}
            <div className="mt-5 flex items-center gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Create User
              </button>

              {successMessage && (
                <p className="text-emerald-600 text-sm font-medium animate-fade-in">
                  {successMessage}
                </p>
              )}
            </div>
          </form>
        </section>

        {/* ── User List ──────────────────────────────────────────────── */}
        <section>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl ring-1 ring-stone-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Avatar
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Display Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Username
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Role
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Created
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-stone-400"
                    >
                      No registered users yet. Create one above.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      isCurrentUser={user.id === session?.userId}
                      isHardcodedAdmin={user.username === 'admin'}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="block md:hidden space-y-4">
            {users.length === 0 ? (
              <div className="bg-white rounded-xl p-8 ring-1 ring-stone-200 text-center text-sm text-stone-400">
                No registered users yet. Create one above.
              </div>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === session?.userId}
                  isHardcodedAdmin={user.username === 'admin'}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}