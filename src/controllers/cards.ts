import { Request, Response } from 'express';
import Card from '../models/card';
import {
  SUCCESS_CREATE_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE,
} from '../constants';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch {
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(SUCCESS_CREATE_CODE).send({ data: card });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Переданны некорректный данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send({ data: card });
  } catch (error) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send({ data: card });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Переданны некорректный данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send({ data: card });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Переданны некорректный данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};
