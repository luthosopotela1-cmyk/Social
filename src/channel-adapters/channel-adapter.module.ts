import { Module } from '@nestjs/common';
import { ChannelAdapterRegistry } from './channel-adapter.registry';
import { SampleChannelAdapter } from './impl/sample-channel.adapter';

@Module({
  providers: [ChannelAdapterRegistry, SampleChannelAdapter],
  exports: [ChannelAdapterRegistry],
})
export class ChannelAdapterModule {}
