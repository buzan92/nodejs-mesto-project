import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { celebrate, Joi, errors } from 'celebrate';
import helmet from 'helmet';

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import auth from './middlewares/auth';
import error from './middlewares/error';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUser, login } from './controllers/users';
import { URL_REGEX } from './constants';

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
mongoose.connect(MONGODB_URL);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), login);

app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT);
