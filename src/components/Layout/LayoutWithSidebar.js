import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LayoutWithSidebar = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

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

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileSidebar();
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileSidebar();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigation items with improved icons and badges
  const navItems = [
    { path: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard', badge: null },
    { path: '/post-gig', icon: 'fa-plus-circle', label: 'Post Gig', badge: 'new', badgeColor: 'bg-green-100 text-green-800' },
    { path: '/browse-gigs', icon: 'fa-search', label: 'Browse Gigs', badge: null },
    { path: '/bookings', icon: 'fa-calendar-check', label: 'My Bookings', badge: '3', badgeColor: 'bg-blue-100 text-blue-800' },
    { path: '/messages', icon: 'fa-comments', label: 'Messages', badge: '12', badgeColor: 'bg-purple-100 text-purple-800' },
    { path: '/profile', icon: 'fa-user-circle', label: 'Profile', badge: null },
    { path: '/wallet', icon: 'fa-wallet', label: 'Wallet', badge: null },
  ];

  // Sidebar content component to avoid duplication
  const SidebarContent = ({ isCollapsed, isMobile = false }) => (
    <>
      {/* Logo Section */}
      <div className={`p-4 border-b border-gray-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GW</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">GigWrld</h1>
              <p className="text-xs text-gray-500">Marketplace</p>
            </div>
          </div>
        )}
        
        {isCollapsed && !isMobile && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GW</span>
          </div>
        )}

        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={closeMobileSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
            aria-label="Close sidebar"
          >
            <i className="fas fa-times text-gray-500 text-sm"></i>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-25 text-blue-600 shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`flex items-center justify-center ${
                  isActive(item.path) 
                    ? 'text-blue-500' 
                    : 'text-gray-400 group-hover:text-gray-600'
                } ${isCollapsed ? '' : 'mr-3'}`}>
                  <i className={`fas ${item.icon} text-lg`}></i>
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.badgeColor || 'bg-gray-100 text-gray-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && item.badge && (
                  <span className={`absolute left-full ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    item.badgeColor || 'bg-gray-100 text-gray-600'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg`}>
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Tooltip for collapsed sidebar */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-r-gray-900 border-l-transparent border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Stats Section - Only show when expanded */}
        {!isCollapsed && (
          <div className="mt-6 p-3 bg-gradient-to-br from-gray-50 to-blue-25 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Wallet Balance</span>
              <i className="fas fa-wallet text-gray-400 text-sm"></i>
            </div>
            <p className="text-lg font-bold text-gray-900">P0.00</p>
            <button 
              onClick={() => handleNavigation('/wallet')}
              className="w-full mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-plus mr-1 text-xs"></i>
              Add Funds
            </button>
          </div>
        )}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-100">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <i className="fas fa-cog mr-1 text-xs"></i>
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <i className="fas fa-sign-out-alt mr-1 text-xs"></i>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {getUserInitials()}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-1">
              <button
                onClick={() => handleNavigation('/profile')}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                title="Settings"
              >
                <i className="fas fa-cog text-xs"></i>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 bg-white shadow-xl lg:shadow-lg flex flex-col justify-between
        transition-all duration-300 ease-in-out h-screen
        ${isMobile ? (
          isMobileOpen ? 'w-64 translate-x-0' : '-translate-x-full'
        ) : (
          isCollapsed ? 'w-16' : 'w-64'
        )}
      `}>
        <SidebarContent isCollapsed={isCollapsed && !isMobile} isMobile={isMobile} />
      </div>

      {/* Main Content Area */}
      <div className={`
        flex-1 bg-gray-50 overflow-auto transition-all duration-300 min-h-screen
        ${isMobile ? 'lg:ml-0' : isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Open menu"
              >
                <i className="fas fa-bars text-gray-600"></i>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GW</span>
                </div>
                <span className="font-bold text-gray-800">GigWrld</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <i className="fas fa-bell text-gray-600"></i>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {getUserInitials()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;