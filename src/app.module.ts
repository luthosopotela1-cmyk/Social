import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ChannelAdapterModule } from './channel-adapters/channel-adapter.module';
import { ConversationModule } from './conversation/conversation.module';
import { RoutingModule } from './routing/routing.module';
import { AutomationModule } from './automation/automation.module';
import { AiModule } from './ai/ai.module';
import { SearchModule } from './search/search.module';
import { NotificationModule } from './notification/notification.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { QueueModule } from './queue/queue.module';
import { CustomerModule } from './customer/customer.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { WebhookModule } from './webhook/webhook.module';
import { WorkerModule } from './workers/worker.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    QueueModule,
    EventBusModule,
    CustomerModule,
    ChannelAdapterModule,
    ConversationModule,
    RoutingModule,
    AutomationModule,
    AiModule,
    SearchModule,
    NotificationModule,
    AnalyticsModule,
    WebhookModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
