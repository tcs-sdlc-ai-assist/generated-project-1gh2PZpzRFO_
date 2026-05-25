import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * ProtectedRoute — route guard wrapper for WriteSpace.
 *
 * Uses React Router v6 layout route pattern with <Outlet />.
 *
 * @param {{ role?: string | null }} props
 *   - role: optional required role. When "admin", only admin sessions pass.
 *     Defaults to null (any authenticated user passes).
 */
export default function ProtectedRoute({ role = null }) {
  const session = getSession();

  // No session at all → redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route but user is not admin → redirect to blogs
  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  // Authenticated and role check passed → render child route
  return <Outlet />;
}