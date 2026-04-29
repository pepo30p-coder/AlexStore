import { useState, useCallback } from 'react';

const ADMIN_HASH = 'alexstore2025';
const AUTH_KEY = 'alexstore_admin_auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_HASH) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
