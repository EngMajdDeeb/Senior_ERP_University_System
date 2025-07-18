import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { useUserInfo } from '@/hooks/use-api';
import { User, getDefaultRoute } from '@/lib/auth';

// Remove this interface since we're importing it from auth.ts

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  const { data: userInfo, isLoading: userInfoLoading } = useUserInfo();

  useEffect(() => {
    if (!userInfoLoading) {
      if (userInfo) {
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [userInfo, userInfoLoading]);

  const login = async (username: string, password: string) => {
    try {
      await apiService.login(username, password);
      const userData = await apiService.getUserInfo();
      setUser(userData);
      
      // Route based on user role using utility function
      const defaultRoute = getDefaultRoute(userData.role);
      navigate(defaultRoute);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider }; 