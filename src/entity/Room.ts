import {
  Document, model, Model, Schema
} from 'mongoose';

export class RoomDocument extends Document {
    requester: string;

    accepter: string;
}

const schema = new Schema({
  requester: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  accepter: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

const Room: Model<RoomDocument> = model<RoomDocument, Model<RoomDocument>>('Room', schema);

export default Room;
