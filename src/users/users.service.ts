import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  //Create a new user
  async create(userData: Prisma.UsersCreateInput) {
    //Check if a user exist with the same email or name
    const existingUser = await this.prismaService.users.findFirst({
      where: {
        OR: [
          {
            email: userData.email,
          },
          {
            name: userData.name,
          },
        ],
      },
    });

    //If a user exist with the same email or name, add it to the conflicts array
    if (existingUser) {
      const conflicts = [];
      if (existingUser.email === userData.email) {
        conflicts.push(`email ${userData.email} already used`);
      }
      if (existingUser.name === userData.name) {
        conflicts.push(`name ${userData.name} already used`);
      }
      if (conflicts.length > 0) {
        throw new ConflictException(conflicts);
      }
    }

    //Hash the password
    userData.password = await this.hashPassword(userData.password);

    //Create the user
    return this.prismaService.users.create({
      data: userData,
    });
  }
}
