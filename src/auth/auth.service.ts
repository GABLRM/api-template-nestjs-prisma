import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword, hashPassword } from 'src/utils/password.utils';
import { checkUserConflicts } from 'src/utils/users/user-conflicts-checker';
import { validateData } from 'src/utils/users/users-validations.utils.';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Validates the user's credentialst and returns a JWT token
  async signIn(email: string, password: string) {
    // Find the user by email
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    // If the user does not exist or the password is invalid, throw an exception
    if (!user || !comparePassword(password, user.password)) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    // If the user exists and the password is valid, return a JWT token
    const playload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(playload),
    };
  }

  // Registers a new user
  async signUp(userData: Prisma.UsersCreateInput) {
    //check if userData does not contain email or name already used
    await checkUserConflicts(this.prisma, userData);

    //Check if userData is valid
    validateData(userData);

    //Hash the password
    userData.password = await hashPassword(userData.password);

    // If all is valid, create a new user
    const user = await this.prisma.users.create({
      data: userData,
    });

    const playload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(playload),
    };
  }
}
