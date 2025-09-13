import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

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

  // Fetch user profile from Supabase (not backend)
  const fetchUserProfile = async (userId) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile not found:', error.message);
        return null;
      }
      return profileData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch profile data from Supabase
        const profileData = await fetchUserProfile(session.user.id);
        setUser({ ...session.user, ...profileData });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch profile data from Supabase when user signs in
        const profileData = await fetchUserProfile(session.user.id);
        setUser({ ...session.user, ...profileData });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (userData, authToken) => {
    setUser(userData);
    
    // Store token if needed for backend calls
    if (authToken) {
      localStorage.setItem('token', authToken);
    }
  };

  const logout = async () => {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    
    // Clear local state
    setUser(null);
    setSession(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  // Get current session token (for backend API calls)
  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const value = {
    user,
    session,
    login,
    logout,
    updateUser,
    getToken,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};