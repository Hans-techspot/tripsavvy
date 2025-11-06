import { openDB, type IDBPDatabase } from 'idb';

interface User {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  avatar_url?: string;
  created_at: Date;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}

class IndexedAuth {
  private _db: Promise<IDBPDatabase<any>> | null = null;

  constructor() {}

  private get db(): Promise<IDBPDatabase<any>> {
    if (this._db) return this._db;

    if (typeof window === 'undefined') {
      throw new Error('IndexedDB is not available on server-side');
    }

    this._db = openDB('TripAI_Demo', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }
      },
    });

    return this._db;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'demo_salt'); // Simple salt for demo
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateToken(userId: string): string {
    // Simple demo token - in real app use proper JWT
    const payload = btoa(JSON.stringify({
      userId,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      iat: Date.now()
    }));
    return `demo_token.${payload}`;
  }

  private verifyToken(token: string): { userId: string } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp < Date.now()) return null;
      return { userId: payload.userId };
    } catch {
      return null;
    }
  }

  async signup(email: string, password: string, full_name: string): Promise<AuthResponse> {
    const db = await this.db;
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const index = store.index('email');

    // Check if user exists
    const existing = await index.get(email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Validate password
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const password_hash = await this.hashPassword(password);
    const user: User = {
      id: crypto.randomUUID(),
      email,
      full_name,
      password_hash,
      avatar_url: undefined,
      created_at: new Date()
    };

    await store.add(user);

    const access_token = this.generateToken(user.id);
    const refresh_token = this.generateToken(user.id); // Same for demo

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      tokens: {
        access_token,
        refresh_token,
        expires_in: 86400,
        token_type: 'Bearer'
      }
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const db = await this.db;
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const index = store.index('email');

    const user = await index.get(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const password_hash = await this.hashPassword(password);
    if (password_hash !== user.password_hash) {
      throw new Error('Invalid email or password');
    }

    const access_token = this.generateToken(user.id);
    const refresh_token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      tokens: {
        access_token,
        refresh_token,
        expires_in: 86400,
        token_type: 'Bearer'
      }
    };
  }

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    const tokenData = this.verifyToken(token);
    if (!tokenData) {
      return { valid: false };
    }

    const db = await this.db;
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const user = await store.get(tokenData.userId);

    if (!user) {
      return { valid: false };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    };
  }

  async refreshToken(refresh_token: string): Promise<AuthResponse> {
    const tokenData = this.verifyToken(refresh_token);
    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    const db = await this.db;
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const user = await store.get(tokenData.userId);

    if (!user) {
      throw new Error('User not found');
    }

    const access_token = this.generateToken(user.id);
    const new_refresh_token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      tokens: {
        access_token,
        refresh_token: new_refresh_token,
        expires_in: 86400,
        token_type: 'Bearer'
      }
    };
  }
}

export const indexedAuth = new IndexedAuth();
export type { AuthResponse };