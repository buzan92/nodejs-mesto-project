import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '665dfcbe42ddff14f336a6d3',
  };

  next();
});

mongoose.connect(MONGODB_URL);

app.use(usersRouter);
app.use(cardsRouter);

app.listen(PORT);
