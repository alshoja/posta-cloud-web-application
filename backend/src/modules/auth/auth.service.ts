import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from './types/express';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: AuthenticatedRequest,
  ) {}

  async signIn({
    username,
    password,
  }: CreateAuthDto): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findOneByUserName(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async getUser(): Promise<any> {
    return this.request.user;
  }
}
