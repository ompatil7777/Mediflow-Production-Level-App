import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { store } from '../data/store';
import { authService } from '../services/auth';

interface AuthContextType {
  user: UserProfile;
  role: Role;
  switchRole: (role: Role) => void;
  signOut: () => void;
  demoProfiles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(authService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUser({ ...store.currentProfile });
    });
    return unsubscribe;
  }, []);

  const switchRole = (role: Role) => {
    authService.signInWithDemoRole(role);
  };

  const signOut = () => {
    authService.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        switchRole,
        signOut,
        demoProfiles: authService.getAllDemoProfiles(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
