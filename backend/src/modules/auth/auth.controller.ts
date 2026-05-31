import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from './public.decorator';
import { Throttle } from '@nestjs/throttler';
import type { AuthJwtPayload, AuthenticatedRequest } from './types/express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('profile')
  getProfile(@Req() request: AuthenticatedRequest): AuthJwtPayload {
    return request.user;
  }
}
