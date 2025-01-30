import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { checkUserConflicts } from 'src/utils/users/user-conflicts-checker';
import { hashPassword } from 'src/utils/password.utils';
import { validateData } from 'src/utils/users/users-validations.utils.';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  //Create a new user
  async create(userData: Prisma.UsersCreateInput) {
    //check if userData does not contain email or name already used
    await checkUserConflicts(this.prismaService, userData);

    //Check if userData is valid
    validateData(userData);

    //Hash the password
    userData.password = await hashPassword(userData.password);

    // If all is valid, create a new user
    return this.prismaService.users.create({
      data: userData,
    });
  }

  //Find a user by id
  async findOne(id: string) {
    return this.prismaService.users.findUnique({
      where: {
        id: id,
      },
    });
  }

  //Find All users
  async findAll() {
    return this.prismaService.users.findMany();
  }

  //Deactivate a user by id
  async deactivate(id: string) {
    return this.prismaService.users.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });
  }

  //Update a user by id
  async update(id: string, userData: Prisma.UsersUpdateInput) {
    //Chek if userData does not contain email or name already used
    await checkUserConflicts(this.prismaService, userData as Prisma.UsersCreateInput);

    //Check if userData is valid
    validateData(userData as Prisma.UsersCreateInput);

    return this.prismaService.users.update({
      where: {
        id: id,
      },
      data: userData,
    });
  }
}
