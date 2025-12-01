import { useState, useEffect } from 'react';
import PageLayout from '../components/common/PageLayout';

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <PageLayout backgroundGifCount={1} showBackButton={true}>
      <div className="max-w-2xl mx-auto">
        <h1 className="title-neon text-center mb-8">PROFILE PAGE</h1>
        
        {user ? (
          <div className="card-cyber">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan font-bold text-3xl border-2 border-cyber-cyan">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyber-cyan mb-1">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-t border-cyber-cyan/30 pt-4">
                <h3 className="text-lg font-semibold text-cyber-pink mb-2">Account Information</h3>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-cyber-cyan">Username:</span> {user.username}</p>
                  <p><span className="text-cyber-cyan">Email:</span> {user.email}</p>
                  {user.loginTime && (
                    <p><span className="text-cyber-cyan">Last Login:</span> {new Date(user.loginTime).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-cyber text-center">
            <p className="text-gray-400 mb-4">Please login to view your profile</p>
            <a href="/login" className="btn-cyber-primary">Go to Login</a>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default ProfilePage;
