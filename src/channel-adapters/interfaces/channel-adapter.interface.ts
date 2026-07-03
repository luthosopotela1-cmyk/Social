import { ChannelType } from '@prisma/client';

export interface NormalizedMessage {
  workspaceId: string;
  channel: ChannelType;
  providerCustomerId: string;
  providerMessageId?: string;
  body?: string;
  attachments?: unknown[];
  metadata?: Record<string, unknown>;
  receivedAt: Date;
}

export interface OutboundMessage {
  workspaceId: string;
  channel: ChannelType;
  conversationId: string;
  providerCustomerId: string;
  body: string;
  attachments?: unknown[];
}

export interface PartialCustomer {
  providerId: string;
  displayName?: string;
  email?: string;
  phone?: string;
}

export interface ChannelAdapter {
  channel: ChannelType;
  verifyWebhook(req: unknown): boolean;
  normalizeInbound(rawPayload: unknown): NormalizedMessage;
  sendReply(msg: OutboundMessage): Promise<string>;
  supportedActions: ('like' | 'react' | 'delete' | 'hide' | 'reply' | 'attachment')[];
  fetchCustomerProfile(providerId: string): Promise<PartialCustomer>;
}
