import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import errors from '../errors';

const { JWT_SECRET = '33d06c302953b90bd071d08976bb3a23c626a2aaf70ca7143382b8fd9f4e0a5e' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new errors.AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new errors.AuthError('Необходима авторизация'));
  }

  if (typeof payload === 'string') {
    req.user = { _id: payload };
  }

  return next();
};
