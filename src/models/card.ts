import { Schema, model } from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: string;
  likes: string[];
  createdAt: Date;
}

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array<Schema.Types.ObjectId>,
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
}, { versionKey: false });

export default model<ICard>('card', cardSchema);
