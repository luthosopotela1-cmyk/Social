import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { QueueService } from '../queue/queue.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class NotificationWorkerService implements OnModuleInit {
  private readonly logger = new Logger(NotificationWorkerService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit() {
    const worker = new Worker('notification', async job => this.handleNotificationJob(job.data), {
      connection: this.queueService.connection,
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Notification worker failed job ${job?.id ?? '<unknown>'}: ${err.message}`, err.stack);
    });
  }

  async handleNotificationJob(payload: any) {
    await this.notificationService.notify(payload.workspaceId, payload.event, payload.data);
  }
}
