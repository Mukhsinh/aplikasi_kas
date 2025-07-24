import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { showSuccess, showError } from '@/utils/toast';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in (e.g., from a previous session)
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (usernameInput: string, passwordInput: string): boolean => {
    const storedUsername = localStorage.getItem('loginUsername');
    const storedPassword = localStorage.getItem('loginPassword');

    if (!storedUsername || !storedPassword) {
      showError("Nama pengguna atau kata sandi login belum diatur di Master Setting.");
      return false;
    }

    if (usernameInput === storedUsername && passwordInput === storedPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      showSuccess("Login berhasil!");
      return true;
    } else {
      showError("Nama pengguna atau kata sandi salah.");
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    showSuccess("Anda telah logout.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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