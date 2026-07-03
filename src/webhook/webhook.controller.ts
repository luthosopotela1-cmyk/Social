import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  async receive(@Req() req: unknown, @Headers() headers: Record<string, string>, @Body() body: unknown) {
    await this.queueService.enqueueInboundMessage({ headers, body, receivedAt: new Date().toISOString() });
    return { status: 'accepted' };
  }
}
