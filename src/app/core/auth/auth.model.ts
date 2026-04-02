export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}


export interface User {
  username: string;
  email: string;
  role?: UserRole;
  phone?: string;
  id?: string;
  linkImg?: string;
}

export interface AuthResponse {
  username: string;
  email: string;
  role: string;
  phone: string;
  linkImg: string;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
