// Import necessary hooks and components from React Router
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Hook to access the current route path
  const isActive = (path) => location.pathname === path; // Helper to check if a link is active

  return (
    // Navbar container with fixed position, shadow, and styling
    <nav className="bg-white shadow-md fixed w-full z-50 h-16 border-b border-gray-200 top-0">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center h-16">
        {/* Logo / Brand Title */}
        <Link to="/" className="text-2xl font-extrabold text-blue-700 tracking-tight">
          🏫 PupilPulse
        </Link>

        {/* Navigation links */}
        <div className="space-x-4 text-sm md:text-base">
          {/* Home link with active and hover styles */}
          <Link
            to="/"
            className={`px-3 py-2 rounded-md font-medium transition ${
              isActive('/')
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            Home
          </Link>

          {/* Login link with active and hover styles */}
          <Link
            to="/login"
            className={`px-3 py-2 rounded-md font-medium transition ${
              isActive('/login')
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            Login
          </Link>

          {/* Register link (specifically highlights /register/admin path) */}
          <Link
            to="/register"
            className={`px-3 py-2 rounded-md font-medium transition ${
              isActive('/register/admin')
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
