// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { account } from '@/lib/appwrite';
import type { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if error is an authentication/authorization error
function isAuthError(err: unknown): boolean {
  if (!err) return false;
  
  // Check if it's an AppwriteException with specific error codes
  if (typeof err === 'object' && 'code' in err) {
    const code = (err as { code?: number }).code;
    // 401 = Unauthorized, 403 = Forbidden
    return code === 401 || code === 403;
  }
  
  // Check error message for common auth error patterns
  if (err instanceof Error) {
    const message = err.message.toLowerCase();
    return (
      message.includes('401') ||
      message.includes('403') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('missing scopes') ||
      message.includes('missing scope') ||
      message.includes('role: guests')
    );
  }
  
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const session = await account.get();
      setUser(session);
      return true;
    } catch (err) {
      // Silently handle authentication errors (no session = expected behavior)
      // Don't log these errors to console as they're expected when user is not logged in
      if (isAuthError(err)) {
        setUser(null);
        return false;
      }
      
      // Only log unexpected errors (network issues, etc.)
      if (err instanceof Error) {
        // Only log if it's not a common auth error
        const message = err.message.toLowerCase();
        if (!message.includes('401') && !message.includes('unauthorized')) {
          console.error('Error checking session:', err);
        }
        setError(err.message);
      }
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await account.deleteSession('current');
      setUser(null);
    } catch (err) {
      // If already logged out or no session, just clear user state
      if (isAuthError(err)) {
        setUser(null);
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      await account.create('unique()', email, password, name);
      await login(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        checkSession,
      }}
    >
      {children}
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