import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { URL_REGEX } from '../constants';
import { objectIdValidation } from '../helpers';

const router = Router();

router.get('/cards', getAllCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(URL_REGEX).required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({ cardId: objectIdValidation }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: objectIdValidation }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: objectIdValidation }),
}), dislikeCard);

export default router;
