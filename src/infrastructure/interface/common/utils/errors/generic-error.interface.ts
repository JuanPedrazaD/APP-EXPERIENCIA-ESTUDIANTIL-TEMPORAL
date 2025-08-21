import { Logger } from 'winston';

export interface GenericError {
  error: CustomError | any;
  message?: string;
  logger: Logger;
  additionalLogger?: () => any;
}

export interface CustomError {
  status: any;
  message: string;
  details?: object;
  code?: string;
}
