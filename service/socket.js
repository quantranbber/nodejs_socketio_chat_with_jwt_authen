module.exports = function (io) {
    const jwt = require("jsonwebtoken");
    const formatMessage = require('../utils/messages');
    const secret = process.env.JWT_KEY;

    //  modify user in database
    const {
        create,
        getUserByUserId,
        getUserByUsername,
        getUsers,
        updateUser,
        deleteUser
    } = require('../api/user/service');

    //  modify user in active logged in
    const {
        userJoin,
        getCurrentUser,
        userLeave,
        getRoomUsers
    } = require('../service/user');

    //  hash password
    const { hashSync, genSaltSync, compareSync } = require("bcrypt");
    const { sign } = require("jsonwebtoken");

    const botName = 'ChatCord Bot';


    io.on('connection', function (socket) {
        socket.on('login', function (data) {
            getUserByUsername(data.username, (err, results) => {
                if (err) {
                    console.log(err)
                    return false;
                }
                if (!results) {
                    io.emit('error-login');
                    return false;
                } else {
                    const result = compareSync(data.password, results.password);
                    if (result) {
                        results.password = undefined;
                        const jsontoken = sign({result: results}, secret, {
                            expiresIn: "1h"
                        });
                        var destination = '/home';
                        io.emit('auth', jsontoken);
                        io.emit('redirect', destination);
                        const user = userJoin(socket.id, data.username);
                        socket.broadcast
                            .to('activeUsers')
                            .emit(
                                'message',
                                formatMessage(botName, `${user.username} has joined the chat`)
                            );

                        io.to('activeUsers').emit('roomUsers', {
                            room: user.room,
                            users: getRoomUsers(user.room)
                        });
                        console.log(data.username + ' has joined the chat');
                    } else {
                        io.emit('error-login');
                        return false;
                    }
                }
            });
        });

        socket.on('chatMessage', function (msg) {
            io.emit('chatMessage', msg);
        });

        socket.on('join', function (token) {
            jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
                if (err) {
                    return false;
                } else {
                    const user = userJoin(socket.id, decoded.result.username);
                    socket.broadcast
                        .to('activeUsers')
                        .emit(
                            'message',
                            formatMessage(botName, `${decoded.result.username} has rejoined the chat`)
                        );
                    io.to('activeUsers').emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room)
                    });
                    console.log(decoded.result.username + ' rejoined the chat.');
                }
            });
        });

        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to('activeUsers').emit(
                    'message',
                    formatMessage(botName, `${user.username} has left the chat`)
                );

                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
                console.log(user.username + ' has left the chat');
            }
        });
    });
}