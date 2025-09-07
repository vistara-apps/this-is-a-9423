import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await auth.getCurrentUser();
        if (user) {
          setUser(user);
          await loadUserProfile(user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await db.getUser(userId);
      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }
      
      setUserProfile(profile);

      // Load subscription info
      const { data: subscriptionData } = await db.getUserSubscription(userId);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signUp(email, password, userData);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        // Create user profile in database
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          username: userData.username || email.split('@')[0],
          subscription_tier: 'free',
          ...userData
        };

        const { error: profileError } = await db.updateUser(data.user.id, profileData);
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
      }

      return { success: true, data };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Welcome back!');
      return { success: true, data };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Signed out successfully');
      return { success: true };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await db.updateUser(user.id, updates);
      
      if (error) {
        toast.error('Failed to update profile');
        return { success: false, error };
      }

      setUserProfile(data);
      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };

  const refreshSubscription = async () => {
    if (!user) return;
    
    try {
      const { data: subscriptionData } = await db.getUserSubscription(user.id);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }
  };

  // Helper functions
  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_confirmed_at != null;
  const subscriptionTier = userProfile?.subscription_tier || 'free';
  
  const hasFeature = (feature) => {
    switch (feature) {
      case 'ai_assistance':
        return subscriptionTier !== 'free';
      case 'marketplace_access':
        return subscriptionTier !== 'free';
      case 'advanced_analytics':
        return subscriptionTier === 'pro';
      case 'unlimited_samples':
        return subscriptionTier === 'pro';
      case 'bulk_processing':
        return subscriptionTier === 'pro';
      default:
        return true;
    }
  };

  const getUsageLimits = () => {
    switch (subscriptionTier) {
      case 'creator':
        return {
          samplesPerMonth: 10,
          projects: 5,
          aiRequests: 50
        };
      case 'pro':
        return {
          samplesPerMonth: -1, // Unlimited
          projects: -1, // Unlimited
          aiRequests: 200
        };
      default: // free
        return {
          samplesPerMonth: 3,
          projects: 1,
          aiRequests: 5
        };
    }
  };

  const value = {
    // State
    user,
    userProfile,
    loading,
    subscription,
    
    // Auth methods
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshSubscription,
    
    // Helper methods
    isAuthenticated,
    isEmailVerified,
    subscriptionTier,
    hasFeature,
    getUsageLimits,
    
    // Utility
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
