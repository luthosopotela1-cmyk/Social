import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  async indexConversation(workspaceId: string, conversationId: string, payload: unknown) {
    return { indexed: true };
  }
}
