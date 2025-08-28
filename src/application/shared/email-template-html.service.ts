import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailHTMLTemplateService {
  constructor(private readonly configService: ConfigService) {}

  getEmailTemplate(title: string, message: string): string {
    const imagePath = this.configService.get<string>('CDN');
    const link = this.configService.get<string>('WEB360');

    return `
    <!doctype html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación a Calificar tu Clase - CUN</title>
</head>

<body>
    ${title},
    ${message},
</body>
</html>
    `;
  }
}
