
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'visitor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'visitor') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('villa-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'visitor'): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const mockCredentials = {
      admin: { email: 'admin@villa.com', password: 'admin123' },
      visitor: { email: 'visitor@villa.com', password: 'visitor123' }
    };

    if (email === mockCredentials[role].email && password === mockCredentials[role].password) {
      const userData = {
        id: `${role}-${Date.now()}`,
        email,
        role
      };
      setUser(userData);
      localStorage.setItem('villa-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('villa-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
