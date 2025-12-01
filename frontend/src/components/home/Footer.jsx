function Footer() {
  return (
    <footer className="bg-cyber-dark-400 border-t-2 border-cyber-cyan/30 py-8">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-cyber-cyan font-bold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              AI Story Creator helps you generate unique pixel art characters
              with AI-powered stories for your creative projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cyber-cyan font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-cyber-pink">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/create"
                  className="text-gray-400 hover:text-cyber-pink"
                >
                  Create
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-400 hover:text-cyber-pink"
                >
                  Characters
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-cyber-pink"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cyber-cyan font-bold mb-4">Team 12</h3>
            <p className="text-gray-400 text-sm mb-2">
              Frontend:{" "}
              <span className="text-cyber-pink font-semibold">
                Xuanyou Liu,Tenmou
              </span>
            </p>
            <p className="text-gray-400 text-sm">
              Backend:{" "}
              <span className="text-cyber-purple font-semibold">
                Juran Huang, JokerStar
              </span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-cyber-cyan/20 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 AI Story Creator. Created for CS5500 Software Development.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
