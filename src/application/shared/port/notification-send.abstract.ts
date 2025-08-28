export abstract class NotificationSendPort {
  abstract sendNotification(
    token: string,
    title: string,
    message: string,
  ): void;
}
