import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.fullName || 
           user?.email?.split('@')[0] || 
           'User';
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GW</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GigWrld</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { path: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
              { path: '/post-gig', icon: 'fa-plus', label: 'Post Gig' },
              { path: '/browse-gigs', icon: 'fa-search', label: 'Browse' },
              { path: '/messages', icon: 'fa-comment', label: 'Messages' },
              { path: '/profile', icon: 'fa-user', label: 'Profile' }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${item.icon} text-xs`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">
                  {getUserInitials()}
                </span>
              </div>
              <span className="text-sm text-gray-700">{getUserDisplayName()}</span>
            </div>
            
            <button
              onClick={logout}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center space-x-2"
            >
              <i className="fas fa-sign-out-alt text-xs"></i>
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bars text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (optional) */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {[
            { path: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
            { path: '/post-gig', icon: 'fa-plus', label: 'Post Gig' },
            { path: '/browse-gigs', icon: 'fa-search', label: 'Browse' },
            { path: '/messages', icon: 'fa-comment', label: 'Messages' },
            { path: '/profile', icon: 'fa-user', label: 'Profile' }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium flex items-center space-x-3 ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className={`fas ${item.icon} text-xs w-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;