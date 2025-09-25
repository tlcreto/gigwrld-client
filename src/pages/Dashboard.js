import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState('');

  // Sample data - in real app, this would come from API
  const [stats, setStats] = useState({
    totalGigs: 0,
    walletBalance: "P0",
    completedJobs: 0,
    averageRating: "0.0"
  });

  // Check if new user (no data) for onboarding
  useEffect(() => {
    const isNewUser = stats.totalGigs === 0 && stats.completedJobs === 0;
    setShowOnboarding(isNewUser);
    
    // Show first tooltip after a brief delay for new users
    if (isNewUser) {
      setTimeout(() => setActiveTooltip('post-gig'), 1000);
    }
  }, [stats.totalGigs, stats.completedJobs]);

  // Get user's display name
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.fullName || 
           user?.email?.split('@')[0] || 
           'User';
  };

  // Tooltip positions and messages
  const tooltips = {
    'post-gig': {
      message: "Click here to post your first gig and start earning!",
      position: "top-right",
      target: 'post-gig-btn'
    },
    'wallet': {
      message: "Add funds to your wallet to book gigs easily",
      position: "top-left",
      target: 'wallet-balance'
    },
    'browse-gigs': {
      message: "Explore available gigs in your area",
      position: "top-right",
      target: 'browse-gigs-btn'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Onboarding Tooltip Overlay */}
      {showOnboarding && activeTooltip && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className={`absolute p-4 max-w-xs bg-white rounded-xl shadow-lg border border-blue-200 ${
            tooltips[activeTooltip].position === 'top-right' ? 'right-4 top-20' : 'left-4 top-20'
          }`}>
            <p className="text-sm text-gray-700 mb-2">{tooltips[activeTooltip].message}</p>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setActiveTooltip('')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Skip
              </button>
              <button 
                onClick={() => {
                  // Cycle through tooltips or finish
                  if (activeTooltip === 'post-gig') setActiveTooltip('wallet');
                  else if (activeTooltip === 'wallet') setActiveTooltip('browse-gigs');
                  else setShowOnboarding(false);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {getUserDisplayName()}! <span className="ml-1">👋</span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              {stats.totalGigs === 0 
                ? "Ready to start your gig journey? Post your first gig or explore opportunities!" 
                : "Here's what's happening with your gigs today."
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Link 
              to="/browse-gigs"
              id="browse-gigs-btn"
              className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center flex items-center justify-center"
            >
              <i className="fas fa-search mr-2 text-sm"></i>
              Browse Gigs
            </Link>
            <Link 
              to="/post-gig" 
              id="post-gig-btn"
              className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-center flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2 text-sm"></i>
              Post New Gig
            </Link>
          </div>
        </div>

        {/* Stats Cards - Modern Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 lg:mb-8">
          {/* Total Gigs Card */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full -mr-4 -mt-4 opacity-20"></div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Gigs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalGigs}</p>
                <p className="text-xs text-gray-500 mt-1">Active listings</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-briefcase text-white text-lg"></i>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card with Add Funds */}
          <div id="wallet-balance" className="bg-gradient-to-br from-white to-green-50 p-5 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full -mr-4 -mt-4 opacity-20"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.walletBalance}</p>
                <button className="mt-2 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center">
                  <i className="fas fa-plus mr-1 text-xs"></i>
                  Add Funds
                </button>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-wallet text-white text-lg"></i>
              </div>
            </div>
          </div>

          {/* Completed Jobs Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-2xl shadow-sm border border-purple-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full -mr-4 -mt-4 opacity-20"></div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedJobs}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-check-circle text-white text-lg"></i>
              </div>
            </div>
          </div>

          {/* Average Rating Card */}
          <div className="bg-gradient-to-br from-white to-yellow-50 p-5 rounded-2xl shadow-sm border border-yellow-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 rounded-full -mr-4 -mt-4 opacity-20"></div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Avg Rating</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{stats.averageRating}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <i key={star} className={`fas fa-star text-sm ${
                        star <= Math.floor(parseFloat(stats.averageRating)) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}></i>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on reviews</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-star text-white text-lg"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Recent Gigs Posted */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Your Recent Gigs</h3>
              <Link 
                to="/post-gig"
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center hover:bg-blue-100 transition-colors"
              >
                <i className="fas fa-plus mr-1 text-xs"></i> New Gig
              </Link>
            </div>
            
            {/* Empty State */}
            {stats.totalGigs === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-briefcase text-blue-500 text-2xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No gigs posted yet</h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start earning by offering your skills and services. Post your first gig and reach potential clients.
                </p>
                <Link 
                  to="/post-gig" 
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Post Your First Gig
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Sample gig items would go here */}
                <p className="text-gray-500 text-center py-4">Your gigs will appear here</p>
              </div>
            )}
          </div>

          {/* Active Bookings */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Active Bookings</h3>
              <button className="px-3 py-1.5 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View All
              </button>
            </div>
            
            {/* Empty State */}
            {stats.completedJobs === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calendar-check text-green-500 text-2xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No active bookings</h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  When you book gigs or receive bookings, they'll appear here for easy tracking.
                </p>
                <Link 
                  to="/browse-gigs"
                  className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  <i className="fas fa-search mr-2"></i>
                  Browse Available Gigs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Sample booking items would go here */}
                <p className="text-gray-500 text-center py-4">Your bookings will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages Section */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 lg:mt-8">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <Link to="/messages" className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </Link>
          </div>
          
          <div className="text-center py-8 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-comments text-purple-500 text-xl"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              Once you start connecting with buyers or sellers, your conversations will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;