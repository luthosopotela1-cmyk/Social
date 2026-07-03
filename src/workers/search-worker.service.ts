import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QueueService } from '../queue/queue.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class SearchWorkerService implements OnModuleInit {
  private readonly logger = new Logger(SearchWorkerService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly searchService: SearchService,
  ) {}

  onModuleInit() {
    const worker = new Worker('search-index', async job => this.handleSearchJob(job.data), {
      connection: this.queueService.connection,
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Search worker failed job ${job?.id ?? '<unknown>'}: ${err.message}`, err.stack);
    });
  }

  async handleSearchJob(payload: any) {
    await this.searchService.indexConversation(payload.workspaceId, payload.conversationId, payload);
  }
}
