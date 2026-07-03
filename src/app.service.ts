import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      name: 'Social CX Platform',
      version: '0.1.0',
    };
  }
}
