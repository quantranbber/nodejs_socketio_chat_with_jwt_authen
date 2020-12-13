import {
  Document, model, Model, Schema
} from 'mongoose';
import { UserGender } from '../utils/constants';

export class UserDocument extends Document {
    username: string;

    password: string;

    avatar: string;

    gender: number;
}

const schema = new Schema({
  username: { type: String, required: true },
  password: { type: String },
  avatar: { type: String },
  gender: { type: UserGender }
});

const User: Model<UserDocument> = model<UserDocument, Model<UserDocument>>('User', schema);

export const updateUser = async (userId: string, user: UserDocument):
    Promise<UserDocument> => User.findOneAndUpdate({
  _id: userId
}, {
  $set: {
    username: user.username, avatar: user.avatar
  }
}, {
  new: true
});

export default User;
