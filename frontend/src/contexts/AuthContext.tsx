import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import type { User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** JWT authentication state provider */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((token: string, refreshToken?: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
  }, []);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authService
      .getProfile()
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setIsLoading(false));
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: u, token, refreshToken } = await authService.login(email, password);
      persistSession(token, refreshToken);
      setUser(u);
      toast.success('Welcome back!');
    },
    [persistSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { user: u, token, refreshToken } = await authService.register(name, email, password);
      persistSession(token, refreshToken);
      setUser(u);
      toast.success('Account created successfully!');
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearSession();
    toast.success('Logged out');
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
