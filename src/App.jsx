import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { getSession } from './utils/auth';
import PublicNavbar from './components/PublicNavbar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';
import WriteBlog from './pages/WriteBlog';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

/**
 * App — root routing component for WriteSpace.
 *
 * Defines all 9 routes using React Router v6 layout routes.
 * PublicNavbar is shown on public routes (/ , /login, /register).
 * Navbar is shown on authenticated and admin routes, wrapped in ProtectedRoute.
 */
function App() {
  const session = getSession();
  const isAuthenticated = session !== null;

  return (
    <>
      <Routes>
        {/* Public routes — use PublicNavbar */}
        <Route
          path="/"
          element={
            <>
              <PublicNavbar isAuthenticated={isAuthenticated} />
              <LandingPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PublicNavbar isAuthenticated={isAuthenticated} />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PublicNavbar isAuthenticated={isAuthenticated} />
              <RegisterPage />
            </>
          }
        />

        {/* Authenticated routes — use Navbar, wrapped in ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/blogs"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <>
                <Navbar />
                <ReadBlog />
              </>
            }
          />
          <Route
            path="/write"
            element={
              <>
                <Navbar />
                <WriteBlog />
              </>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <>
                <Navbar />
                <WriteBlog />
              </>
            }
          />
        </Route>

        {/* Admin-only routes — use Navbar, wrapped in ProtectedRoute role="admin" */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route
            path="/admin"
            element={
              <>
                <Navbar />
                <AdminDashboard />
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <Navbar />
                <UserManagement />
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;