import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  paid: boolean;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  purchase: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // In a real app, this would involve an OAuth flow.
    // Here, we simulate a successful login.
    setUser({
      name: 'User Terdaftar',
      email: 'user@example.com',
      paid: false, // User starts as unpaid
    });
  };

  const logout = () => {
    setUser(null);
    // Optionally clear guest generations on logout if desired
    // localStorage.removeItem('guestGenerations');
  };

  const purchase = () => {
    if (user) {
      setUser({ ...user, paid: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, purchase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
