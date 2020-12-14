import socketIo from 'socket.io';
import jwt, { sign } from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import UserService from '../api/user/service';
import UserSocketService from './user';
import formatMessage from '../utils/messages';
import { UserDocument } from '../entity/User';

module.exports = function (io: socketIo.Server) {
  const secret = process.env.JWT_KEY;
  const botName = 'ChatCord Bot';

  io.on('connection', socket => {
    // eslint-disable-next-line consistent-return
    socket.on('login', async (data: { username: string; password: string; }) => {
      const userByName = await UserService.getUserByUsername(data.username);
      if (!userByName) {
        io.emit('error-login');
        return false;
      }
      try {
        const result = compareSync(data.password, userByName.password);
        if (result) {
          userByName.password = undefined;
          const jsontoken = sign({ result: userByName }, secret, {
            expiresIn: '1h'
          });
          const destination = '/home';
          io.emit('auth', jsontoken);
          io.emit('redirect', destination);
          const user = UserSocketService.userJoin(socket.id, data.username, 'activeUsers');
          socket.join(user.room);
          socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
          );

          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: UserSocketService.getRoomUsers(user.room)
          });
          // eslint-disable-next-line no-console
          console.log(`${data.username} has joined the chat`);
        } else {
          io.emit('error-login');
          return false;
        }
      } catch (err) {
        return false;
      }
    });

    // eslint-disable-next-line consistent-return
    socket.on('register', async (data: any) => {
      if (data.username === '' || data.password === '' || data.gender === '') {
        // eslint-disable-next-line no-console
        console.log('all fields required');
        return false;
      }
      try {
        const userByName: UserDocument = await UserService.getUserByUsername(data.username);
        if (userByName) {
          // eslint-disable-next-line no-console
          console.log('user existed');
          io.emit('user-existed');
          return false;
        }
        const userCreated = await UserService.create(data);
        if (userCreated) {
          const destination = '/login';
          io.emit('success-register');
          io.emit('redirect', destination);
        }
      } catch (err) {
        return false;
      }
    });

    socket.on('chatMessage', msg => {
      const user = UserSocketService.getCurrentUser(socket.id);

      io.to(user.room).emit('chatMessage', formatMessage(user.username, msg));
    });

    socket.on('join', token => {
      // eslint-disable-next-line consistent-return
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
          if (err.expiredAt < new Date()) {
            io.emit('expired-token');
          }
          return false;
        }
        const data: any = {};
        data.username = decoded.result.username;
        data.token = token;
        io.emit('get-username', data);
        const user = UserSocketService.userJoin(socket.id, decoded.result.username, 'activeUsers');
        socket.join(user.room);
        socket.broadcast.to(user.room).emit(
          'message',
          formatMessage(botName, `${decoded.result.username} has rejoined the chat`)
        );
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: UserSocketService.getRoomUsers(user.room)
        });
        // eslint-disable-next-line no-console
        console.log(`${decoded.result.username} rejoined the chat.`);
      });
    });

    socket.on('disconnect', () => {
      const user = UserSocketService.userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );

        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: UserSocketService.getRoomUsers(user.room)
        });
        // eslint-disable-next-line no-console
        console.log(`${user.username} has left the chat`);
      }
    });
  });
};
