import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Sample data for demonstration
  const stats = {
    totalGigs: 0,
    walletBalance: "P0",
    completedJobs: 0,
    averageRating: "0.0"
  };

  // Get user's display name (from Supabase metadata or email)
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.fullName || 
           user?.email?.split('@')[0] || 
           'User';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">GigWrld</h1>
            <p className="text-xs text-gray-500 mt-1">Gig Marketplace</p>
          </div>
          
          {/* Navigation */}
          <nav className="p-3">
            <ul className="space-y-1">
              <li className="flex items-center p-2 bg-blue-50 rounded-lg text-blue-600">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <i className="fas fa-chart-pie text-blue-500 text-xs"></i>
                </div>
                <span className="font-medium text-sm">Dashboard</span>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <i className="fas fa-plus text-gray-500 text-xs"></i>
                </div>
                <Link to="/post-gig" className="text-sm">
                  Post Gig
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <i className="fas fa-search text-gray-500 text-xs"></i>
                </div>
                <Link to="/browse-gigs" className="text-sm">
                  Browse Gigs
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <i className="fas fa-calendar-check text-gray-500 text-xs"></i>
                </div>
                <span className="text-sm">My Bookings</span>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <i className="fas fa-comment text-gray-500 text-xs"></i>
                </div>
                <Link to="/messages" className="text-sm">
                  Messages
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <i className="fas fa-user text-gray-500 text-xs"></i>
                </div>
                <Link to="/profile" className="text-sm">
                  Profile
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg text-gray-700 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <i className="fas fa-cog text-gray-500 text-xs"></i>
                </div>
                <span className="text-sm">Admin Panel</span>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* User Profile Section */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <i className="fas fa-user text-blue-500 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-medium">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-500">Wallet: {stats.walletBalance}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium flex items-center justify-center"
          >
            <i className="fas fa-sign-out-alt mr-1 text-xs"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {getUserDisplayName()}!
              <span className="ml-1">👋</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">Here's what's happening with your gigs today.</p>
          </div>
          <div className="flex space-x-2">
            <Link 
              to="/browse-gigs"
              className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              Browse Gigs
            </Link>
            <Link 
              to="/post-gig" 
              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
            >
              Post New Gig
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Total Gigs Posted */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Total Gigs Posted</p>
                <p className="text-xl font-bold text-gray-800">{stats.totalGigs}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-briefcase text-blue-500 text-sm"></i>
              </div>
            </div>
          </div>
          
          {/* Wallet Balance */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-xl font-bold text-gray-800">{stats.walletBalance}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-green-500 text-sm"></i>
              </div>
            </div>
          </div>
          
          {/* Completed Jobs */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Completed Jobs</p>
                <p className="text-xl font-bold text-gray-800">{stats.completedJobs}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check-circle text-purple-500 text-sm"></i>
              </div>
            </div>
          </div>
          
          {/* Average Rating */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Average Rating</p>
                <p className="text-xl font-bold text-gray-800">{stats.averageRating}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-yellow-500 text-sm"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Gigs Posted */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold text-gray-800">Recent Gigs Posted</h3>
              <Link 
                to="/post-gig"
                className="px-2 py-1 bg-blue-50 text-blue-500 rounded text-xs font-medium flex items-center"
              >
                <i className="fas fa-plus mr-1 text-xs"></i> New
              </Link>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-briefcase text-gray-500"></i>
              </div>
              <p className="text-sm text-gray-500 mb-3">No gigs posted yet</p>
              <Link 
                to="/post-gig" 
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded text-xs font-medium"
              >
                Post Your First Gig
              </Link>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold text-gray-800">Active Bookings</h3>
              <button className="px-2 py-1 text-gray-600 rounded text-xs font-medium">
                View All
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-calendar-check text-gray-500"></i>
              </div>
              <p className="text-sm text-gray-500 mb-3">No active bookings</p>
              <Link 
                to="/browse-gigs"
                className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded text-xs font-medium hover:bg-gray-50"
              >
                Browse Available Gigs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;