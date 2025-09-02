import type { messaging } from 'firebase-admin';

type BatchResponse = messaging.BatchResponse;

export abstract class NotificationSendPort {
  abstract sendNotificationToMultipleTokens(
    tokens: string[],
    title: string,
    message: string,
  ): Promise<{ success: boolean; response: BatchResponse }>;
}
