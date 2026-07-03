import { Injectable } from '@nestjs/common';

@Injectable()
export class RoutingService {
  evaluateRules(workspaceId: string, conversationId: string, payload: unknown) {
    return {
      assignedToId: null,
      queue: 'overflow',
    };
  }
}
