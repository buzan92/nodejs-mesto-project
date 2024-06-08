import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { SUCCESS_CREATE_CODE } from '../constants';
import errors from '../errors';

const { JWT_SECRET = '33d06c302953b90bd071d08976bb3a23c626a2aaf70ca7143382b8fd9f4e0a5e' } = process.env;

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new errors.NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    return res.status(SUCCESS_CREATE_CODE).send({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if ((error as any).code === 11000) {
      return next(new errors.ConflictError('Пользователь с таким email уже существует'));
    }
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new errors.BadRequestError('Переданны некорректный данные'));
    }
    return next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new errors.NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new errors.BadRequestError('Переданны некорректный данные'));
    }
    return next(error);
  }
};

export const updateMeAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new errors.NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new errors.BadRequestError('Переданны некорректный данные'));
    }
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new errors.AuthError('Неправильные почта или пароль'));
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(new errors.AuthError('Неправильные почта или пароль'));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
    });
    return res.send({ data: token });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new errors.NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};
