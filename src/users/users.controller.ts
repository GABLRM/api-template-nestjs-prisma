import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Find a user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //Find all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //Delete a user by id
  @Patch(':id/deactivate')
  delete(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  //Update a user by id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UsersUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
