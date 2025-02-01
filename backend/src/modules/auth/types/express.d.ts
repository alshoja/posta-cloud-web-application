export interface AuthenticatedRequest extends Request {
  user: {
    sub: number; // The user ID
    username: string; // The username
  };
}
