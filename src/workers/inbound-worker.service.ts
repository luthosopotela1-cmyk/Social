import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QueueService } from '../queue/queue.service';
import { ChannelAdapterRegistry } from '../channel-adapters/channel-adapter.registry';
import { CustomerService } from '../customer/customer.service';
import { ConversationService } from '../conversation/conversation.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class InboundWorkerService implements OnModuleInit {
  private readonly logger = new Logger(InboundWorkerService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly registry: ChannelAdapterRegistry,
    private readonly customerService: CustomerService,
    private readonly conversationService: ConversationService,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit() {
    const worker = new Worker('inbound-messages', async job => this.handleInbound(job.data), {
      connection: this.queueService.connection,
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Inbound worker failed job ${job?.id ?? '<unknown>'}: ${err.message}`, err.stack);
    });
  }

  async handleInbound(payload: any) {
    const channelAdapter = this.registry.get(payload.channel as any);
    if (!channelAdapter) {
      this.logger.warn(`No channel adapter registered for ${payload.channel}`);
      return;
    }

    const message = channelAdapter.normalizeInbound(payload.body);
    const customer = await this.customerService.resolveOrCreateCustomer(payload.workspaceId, {
      channelType: message.channel,
      providerId: message.providerCustomerId,
      displayName: message.metadata?.displayName as string,
      email: message.metadata?.email as string,
      phone: message.metadata?.phone as string,
    });

    let conversation = await this.conversationService.findOpenConversationByCustomer(payload.workspaceId, customer.id);
    if (!conversation) {
      conversation = await this.conversationService.createConversation(payload.workspaceId, customer.id, payload.subject);
    }

    const createdMessage = await this.conversationService.addMessage(conversation.id, {
      direction: 'INBOUND' as any,
      channelType: message.channel,
      body: message.body,
      providerMessageId: message.providerMessageId,
      attachments: message.attachments,
      receivedAt: message.receivedAt,
    });

    this.eventBus.emit('message.received', { workspaceId: payload.workspaceId, conversationId: conversation.id, messageId: createdMessage.id });
    this.queueService.enqueueSearchJob({ workspaceId: payload.workspaceId, conversationId: conversation.id, messageId: createdMessage.id });
    this.queueService.enqueueAutomationJob({ workspaceId: payload.workspaceId, conversationId: conversation.id, messageId: createdMessage.id });
    this.queueService.enqueueNotification({ workspaceId: payload.workspaceId, event: 'message.received', data: { conversationId: conversation.id } });
    this.queueService.enqueueAiJob({ workspaceId: payload.workspaceId, conversationId: conversation.id, messageId: createdMessage.id, type: 'CLASSIFY' });
  }
}
