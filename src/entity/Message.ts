import {
  Document, model, Model, Schema
} from 'mongoose';

export class MessageDocument extends Document {
    content: string;

    status: string;

    sender: string;

    receiver: string;

    createdDate: number;

    type: string;
}

const schema = new Schema({
  content: { type: Schema.Types.String, required: true },
  status: { type: Schema.Types.String, required: true, enum: ['READ', 'UNREAD'] },
  type: { type: Schema.Types.String, required: true, enum: ['SYSTEM', 'CHAT'] },
  sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdDate: { type: Schema.Types.Number, required: true, default: Date.now() }
});

const Message: Model<MessageDocument> = model<MessageDocument, Model<MessageDocument>>('Message', schema);

export default Message;
