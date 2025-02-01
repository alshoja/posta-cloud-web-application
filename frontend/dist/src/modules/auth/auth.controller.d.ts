import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(signInDto: CreateAuthDto): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(): Promise<any>;
}
