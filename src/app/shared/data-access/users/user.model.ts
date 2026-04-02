export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface FullUserResponse {
  id: string;
  username: string;
  email: string;
  linkImg: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

export interface AdminUserRequest {
  username: string;
  email: string;
  password: string | null;
  linkImg: string;
  role: UserRole | string;
}

export interface UserState {
  isLoading: boolean;
  error: string | null;
}
