import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR_CODE } from '../constants';

type IError = Error & { statusCode?: number };

// eslint-disable-next-line no-unused-vars
export default (error: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = SERVER_ERROR_CODE, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
};
