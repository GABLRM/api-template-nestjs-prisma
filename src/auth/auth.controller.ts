import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Sign in a user (jwt token)
  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  // Sign up a user (create a new user)
  @Post('signup')
  async signUp(@Body() createUserDto: Prisma.UsersCreateInput) {
    return this.authService.signUp(createUserDto);
  }
}
