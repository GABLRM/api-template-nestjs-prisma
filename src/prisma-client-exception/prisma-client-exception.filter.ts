import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();


    const message = exception.message.replace(/\n/g, "");
    let formattedMessage = "an Unexpected error occurred";

    switch (exception.code) {
      case 'P2002':

      const match = exception.message.match(/Unique constraint failed on the fields: \(`(.+?)`\)/);
      const field = match ? match[1] : "unknown field";
      formattedMessage = `This ${field} is already used`;
        const status = HttpStatus.CONFLICT;
        response.status(200).json({
          statusCode: status,
          messag: formattedMessage,
        });
        break;
      default:
        //default 500 errorx
        super.catch(exception, host);
        break;
    }
  }
}
