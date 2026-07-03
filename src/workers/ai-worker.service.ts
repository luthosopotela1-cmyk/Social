import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QueueService } from '../queue/queue.service';
import { AiService } from '../ai/ai.service';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class AiWorkerService implements OnModuleInit {
  private readonly logger = new Logger(AiWorkerService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly aiService: AiService,
    private readonly conversationService: ConversationService,
  ) {}

  onModuleInit() {
    const worker = new Worker('ai-jobs', async job => this.handleAiJob(job.data), {
      connection: this.queueService.connection,
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`AI worker failed job ${job?.id ?? '<unknown>'}: ${err.message}`, err.stack);
    });
  }

  async handleAiJob(payload: any) {
    const result = await this.aiService.complete(`Classify message ${payload.messageId}`, { provider: 'openai' });
    await this.conversationService.updateMessageStatus(payload.messageId, 'RECEIVED' as any);
    this.logger.log(`AI job completed for message ${payload.messageId}`);
    return result;
  }
}
