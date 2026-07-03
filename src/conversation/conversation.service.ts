import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationStatus, MessageDirection, MessageStatus } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(workspaceId: string, customerId: string, subject?: string) {
    return this.prisma.conversation.create({
      data: {
        workspaceId,
        customerId,
        subject,
        status: ConversationStatus.OPEN,
      },
    });
  }

  async getConversationById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        customer: true,
        messages: true,
      },
    });
  }

  async findOpenConversationByCustomer(workspaceId: string, customerId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        workspaceId,
        customerId,
        status: ConversationStatus.OPEN,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async addMessage(conversationId: string, data: {
    direction: MessageDirection;
    channelType: string;
    body?: string;
    providerMessageId?: string;
    attachments?: unknown;
    sentAt?: Date;
    receivedAt?: Date;
  }) {
    return this.prisma.message.create({
      data: {
        conversationId,
        direction: data.direction,
        channelType: data.channelType as any,
        status: data.direction === MessageDirection.OUTBOUND ? MessageStatus.SENDING : MessageStatus.RECEIVED,
        body: data.body,
        providerMessageId: data.providerMessageId,
        attachments: data.attachments as any,
        sentAt: data.sentAt,
        receivedAt: data.receivedAt,
      },
    });
  }

  async getMessageById(messageId: string) {
    return this.prisma.message.findUnique({ where: { id: messageId } });
  }

  async updateMessageStatus(messageId: string, status: MessageStatus, providerMessageId?: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        status,
        providerMessageId: providerMessageId ?? undefined,
      },
    });
  }
}
