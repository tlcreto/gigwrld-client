// context/useAuth.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // Import Supabase client

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('No active session (normal for new users):', error.message);
          setError(null); // Clear error as this is normal
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          // If user is authenticated, fetch their profile
          if (session?.user) {
            try {
              const userProfile = await fetchUserProfile(session.access_token);
              setUser(prev => ({ ...prev, ...userProfile }));
            } catch (profileError) {
              console.error('Failed to fetch user profile:', profileError);
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setError(null);

        // If user signs in, fetch their profile from backend
        if (session?.user && event === 'SIGNED_IN') {
          try {
            const userProfile = await fetchUserProfile(session.access_token);
            setUser(prev => ({ ...prev, ...userProfile }));
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from your backend
  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, userMetadata = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      localStorage.removeItem('token');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  // Get current session token (for backend API calls)
  const getToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Login method for compatibility with your existing code
  const login = async (userData, authToken) => {
    setUser(userData);
    if (authToken) {
      localStorage.setItem('token', authToken);
    }
  };

  // Logout method for compatibility
  const logout = async () => {
    await signOut();
  };

  const value = {
    // State
    user,
    session,
    isLoading,
    error,
    
    // Authentication methods
    signIn,
    signUp,
    signOut,
    login,        // For backward compatibility
    logout,       // For backward compatibility
    getToken,
    updateUser,
    clearError,
    
    // Helper properties
    isAuthenticated: !!user,
    userId: user?.id,
    userEmail: user?.email,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;