import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async notify(workspaceId: string, event: string, payload: unknown) {
    return { sent: true };
  }
}
