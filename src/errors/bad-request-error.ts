import { BAD_REQUEST_CODE } from '../constants';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_CODE;
  }
}
