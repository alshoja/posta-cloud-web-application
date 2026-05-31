import { Request } from 'express';

export interface AuthJwtPayload {
  sub: number;
  email: string;
}

export interface AuthenticatedUser {
  id: number;
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
