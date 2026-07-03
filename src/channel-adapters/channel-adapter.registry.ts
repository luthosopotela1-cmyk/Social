import { Injectable } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { ChannelAdapter } from './interfaces/channel-adapter.interface';

@Injectable()
export class ChannelAdapterRegistry {
  private adapters = new Map<ChannelType, ChannelAdapter>();

  register(adapter: ChannelAdapter) {
    this.adapters.set(adapter.channel, adapter);
  }

  get(channel: ChannelType): ChannelAdapter | undefined {
    return this.adapters.get(channel);
  }

  list(): ChannelAdapter[] {
    return Array.from(this.adapters.values());
  }
}
