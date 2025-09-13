import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

const Profile = () => {
  const { user, logout, updateUser, getToken } = useAuth();
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: 'City, Area',
    bio: 'Tell others about yourself...',
    accountType: 'Customer Only',
    verificationStatus: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const stats = {
    gigsCompleted: 0,
    walletBalance: 'P0',
    rating: '0.0'
  };

  // Load user data from Supabase
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || user.user_metadata?.fullName || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '+267 XX XXX XXX',
        location: user.user_metadata?.location || 'City, Area',
        bio: user.user_metadata?.bio || 'Tell others about yourself...',
        accountType: user.user_metadata?.accountType || 'Customer Only'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Update user metadata in Supabase
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          accountType: profileData.accountType
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Update in your backend database
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: profileData.full_name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          account_type: profileData.accountType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile in database');
      }

      // 3. Update local auth context
      updateUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: profileData.full_name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          accountType: profileData.accountType
        }
      });

      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (profileData.full_name) {
      return profileData.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and verification status.
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-blue-600">
                  {getUserInitials()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profileData.full_name || user?.email || 'User'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mr-2">
                    {profileData.verificationStatus}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {profileData.accountType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.gigsCompleted}</p>
                <p className="text-sm text-gray-600">Gigs Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.walletBalance}</p>
                <p className="text-sm text-gray-600">Wallet</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+267 XXX XXX XXX"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Area"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell others about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={profileData.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Customer Only">Customer Only</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md mr-2">
                    {profileData.verificationStatus}
                  </span>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Verify Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Document
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload a clear photo of your national ID or passport
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <div className="flex justify-center mb-2">
                  <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl"></i>
                </div>
                <p className="text-sm text-gray-600">Upload ID</p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  id="id-upload"
                />
                <label
                  htmlFor="id-upload"
                  className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-200"
                >
                  Select File
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Account Actions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 mr-4"
              >
                Sign Out
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;