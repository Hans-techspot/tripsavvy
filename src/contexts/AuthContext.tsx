'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { signup, login, verifyToken, refreshToken } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, full_name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      verifyToken(token).then((data) => {
        if (data && data.valid && data.user) {
          setUser(data.user);
        } else {
          // Try to refresh token
          const refresh = localStorage.getItem('refresh_token');
          if (refresh) {
            refreshToken(refresh)
              .then((response) => {
                localStorage.setItem('access_token', response.tokens.access_token);
                setUser(response.user);
              })
              .catch(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
              });
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignup = async (email: string, password: string, full_name: string) => {
    const response = await signup(email, password, full_name);
    localStorage.setItem('access_token', response.tokens.access_token);
    localStorage.setItem('refresh_token', response.tokens.refresh_token);
    setUser(response.user);
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);
    localStorage.setItem('access_token', response.tokens.access_token);
    localStorage.setItem('refresh_token', response.tokens.refresh_token);
    setUser(response.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup: handleSignup,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}