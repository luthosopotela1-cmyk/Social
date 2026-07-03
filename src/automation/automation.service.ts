import { Injectable } from '@nestjs/common';

@Injectable()
export class AutomationService {
  executeWorkflow(workspaceId: string, trigger: string, payload: unknown) {
    return { executed: false };
  }
}
