import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'factor' | 'supplier' | 'debtor' | 'admin';

interface AuthContextProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userId: string;
  companyId: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('factor');

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        userId: 'user-1',
        companyId: 'company-1',
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