import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) { }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  //Create a new user
  async create(userData: Prisma.UsersCreateInput) {
    try {
      return this.prismaService.users.create({
        data: {
          ...userData,
          password: await this.hashPassword(userData.password),
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
      }
      throw error;
    }
  }

}
