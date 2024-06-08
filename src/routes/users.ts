import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getAllUsers, getUser, updateMe, updateMeAvatar, getMe,
} from '../controllers/users';
import { URL_REGEX } from '../constants';

const router = Router();

router.get('/users', getAllUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), getUser);

router.patch('/users/me', updateMe);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEX).required(),
  }),
}), updateMeAvatar);

router.get('/me', getMe);

export default router;
