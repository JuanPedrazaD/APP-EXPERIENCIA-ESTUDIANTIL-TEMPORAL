export abstract class EmailSendPort {
  abstract sendEmail(
    email: string,
    title: string,
    message: string,
    htmlBody: string,
  ): void;
}
