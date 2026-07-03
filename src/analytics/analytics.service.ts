import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async recordEvent(workspaceId: string, eventType: string, payload: unknown) {
    return { recorded: true };
  }
}
