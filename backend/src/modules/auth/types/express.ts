import { Request } from 'express';

export interface AuthJwtPayload {
  sub: number;
  username: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthenticatedUser;
}

export interface AuthenticatedRequest extends Request {
  user: AuthJwtPayload;
}
