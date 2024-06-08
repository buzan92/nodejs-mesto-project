import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { SUCCESS_CREATE_CODE } from '../constants';
import errors from '../errors';

export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(SUCCESS_CREATE_CODE).send({ data: card });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new errors.BadRequestError('Переданны некорректный данные'));
    }
    return next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new errors.BadRequestError('Карточка с указанным _id не найдена'));
    }
    if (card.owner.toString() !== req.user._id) {
      return next(new errors.AuthError('Недостаточно прав для удаления карточки'));
    }
    const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
    return res.send({ data: deletedCard });
  } catch (error) {
    return next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new errors.NotFoundError('Карточка с указанным _id не найдена'));
    }
    return res.send({ data: card });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(new errors.BadRequestError('Переданны некорректный данные'));
    }
    return next(error);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new errors.NotFoundError('Карточка с указанным _id не найдена'));
    }
    return res.send({ data: card });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(new errors.BadRequestError('Переданны некорректный данные'));
    }
    return next(error);
  }
};
