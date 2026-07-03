import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelType } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveOrCreateCustomer(workspaceId: string, profile: {
    channelType: ChannelType;
    providerId: string;
    displayName?: string;
    email?: string;
    phone?: string;
  }) {
    const existingProfile = await this.prisma.customerChannelProfile.findUnique({
      where: {
        channelType_providerId: {
          channelType: profile.channelType,
          providerId: profile.providerId,
        },
      },
      include: {
        customer: true,
      },
    });

    if (existingProfile) {
      return existingProfile.customer;
    }

    const customer = await this.prisma.customerIdentity.create({
      data: {
        workspaceId,
        name: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        channelProfiles: {
          create: {
            channelType: profile.channelType,
            providerId: profile.providerId,
            displayName: profile.displayName,
          },
        },
      },
    });

    return customer;
  }
}
