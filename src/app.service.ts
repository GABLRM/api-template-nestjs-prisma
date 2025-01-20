import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): number {
    return HttpStatus.OK;
  }
}
