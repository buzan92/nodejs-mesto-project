import { Request, Response } from 'express';
import User from '../models/user';
import {
  SUCCESS_CREATE_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE,
} from '../constants';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch {
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send({ data: user });
  } catch {
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(SUCCESS_CREATE_CODE).send({ data: user });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Переданны некорректный данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Переданны некорректные данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateMeAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Переданны некорректные данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};
