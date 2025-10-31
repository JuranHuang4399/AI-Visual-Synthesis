import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-cyber-dark-200 border-b-2 border-cyber-cyan/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold text-glow-cyan">
              AI STORY CREATOR
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/")
                  ? "text-cyber-pink border-b-2 border-cyber-pink"
                  : "text-white hover:text-cyber-cyan"
              }`}
            >
              Home
            </Link>

            <Link
              to="/create"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/create")
                  ? "text-cyber-pink border-b-2 border-cyber-pink"
                  : "text-white hover:text-cyber-cyan"
              }`}
            >
              Create
            </Link>

            <Link
              to="/gallery"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/gallery")
                  ? "text-cyber-pink border-b-2 border-cyber-pink"
                  : "text-white hover:text-cyber-cyan"
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/profile")
                  ? "text-cyber-pink border-b-2 border-cyber-pink"
                  : "text-white hover:text-cyber-cyan"
              }`}
            >
              Profile
            </Link>
          </div>

          {/* User section (placeholder) */}
          <div className="flex items-center space-x-4">
            <button className="text-cyber-cyan hover:text-cyber-pink transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
