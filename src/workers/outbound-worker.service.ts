import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QueueService } from '../queue/queue.service';
import { ConversationService } from '../conversation/conversation.service';
import { ChannelAdapterRegistry } from '../channel-adapters/channel-adapter.registry';

@Injectable()
export class OutboundWorkerService implements OnModuleInit {
  private readonly logger = new Logger(OutboundWorkerService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly conversationService: ConversationService,
    private readonly registry: ChannelAdapterRegistry,
  ) {}

  onModuleInit() {
    const worker = new Worker('outbound-messages', async job => this.handleOutbound(job.data), {
      connection: this.queueService.connection,
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Outbound worker failed job ${job?.id ?? '<unknown>'}: ${err.message}`, err.stack);
    });
  }

  async handleOutbound(payload: any) {
    const message = await this.conversationService.getMessageById(payload.messageId);
    if (!message) {
      this.logger.warn(`Outbound message not found ${payload.messageId}`);
      return;
    }

    const adapter = this.registry.get(message.channelType as any);
    if (!adapter) {
      this.logger.warn(`No channel adapter for ${message.channelType}`);
      return;
    }

    const providerMessageId = await adapter.sendReply({
      workspaceId: payload.workspaceId,
      channel: message.channelType as any,
      conversationId: message.conversationId,
      providerCustomerId: payload.providerCustomerId ?? '',
      body: message.body ?? '',
      attachments: Array.isArray(message.attachments) ? message.attachments : [],
    });

    await this.conversationService.updateMessageStatus(message.id, 'SENT' as any, providerMessageId);
    await this.queueService.enqueueNotification({ workspaceId: payload.workspaceId, event: 'message.sent', data: { conversationId: message.conversationId, messageId: message.id } });
  }
}
