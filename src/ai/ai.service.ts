import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async complete(prompt: string, options?: { provider?: string }) {
    return {
      provider: options?.provider ?? 'openai',
      prompt,
      text: 'This is a placeholder response from AI Orchestration.',
    };
  }
}
