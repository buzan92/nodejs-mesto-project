import { AUTH_ERROR_CODE } from '../constants';

export default class AuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = AUTH_ERROR_CODE;
  }
}
