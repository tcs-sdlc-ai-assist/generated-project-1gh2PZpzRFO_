import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 md:py-16">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1: Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              WriteSpace
            </h3>
            <p className="text-sm text-stone-400 mt-2">
              Your thoughts. Your space. Beautifully simple.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  All Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Copyright */}
          <div>
            <p className="text-sm text-stone-500">
              &copy; {currentYear} WriteSpace. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}