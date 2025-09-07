import { useState } from 'react';
import { Search, Bell, User, ChevronDown, Menu, LogOut, Settings, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onAuthClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { user, userProfile, signOut, subscriptionTier } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setShowProfile(false);
  };

  return (
    <header className="bg-surface border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search samples, projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 lg:w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <span className="text-sm font-medium">
                  {userProfile?.username || user?.email?.split('@')[0] || 'User'}
                </span>
                <div className="text-xs text-gray-500 capitalize flex items-center">
                  {subscriptionTier}
                  {subscriptionTier === 'pro' && <Crown className="w-3 h-3 ml-1 text-yellow-500" />}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-modal border border-gray-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      // Navigate to settings
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  {subscriptionTier === 'free' && (
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        // Navigate to upgrade
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Upgrade Plan</span>
                    </button>
                  )}

                  <hr className="my-1" />
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
