import socketIo from 'socket.io';
import { UserDocument } from '../entity/User';
import UserService from '../api/user/service';
import Room, { findRoomByUserId, RoomDocument } from '../entity/Room';
import Message, { MessageDocument } from '../entity/Message';
import { Conversation } from './models/Conversation';

const moment = require('moment');

class MessageService {
  public formatMessage(username: string, text: string) {
    return {
      username,
      text,
      time: moment().format('h:mm a')
    };
  }

  public async sendMessage(io: socketIo.Server, senderName: any, content: string, type: string) {
    let receiver = null as UserDocument;
    const sender = await UserService.getUserByUsername(senderName.username);
    const room = await Room.findOne({ _id: senderName.room });
    if (room) {
      if (room.requester === sender._id.toString()) {
        receiver = await UserService.getUserByUserId(room.accepter);
      } else {
        receiver = await UserService.getUserByUserId(room.requester);
      }
    }
    try {
      if (receiver) {
        let message;
        switch (type) {
          case 'CHAT':
            message = {
              room: room._id.toString(),
              content,
              sender: sender._id.toString(),
              receiver: receiver._id.toString(),
              status: 'UNREAD',
              createdDate: Date.now(),
              type
            } as MessageDocument;
            break;
          default:
            message = {
              room: null,
              content,
              sender: null,
              receiver: sender._id.toString(),
              status: 'UNREAD',
              createdDate: Date.now(),
              type
            } as MessageDocument;
        }
        const newMessage = new Message(message);
        await newMessage.save();
      }
    } catch (err) {
      io.to(senderName.room).emit('error-chat');
    }
  }

  public async getAllConversations(userId: string): Promise<Conversation[]> {
    try {
      let conversations: Conversation[] = [];
      const roomsOfCurrUser: RoomDocument[] = await findRoomByUserId(userId.toString());
      const allRoomIds = roomsOfCurrUser.map(room => room._id);
      const messagesOfUser: MessageDocument[] = await Message
        .find({
          room: {
            $in: allRoomIds
          }
        })
        .sort({
          createdDate: -1
        });
      allRoomIds.forEach(room => {
        const toPut = {} as Conversation;
        const messagesInRoom = messagesOfUser.filter(m => (m.room.toString() === room.toString() && m.status === 'UNREAD'));
        const latestMessage = messagesOfUser.filter(m => m.room.toString() === room.toString())[0];
        toPut.room = room.toString();
        toPut.numberOfUnread = messagesInRoom.length;
        toPut.latestMessage = latestMessage;
        conversations.push(toPut);
      });
      conversations = conversations
        .sort((a, b) => (a.latestMessage?.createdDate > b.latestMessage?.createdDate ? 1 : -1));
      return conversations;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new MessageService();
