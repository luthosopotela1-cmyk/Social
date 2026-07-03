import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { URL } from 'url';

@Injectable()
export class QueueService {
  private connectionOptions: { host: string; port: number; password?: string }; 
  readonly inboundQueue: Queue;
  readonly outboundQueue: Queue;
  readonly aiQueue: Queue;
  readonly automationQueue: Queue;
  readonly searchQueue: Queue;
  readonly notificationQueue: Queue;

  constructor() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
    const parsed = new URL(redisUrl);

    this.connectionOptions = {
      host: parsed.hostname,
      port: Number(parsed.port),
      password: parsed.password || undefined,
    };

    this.inboundQueue = new Queue('inbound-messages', { connection: this.connectionOptions });
    this.outboundQueue = new Queue('outbound-messages', { connection: this.connectionOptions });
    this.aiQueue = new Queue('ai-jobs', { connection: this.connectionOptions });
    this.automationQueue = new Queue('automation-jobs', { connection: this.connectionOptions });
    this.searchQueue = new Queue('search-index', { connection: this.connectionOptions });
    this.notificationQueue = new Queue('notification', { connection: this.connectionOptions });
  }

  get connection() {
    return this.connectionOptions;
  }

  enqueueInboundMessage(data: unknown) {
    return this.inboundQueue.add('inbound', data);
  }

  enqueueOutboundMessage(data: unknown) {
    return this.outboundQueue.add('outbound', data);
  }

  enqueueAiJob(data: unknown) {
    return this.aiQueue.add('ai', data);
  }

  enqueueAutomationJob(data: unknown) {
    return this.automationQueue.add('automation', data);
  }

  enqueueSearchJob(data: unknown) {
    return this.searchQueue.add('index', data);
  }

  enqueueNotification(data: unknown) {
    return this.notificationQueue.add('notify', data);
  }
}
