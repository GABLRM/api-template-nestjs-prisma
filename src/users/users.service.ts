import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { checkUserConflicts } from 'src/utils/users/user-conflicts-checker';
import { validateData } from 'src/utils/users/users-validations.utils.';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  //Find a user by id
  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //Find All users
  async findAll() {
    return this.prismaService.users.findMany();
  }

  //Deactivate a user by id
  async deactivate(id: string) {
    const user = await this.prismaService.users.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //Update a user by id
  async update(id: string, userData: Prisma.UsersUpdateInput) {
    //Chek if userData does not contain email or name already used
    await checkUserConflicts(
      this.prismaService,
      userData as Prisma.UsersCreateInput,
    );

    //Check if userData is valid
    validateData(userData as Prisma.UsersCreateInput);

    // If all the valid, update the user
    const user = await this.prismaService.users.update({
      where: {
        id: id,
      },
      data: userData,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
