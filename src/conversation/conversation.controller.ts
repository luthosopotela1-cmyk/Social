import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { QueueService } from '../queue/queue.service';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly queueService: QueueService,
  ) {}

  @Post()
  async create(@Body() body: { workspaceId: string; customerId: string; subject?: string }) {
    return this.conversationService.createConversation(body.workspaceId, body.customerId, body.subject);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conversationService.getConversationById(id);
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id') id: string,
    @Body()
    body: {
      direction: 'INBOUND' | 'OUTBOUND';
      channelType: string;
      providerMessageId?: string;
      body?: string;
      attachments?: unknown;
      sentAt?: string;
      receivedAt?: string;
    },
  ) {
    const message = await this.conversationService.addMessage(id, {
      direction: body.direction,
      channelType: body.channelType,
      providerMessageId: body.providerMessageId,
      body: body.body,
      attachments: body.attachments,
      sentAt: body.sentAt ? new Date(body.sentAt) : undefined,
      receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
    });

    if (body.direction === 'OUTBOUND') {
      await this.queueService.enqueueOutboundMessage({ conversationId: id, messageId: message.id });
    }

    return message;
  }
}
