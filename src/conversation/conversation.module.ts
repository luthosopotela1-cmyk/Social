import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
