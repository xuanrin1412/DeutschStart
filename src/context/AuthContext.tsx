import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@/types/models';
import { authService } from '@/services/auth/authService';
import { progressRepository } from '@/services/progressRepository';

interface AuthApi {
  user: User | null;
  initializing: boolean;
  mode: 'local' | 'remote';
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword?(email: string, password: string): Promise<void>;
}

const AuthContext = createContext<AuthApi | null>(null);

export const GUEST_ID = 'guest';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await authService.login(email, password));
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const created = await authService.register(name, email, password);
    // Keep what the learner did as a guest.
    const guest = await progressRepository.load(GUEST_ID);
    if (guest) {
      await progressRepository.save({ ...guest, userId: created.id });
      await progressRepository.remove(GUEST_ID);
    }
    setUser(created);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value: AuthApi = {
    user,
    initializing,
    mode: authService.mode,
    login,
    register,
    logout,
    requestPasswordReset: (email) => authService.requestPasswordReset(email),
    resetPassword: authService.resetPassword?.bind(authService),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
