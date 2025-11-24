import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check login status on mount and when location changes
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
  }, [location]);

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    navigate("/");
  };

  return (
    <nav className="bg-black border-b-4 border-cyber-pink/50" style={{
      boxShadow: '0 4px 20px rgba(255, 0, 110, 0.3)'
    }}>
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

          {/* User section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">{userEmail || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="text-cyber-cyan hover:text-cyber-pink transition-colors text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-cyber-cyan hover:text-cyber-pink transition-colors font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
