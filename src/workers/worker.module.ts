import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { ConversationModule } from '../conversation/conversation.module';
import { ChannelAdapterModule } from '../channel-adapters/channel-adapter.module';
import { AiModule } from '../ai/ai.module';
import { SearchModule } from '../search/search.module';
import { NotificationModule } from '../notification/notification.module';
import { AutomationModule } from '../automation/automation.module';
import { InboundWorkerService } from './inbound-worker.service';
import { OutboundWorkerService } from './outbound-worker.service';
import { AiWorkerService } from './ai-worker.service';
import { SearchWorkerService } from './search-worker.service';
import { NotificationWorkerService } from './notification-worker.service';

@Module({
  imports: [
    QueueModule,
    ConversationModule,
    ChannelAdapterModule,
    AiModule,
    SearchModule,
    NotificationModule,
    AutomationModule,
  ],
  providers: [
    InboundWorkerService,
    OutboundWorkerService,
    AiWorkerService,
    SearchWorkerService,
    NotificationWorkerService,
  ],
  exports: [
    InboundWorkerService,
    OutboundWorkerService,
    AiWorkerService,
    SearchWorkerService,
    NotificationWorkerService,
  ],
})
export class WorkerModule {}
