import React, { createContext, useContext, useState, useEffect } from 'react';

const ADMIN_AUTH_KEY = 'cloudcompare_is_admin';
const ADMIN_PASS_STORAGE_KEY = 'cloudcompare_admin_password';
const DEFAULT_ADMIN_PASS = 'admin123';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(ADMIN_PASS_STORAGE_KEY) || DEFAULT_ADMIN_PASS;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }, [isAdmin]);

  const login = (password: string): boolean => {
    if (password === adminPassword) {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const changePassword = (
    currentPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    if (currentPass !== adminPassword) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (!newPass.trim() || newPass.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters.' };
    }
    setAdminPassword(newPass);
    localStorage.setItem(ADMIN_PASS_STORAGE_KEY, newPass);
    return { success: true, message: 'Admin passcode successfully updated!' };
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        changePassword,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
