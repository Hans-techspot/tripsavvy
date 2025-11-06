import { indexedAuth, type AuthResponse } from './indexedAuth';

export type { AuthResponse };

export async function signup(
  email: string,
  password: string,
  full_name: string
): Promise<AuthResponse> {
  return indexedAuth.signup(email, password, full_name);
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return indexedAuth.login(email, password);
}

export async function verifyToken(token: string) {
  return indexedAuth.verifyToken(token);
}

export async function refreshToken(refresh_token: string): Promise<AuthResponse> {
  return indexedAuth.refreshToken(refresh_token);
}