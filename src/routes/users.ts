import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getAllUsers, getUser, updateMe, updateMeAvatar, getMe,
} from '../controllers/users';
import { URL_REGEX } from '../constants';
import { objectIdValidation } from '../helpers';

const router = Router();

router.get('/users', getAllUsers);

router.get('/users/me', getMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({ userId: objectIdValidation }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
}), updateMe);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEX).required(),
  }),
}), updateMeAvatar);

export default router;
