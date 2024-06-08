import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { URL_REGEX } from '../constants';

interface IUser {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value: string) {
        return isEmail(value);
      },
      message: 'Укажите валидный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(value: string) {
        return URL_REGEX.test(value);
      },
      message: 'Укажите валидную ссылку',
    },
  },
}, { versionKey: false });

export default model<IUser>('user', userSchema);
