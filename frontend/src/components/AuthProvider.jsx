import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import api from '@/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return authContext;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('accessToken');
  });

  // Update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else if (token === null) {
      localStorage.removeItem('accessToken');
    }
  }, [token]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get('/api/me');
        setToken(response.data.accessToken);
      } catch {
        // Try to refresh token if /me fails
        try {
          const refreshResponse = await api.get('/api/refreshToken');
          setToken(refreshResponse.data.accessToken);
        } catch {
          setToken(null);
        }
      }
    };

    // Only fetch if we don't have a token or if we have one to verify
    if (token === undefined || token) {
      fetchMe();
    }
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 403 &&
          error.response.data.message === 'Unauthorized'
        ) {
          try {
            const response = await api.get('/api/refreshToken');

            setToken(response.data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return api(originalRequest);
          } catch {
            setToken(null);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const logout = async () => {
    try {
      await api.post('/api/signout');
    } catch {
      // Continue with logout even if API call fails
    } finally {
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
