import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LayoutWithSidebar = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user's display name
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.fullName || 
           user?.email?.split('@')[0] || 
           'User';
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg flex flex-col justify-between transition-all duration-300`}>
        <div>
          {/* Logo and Toggle Button */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">GigWrld</h1>
                <p className="text-xs text-gray-500 mt-1">Gig Marketplace</p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-100"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-gray-500`}></i>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="p-3">
            <ul className="space-y-1">
              <li className={`flex items-center p-2 rounded-lg ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} cursor-pointer`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCollapsed ? '' : 'mr-2'} ${isActive('/dashboard') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <i className={`fas fa-chart-pie text-xs ${isActive('/dashboard') ? 'text-blue-500' : 'text-gray-500'}`}></i>
                </div>
                {!isCollapsed && (
                  <Link to="/dashboard" className="text-sm">
                    Dashboard
                  </Link>
                )}
              </li>
              <li className={`flex items-center p-2 rounded-lg ${isActive('/post-gig') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} cursor-pointer`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCollapsed ? '' : 'mr-2'} ${isActive('/post-gig') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <i className={`fas fa-plus text-xs ${isActive('/post-gig') ? 'text-blue-500' : 'text-gray-500'}`}></i>
                </div>
                {!isCollapsed && (
                  <Link to="/post-gig" className="text-sm">
                    Post Gig
                  </Link>
                )}
              </li>
              <li className={`flex items-center p-2 rounded-lg ${isActive('/browse-gigs') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} cursor-pointer`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCollapsed ? '' : 'mr-2'} ${isActive('/browse-gigs') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <i className={`fas fa-search text-xs ${isActive('/browse-gigs') ? 'text-blue-500' : 'text-gray-500'}`}></i>
                </div>
                {!isCollapsed && (
                  <Link to="/browse-gigs" className="text-sm">
                    Browse Gigs
                  </Link>
                )}
              </li>
              <li className={`flex items-center p-2 rounded-lg ${isActive('/messages') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} cursor-pointer`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCollapsed ? '' : 'mr-2'} ${isActive('/messages') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <i className={`fas fa-comment text-xs ${isActive('/messages') ? 'text-blue-500' : 'text-gray-500'}`}></i>
                </div>
                {!isCollapsed && (
                  <Link to="/messages" className="text-sm">
                    Messages
                  </Link>
                )}
              </li>
              <li className={`flex items-center p-2 rounded-lg ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} cursor-pointer`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCollapsed ? '' : 'mr-2'} ${isActive('/profile') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <i className={`fas fa-user text-xs ${isActive('/profile') ? 'text-blue-500' : 'text-gray-500'}`}></i>
                </div>
                {!isCollapsed && (
                  <Link to="/profile" className="text-sm">
                    Profile
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
        
        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-sm font-bold text-blue-600">
                  {getUserInitials()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-sign-out-alt mr-1 text-xs"></i> Logout
            </button>
          </div>
        )}
        
        {/* Collapsed User Profile */}
        {isCollapsed && (
          <div className="p-3 border-t border-gray-100">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">
                  {getUserInitials()}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium flex items-center justify-center transition-colors duration-200"
              aria-label="Logout"
            >
              <i className="fas fa-sign-out-alt text-xs"></i>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default LayoutWithSidebar;