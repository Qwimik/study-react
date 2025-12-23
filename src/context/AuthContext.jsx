import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { findUserByEmail } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userEmail = localStorage.getItem('currentUserEmail');
      if (userEmail) {
        const user = await findUserByEmail(userEmail);
        if (user) {
          setCurrentUser(user);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const user = await findUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem('currentUserEmail', email);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserEmail');
  };

  const updateCurrentUser = (updatedData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
  };

  const refreshCurrentUser = async () => {
    if (currentUser) {
      const updatedUser = await findUserByEmail(currentUser.email);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  };

  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    updateCurrentUser,
    refreshCurrentUser,
    isAuthenticated: !!currentUser,
    loading
  }), [currentUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

