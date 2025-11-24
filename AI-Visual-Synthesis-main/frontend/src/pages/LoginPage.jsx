import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WalkingPixelCharacter from "../components/common/WalkingPixelCharacter";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // 清除错误信息
    if (error) setError("");
  };

  // 切换登录/注册时重置表单
  const handleToggle = (login) => {
    setIsLogin(login);
    setFormData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // 模拟登录
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!formData.email || !formData.password) {
        setError("Please enter your email and password");
        setIsLoading(false);
        return;
      }
      
      // 模拟成功登录
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.email);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again later");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }
      
      // Validate password length
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
      
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
      
      // 模拟注册
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 注册成功，切换到登录模式
      setError("");
      setIsLogin(true);
      setFormData({
        email: formData.email, // 保留邮箱
        password: "",
        username: "",
        confirmPassword: "",
      });
      alert("Registration successful! Please login");
    } catch (err) {
      setError("Registration failed. Please try again later");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Walking Pixel Characters Background */}
      <WalkingPixelCharacter 
        startX={-10} 
        startY="15%" 
        speed={20} 
        delay={0}
        size="medium"
        direction="right"
      />
      <WalkingPixelCharacter 
        startX={110} 
        startY="25%" 
        speed={18} 
        delay={2}
        size="small"
        direction="left"
      />
      <WalkingPixelCharacter 
        startX={-10} 
        startY="75%" 
        speed={22} 
        delay={4}
        size="large"
        direction="right"
      />
      <WalkingPixelCharacter 
        startX={110} 
        startY="85%" 
        speed={16} 
        delay={1}
        size="medium"
        direction="left"
      />
      <WalkingPixelCharacter 
        startX={-10} 
        startY="45%" 
        speed={25} 
        delay={3}
        size="small"
        direction="right"
      />
      <WalkingPixelCharacter 
        startX={110} 
        startY="55%" 
        speed={19} 
        delay={5}
        size="medium"
        direction="left"
      />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Title */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <span className="text-5xl">🎮</span>
          </Link>
          <h1 className="title-neon text-4xl md:text-5xl mb-2">
            AI STORY CREATOR
          </h1>
          <p className="subtitle-neon text-lg">
            {isLogin ? "Welcome Back" : "Start Your Creative Journey"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="card-cyber">
          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-black border-2 border-cyber-pink/50 p-1 relative" style={{
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
          }}>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`flex-1 py-2 px-4 font-semibold transition-all border-2 ${
                isLogin
                  ? "bg-cyber-pink text-white border-cyber-pink shadow-neon-pink"
                  : "text-gray-400 border-gray-600 hover:text-cyber-cyan hover:border-cyber-cyan bg-black"
              }`}
              style={isLogin ? {} : {
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`flex-1 py-2 px-4 font-semibold transition-all border-2 ${
                !isLogin
                  ? "bg-cyber-cyan text-black border-cyber-cyan shadow-neon-cyan"
                  : "text-gray-400 border-gray-600 hover:text-cyber-pink hover:border-cyber-pink bg-black"
              }`}
              style={!isLogin ? {} : {
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border-2 border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-cyber-cyan font-semibold mb-2">
                  Email Address <span className="text-cyber-pink">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-cyber-cyan font-semibold mb-2">
                  Password <span className="text-cyber-pink">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-cyber-dark-200 border-cyber-cyan rounded focus:ring-cyber-pink focus:ring-2"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-cyber-cyan hover:text-cyber-pink transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-cyber-cyan font-semibold mb-2">
                  Username <span className="text-cyber-pink">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="Choose a unique username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-cyber-cyan font-semibold mb-2">
                  Email Address <span className="text-cyber-pink">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-cyber-cyan font-semibold mb-2">
                  Password <span className="text-cyber-pink">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="At least 6 characters"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-cyber-cyan font-semibold mb-2">
                  Confirm Password <span className="text-cyber-pink">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="Re-enter password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 bg-cyber-dark-200 border-cyber-cyan rounded focus:ring-cyber-pink focus:ring-2"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-cyber-cyan hover:text-cyber-pink transition-colors"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-cyber-cyan hover:text-cyber-pink transition-colors"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cyber-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyber-cyan"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-cyber-cyan hover:text-cyber-pink transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

