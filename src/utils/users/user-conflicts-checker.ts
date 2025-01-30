import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export async function checkUserConflicts(
  prismaService: PrismaService,
  userData: Prisma.UsersCreateInput,
) {
  //Check if email already used
  const emailConflict = await prismaService.users.findFirst({
    where: {
      email: userData.email,
    },
  });

  //Check if name already used
  const nameConflict = await prismaService.users.findFirst({
    where: {
      name: userData.name,
    },
  });

  //If users exist with the same email or name, add it to the conflicts array
  const conflicts = [];
  if (emailConflict) {
    conflicts.push(`email ${userData.email} already used`);
  }
  if (nameConflict) {
    conflicts.push(`name ${userData.name} already used`);
  }
  if (conflicts.length > 0) {
    throw new ConflictException(conflicts);
  }
}
