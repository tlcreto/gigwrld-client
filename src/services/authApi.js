// src/services/authAPI.js

// Update this URL to match your backend server
const API_URL = 'http://localhost:5000/api'; // or your backend URL

// Function to handle user registration
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not register user');
    }

    return data;
  } catch (error) {
    console.error('Registration API Error:', error);
    throw error;
  }
};

// Function to handle user login
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not log in');
    }

    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

// Function to get current user profile
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch user data');
    }

    return data;
  } catch (error) {
    console.error('Get User API Error:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (userData, token) => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not update profile');
    }

    return data;
  } catch (error) {
    console.error('Update Profile API Error:', error);
    throw error;
  }
};

// Function to change password
export const changePassword = async (passwordData, token) => {
  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not change password');
    }

    return data;
  } catch (error) {
    console.error('Change Password API Error:', error);
    throw error;
  }
};

// Function to logout (optional - mainly client-side)
export const logoutUser = async (token) => {
  try {
    // If your backend has a logout endpoint that invalidates tokens
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Even if logout endpoint doesn't exist, we still return success
    // since logout is mainly a client-side operation
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout API Error:', error);
    // Still return success since logout is primarily client-side
    return { success: true, message: 'Logged out successfully' };
  }
};

// Function to verify email
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email/${verificationToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not verify email');
    }

    return data;
  } catch (error) {
    console.error('Verify Email API Error:', error);
    throw error;
  }
};

// Function to request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not request password reset');
    }

    return data;
  } catch (error) {
    console.error('Password Reset Request API Error:', error);
    throw error;
  }
};

// Function to reset password with token
export const resetPassword = async (resetData) => {
  try {
    const { token, password } = resetData;
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not reset password');
    }

    return data;
  } catch (error) {
    console.error('Password Reset API Error:', error);
    throw error;
  }
};

// Utility function to check if user is authenticated
export const checkAuth = async (token) => {
  try {
    if (!token) return { isAuthenticated: false };

    const response = await fetch(`${API_URL}/auth/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user: data.user };
  } catch (error) {
    console.error('Check Auth API Error:', error);
    return { isAuthenticated: false };
  }
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  logoutUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  checkAuth
};