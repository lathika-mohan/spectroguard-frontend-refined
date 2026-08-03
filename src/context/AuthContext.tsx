import React, { createContext, useContext, useState, useRef } from 'react';
import { apiClient } from '../api/client';

export const AuthStatus = {
  UNINITIALIZED: 'UNINITIALIZED',
  INITIALIZING: 'INITIALIZING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED'
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];

export interface MeResponse {
  username: string;
  role: string;
  avatar?: string;
  full_name?: string;
  email?: string;
  workspace_id?: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  displayName: string;
  initials: string;
  role: string;
  avatar: string | null;
  email: string | null;
  workspaceId: string | null;
  raw: MeResponse;
}

export function mapAuthenticatedUser(dto: MeResponse): AuthenticatedUser {
  const displayName = dto.full_name ?? dto.username;

  let initials = 'OP';
  if (displayName) {
    // Filter to words/parts that start with alphabetic letters to ignore numbers
    const words = displayName.trim().split(/[\s_\-]+/).filter(w => /^[a-zA-Z]/.test(w));
    if (words.length === 0) {
      initials = displayName.substring(0, 2).toUpperCase();
    } else if (words.length === 1) {
      const word = words[0];
      initials = word.length >= 2 ? word.substring(0, 2).toUpperCase() : word.toUpperCase();
    } else {
      const first = words[0]?.[0] || '';
      const second = words[1]?.[0] || words[words.length - 1]?.[0] || '';
      initials = (first + second).toUpperCase();
    }
  }

  return {
    id: dto.username,
    username: dto.username,
    displayName,
    initials,
    role: dto.role,
    avatar: dto.avatar ?? null,
    email: dto.email ?? null,
    workspaceId: dto.workspace_id ?? null,
    raw: dto
  };
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  initializeUser: () => Promise<AuthenticatedUser | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.UNINITIALIZED);
  
  // Track concurrent calls and prevent duplicate API calls
  const initPromiseRef = useRef<Promise<AuthenticatedUser | null> | null>(null);

  const clearSession = () => {
    localStorage.removeItem('spectraguard_token');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    setUser(null);
    setStatus(AuthStatus.UNAUTHENTICATED);
    initPromiseRef.current = null;
  };

  const initializeUser = (): Promise<AuthenticatedUser | null> => {
    // Return existing authenticated user directly if already resolved
    if (status === AuthStatus.AUTHENTICATED && user) {
      return Promise.resolve(user);
    }

    // Return the active initialization promise if one is already in flight (idempotency)
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    const token = localStorage.getItem('spectraguard_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('accessToken');
    
    if (!token) {
      setStatus(AuthStatus.UNAUTHENTICATED);
      return Promise.resolve(null);
    }

    setStatus(AuthStatus.INITIALIZING);

    const promise = apiClient<MeResponse>('/me')
      .then((data) => {
        const mappedUser = mapAuthenticatedUser(data);
        setUser(mappedUser);
        setStatus(AuthStatus.AUTHENTICATED);
        initPromiseRef.current = null;
        return mappedUser;
      })
      .catch((error) => {
        console.error('Failed to fetch authenticated user context:', error);
        if (error instanceof Error && error.message.includes("Network failure")) {
          setUser(null);
          setStatus(AuthStatus.UNAUTHENTICATED);
          initPromiseRef.current = null;
        } else {
          clearSession();
        }
        return null;
      });

    initPromiseRef.current = promise;
    return promise;
  };

  const logout = () => {
    clearSession();
    window.location.href = '/login';
  };

  const tokenExists = !!(localStorage.getItem('spectraguard_token') || 
                        localStorage.getItem('token') || 
                        localStorage.getItem('accessToken'));

  // Loading state represents either being in initializing state or not initialized yet but having a token (about to fetch)
  const isLoading = status === AuthStatus.INITIALIZING || (status === AuthStatus.UNINITIALIZED && tokenExists);
  const isAuthenticated = status === AuthStatus.AUTHENTICATED && user !== null;

  return (
    <AuthContext.Provider value={{ user, status, isLoading, isAuthenticated, initializeUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      status: AuthStatus.UNAUTHENTICATED,
      isLoading: false,
      isAuthenticated: false,
      initializeUser: async () => null,
      logout: () => {
        localStorage.removeItem('spectraguard_token');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    } as AuthContextType;
  }
  return context;
};
