import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    console.log('AuthContext - Retrieved user:', currentUser);
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await auth.login(email, password);
    console.log('AuthContext - Login response:', response.user);
    setUser(response.user);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const updateUser = (userData: any) => {
    console.log('AuthContext - Updating user:', userData);
    setUser((prev: any) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}