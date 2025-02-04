import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Get User connected profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
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

  //Find a user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
