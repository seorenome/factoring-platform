import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, User } from '../services/api';

export type UserRole = 'factor' | 'supplier' | 'debtor' | 'admin';

interface AuthContextProps {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      try {
        // Decode token and extract user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        
        setUser({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        });
      } catch (error) {
        console.error('Failed to parse token', error);
        api.clearToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    setUser(result.user);
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};