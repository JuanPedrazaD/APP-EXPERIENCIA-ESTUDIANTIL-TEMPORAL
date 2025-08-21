import { HttpException, HttpStatus } from '@nestjs/common';

export const failedDependencyException = (eMsg?: string, details?: object) => {
  throw new HttpException(
    {
      status: HttpStatus.FAILED_DEPENDENCY,
      message: processErrorMessage(eMsg ?? 'Error no encontrado'),
      details: details,
    },
    HttpStatus.FAILED_DEPENDENCY,
  );
};

export const processErrorMessage = (errorMessage: string): string => {
  const messageStart = errorMessage.split('Message:')[0]; // Todo antes de "Message"
  const messageContent = errorMessage.split('Message:')[1]?.trim(); // Todo después de "Message"

  if (messageContent?.toLowerCase().includes('bloqueado')) {
    const userFriendlyMessage =
      'El registro se encuentra bloqueado, por favor inténtelo de nuevo en cinco minutos. Si el problema persiste, contacte al asesor de ventas.';
    return `${messageStart}Message: ${userFriendlyMessage}`;
  }

  // Si no contiene "bloqueado", devolver el mensaje original
  return errorMessage;
};
