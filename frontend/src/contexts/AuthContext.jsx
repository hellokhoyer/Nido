import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/api';

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
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAccessToken(token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      setAccessToken(null);
    }
  };

  // Sign in function
  const signIn = async (credentials) => {
    try {
      const response = await api.post('/api/signin', credentials);
      const { accessToken, user } = response.data;
      
      setUser(user);
      setAuthToken(accessToken);
      
      return { success: true, user, accessToken };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Sign in failed' 
      };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await api.post('/api/signout');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setAuthToken(null);
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.get('/api/refreshToken');
        const { accessToken, user } = response.data;
        
        if (accessToken && user) {
          setUser(user);
          setAuthToken(accessToken);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    accessToken,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user && !!accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
