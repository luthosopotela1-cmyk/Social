import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { ChannelAdapter, NormalizedMessage, OutboundMessage, PartialCustomer } from '../interfaces/channel-adapter.interface';
import { ChannelAdapterRegistry } from '../channel-adapter.registry';

@Injectable()
export class SampleChannelAdapter implements ChannelAdapter, OnModuleInit {
  channel = ChannelType.LIVE_CHAT as ChannelType;
  supportedActions: ('reply' | 'attachment')[] = ['reply', 'attachment'];

  constructor(private readonly registry: ChannelAdapterRegistry) {}

  onModuleInit() {
    this.registry.register(this);
  }

  verifyWebhook(req: unknown): boolean {
    return true;
  }

  normalizeInbound(rawPayload: unknown): NormalizedMessage {
    const payload = rawPayload as any;
    return {
      workspaceId: payload.workspaceId,
      channel: ChannelType.LIVE_CHAT,
      providerCustomerId: payload.customerId,
      providerMessageId: payload.messageId,
      body: payload.body,
      attachments: payload.attachments ?? [],
      metadata: payload.metadata ?? {},
      receivedAt: new Date(payload.receivedAt ?? Date.now()),
    };
  }

  async sendReply(msg: OutboundMessage): Promise<string> {
    return `livechat-${Date.now()}`;
  }

  async fetchCustomerProfile(providerId: string): Promise<PartialCustomer> {
    return { providerId, displayName: 'Live Chat User' };
  }
}
