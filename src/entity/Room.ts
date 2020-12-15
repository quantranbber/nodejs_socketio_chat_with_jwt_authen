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

export const findRoomByUserIds = async (userId1: string, userId2: string): Promise<RoomDocument> => Room.findOne({
  $or: [
    {
      requester: userId1,
      accepter: userId2
    }, {
      requester: userId2,
      accepter: userId1
    }
  ]
});

export default Room;
