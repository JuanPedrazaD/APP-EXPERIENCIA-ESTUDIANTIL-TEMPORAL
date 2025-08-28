import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';

export abstract class NotificationSendPort {
  abstract sendNotificationToMultipleTokens(
    tokens: string[],
    title: string,
    message: string,
  ): Promise<{
    success: boolean;
    response: BatchResponse;
  }>;
}
