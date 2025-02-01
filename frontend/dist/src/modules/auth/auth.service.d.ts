import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthenticatedRequest } from './types/express';
export declare class AuthService {
    private usersService;
    private jwtService;
    private request;
    constructor(usersService: UsersService, jwtService: JwtService, request: AuthenticatedRequest);
    signIn({ username, password, }: CreateAuthDto): Promise<{
        access_token: string;
        user: any;
    }>;
    getUser(): Promise<any>;
}
