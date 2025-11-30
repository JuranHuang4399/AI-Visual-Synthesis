import { useState } from 'react';
import PixelDinosaurBackground from '../components/login/PixelDinosaurBackground';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock login/register - accept any input
    try {
      // Store user info in localStorage (mock authentication)
      const userData = {
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...');
      
      // Redirect to home page after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Pixel dinosaur background */}
      <PixelDinosaurBackground />
      
      {/* Content layer */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login card */}
          <div className="card-cyber backdrop-blur-sm bg-cyber-dark-200/90 border-2 border-cyber-cyan/50">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-glow-cyan mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Sign in to continue your pixel adventure' : 'Start your pixel art journey'}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isLogin
                    ? 'bg-cyber-cyan text-cyber-dark-300 shadow-neon-cyan'
                    : 'bg-cyber-dark-200 text-gray-400 hover:text-cyber-cyan'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !isLogin
                    ? 'bg-cyber-cyan text-cyber-dark-300 shadow-neon-cyan'
                    : 'bg-cyber-dark-200 text-gray-400 hover:text-cyber-cyan'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-cyber-cyan mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-cyber"
                    placeholder="Enter your username"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-cyber-cyan mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cyber-cyan mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="••••••••"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-cyber-cyan mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-cyber"
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-400">
                    <input type="checkbox" className="mr-2" />
                    Remember me
                  </label>
                  <a href="#" className="text-cyber-cyan hover:text-cyber-pink">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn-cyber-primary mt-6 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Logging in...' : 'Signing up...'}
                  </span>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyber-cyan/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-cyber-dark-200 text-gray-400">
                    Or use
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-2 bg-cyber-dark-200 border border-cyber-cyan/30 rounded-lg text-white hover:border-cyber-pink transition-colors">
                  <span className="mr-2">🔵</span>
                  Google
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-cyber-dark-200 border border-cyber-cyan/30 rounded-lg text-white hover:border-cyber-pink transition-colors">
                  <span className="mr-2">⚫</span>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

