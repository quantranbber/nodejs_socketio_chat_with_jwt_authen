import socketIo from 'socket.io';
import { UserDocument } from '../entity/User';
import UserService from '../api/user/service';
import Room from '../entity/Room';
import Message, { MessageDocument } from '../entity/Message';

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
}

export default new MessageService();
