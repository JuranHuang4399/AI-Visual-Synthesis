import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function HomeNavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-cyber-dark-200/80 backdrop-blur-sm border-b-2 border-cyber-cyan/30 relative z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold text-glow-cyan">
              AI STORY CREATOR
            </span>
          </Link>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* User info dropdown */}
                <div 
                  className="relative z-[101]"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-cyber-dark-200/50 border border-cyber-cyan/30 hover:border-cyber-pink transition-colors relative z-[102]">
                    <div className="w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-cyber-cyan text-sm font-semibold hidden md:inline">
                      {user.username}
                    </span>
                    <svg
                      className={`w-4 h-4 text-cyber-cyan transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  {/* Invisible bridge to prevent gap */}
                  <div className={`absolute right-0 top-full w-full h-2 ${isDropdownOpen ? 'block' : 'hidden'}`}></div>
                  
                  {/* Dropdown menu */}
                  <div className={`absolute right-0 top-full mt-2 w-48 bg-cyber-dark-200 border-2 border-cyber-cyan/50 rounded-lg shadow-neon-cyan transition-all duration-200 z-[103] ${
                    isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}>
                    <div className="p-3 border-b border-cyber-cyan/30">
                      <p className="text-cyber-cyan font-semibold text-sm">{user.username}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-white hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-colors text-sm"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-white hover:bg-cyber-pink/20 hover:text-cyber-pink transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/30 hover:border-cyber-pink transition-colors font-semibold"
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

export default HomeNavBar;

