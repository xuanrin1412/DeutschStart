import type { User } from '@/types/models';
import { delay, storage } from '../storage';

/**
 * Authentication contract. The app only talks to this interface.
 * `LocalAuthService` keeps accounts in the browser (demo / offline mode).
 * To go live, implement `SupabaseAuthService` with supabase.auth.signUp / signInWithPassword /
 * signOut / resetPasswordForEmail and export it below when VITE_SUPABASE_URL is set.
 */
export interface AuthService {
  readonly mode: 'local' | 'remote';
  getCurrentUser(): Promise<User | null>;
  register(name: string, email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  /** Local mode only – in remote mode the user follows the e-mail link. */
  resetPassword?(email: string, newPassword: string): Promise<void>;
}

export class AuthError extends Error {}

interface StoredUser extends User {
  passwordHash: string;
}

async function hash(text: string) {
  try {
    const data = new TextEncoder().encode(`deutschstart:${text}`);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    // crypto.subtle is unavailable on plain http (non-localhost). Demo fallback only.
    return btoa(unescape(encodeURIComponent(text)));
  }
}

class LocalAuthService implements AuthService {
  readonly mode = 'local' as const;

  private users() {
    return storage.get<StoredUser[]>('users', []);
  }

  private strip({ passwordHash: _ignored, ...user }: StoredUser): User {
    return user;
  }

  async getCurrentUser() {
    const id = storage.get<string | null>('session', null);
    const user = this.users().find((u) => u.id === id);
    return user ? this.strip(user) : null;
  }

  async register(name: string, email: string, password: string) {
    await delay(400);
    const users = this.users();
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) throw new AuthError('Email này đã được đăng ký.');
    const user: StoredUser = {
      id: crypto.randomUUID?.() ?? `u-${Date.now()}`,
      name: name.trim(),
      email: normalized,
      createdAt: new Date().toISOString(),
      passwordHash: await hash(password),
    };
    storage.set('users', [...users, user]);
    storage.set('session', user.id);
    return this.strip(user);
  }

  async login(email: string, password: string) {
    await delay(400);
    const user = this.users().find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.passwordHash !== (await hash(password))) throw new AuthError('Email hoặc mật khẩu không đúng.');
    storage.set('session', user.id);
    return this.strip(user);
  }

  async logout() {
    storage.remove('session');
  }

  async requestPasswordReset(email: string) {
    await delay(400);
    if (!this.users().some((u) => u.email === email.trim().toLowerCase())) throw new AuthError('Không tìm thấy tài khoản với email này.');
  }

  async resetPassword(email: string, newPassword: string) {
    await delay(300);
    const users = this.users();
    const idx = users.findIndex((u) => u.email === email.trim().toLowerCase());
    if (idx < 0) throw new AuthError('Không tìm thấy tài khoản.');
    users[idx] = { ...users[idx], passwordHash: await hash(newPassword) };
    storage.set('users', users);
  }
}

export const authService: AuthService = new LocalAuthService();
