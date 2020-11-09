module.exports = function (io) {
    const jwt = require("jsonwebtoken");
    const formatMessage = require('../utils/messages');
    const secret = process.env.JWT_KEY;
    const Q = require("q");

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
                    io.emit('error-login-server');
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
                        const user = userJoin(socket.id, data.username, 'activeUsers');
                        socket.join(user.room);
                        socket.broadcast.to(user.room).emit(
                                'message',
                                formatMessage(botName, `${user.username} has joined the chat`)
                        );

                        io.to(user.room).emit('roomUsers', {
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

        socket.on('register', async function (data) {
            const salt = genSaltSync(10);
            data.password = hashSync(data.password, salt);
            if (data.username === '' || data.password === '' || data.gender === '') {
                console.log("all fields required");
                return false;
            }
            getUserByUsername(data.username, (err, results) => {
                var isExist = false;
                if (results) {
                    isExist = true;
                }
                if (isExist) {
                    console.log("user existed");
                    io.emit('user-existed');
                    return false;
                } else {
                    create(data, (err, results) => {
                        if (err) {
                            io.emit('error-register');
                            console.log(err);
                            return false;
                        }
                        if (!results) {
                            io.emit('error-register');
                            return false;
                        } else {
                            var destination = '/login';
                            io.emit('success-register');
                            io.emit('redirect', destination);
                        }
                    });
                }
            });
        });

        socket.on('chatMessage', function (msg) {
            const user = getCurrentUser(socket.id);

            io.to(user.room).emit('chatMessage', formatMessage(user.username, msg));
        });

        socket.on('join', function (token) {
            jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
                if (err) {
                    if (err.expiredAt < new Date()) {
                        io.emit('expired-token');
                    }
                    return false;
                } else {
                    var data = {};
                    data.username = decoded.result.username;
                    data.token = token;
                    io.emit('get-username', data);
                    const user = userJoin(socket.id, decoded.result.username, 'activeUsers');
                    socket.join(user.room);
                    socket.broadcast.to(user.room).emit(
                            'message',
                            formatMessage(botName, `${decoded.result.username} has rejoined the chat`)
                    );
                    io.to(user.room).emit('roomUsers', {
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
                io.to(user.room).emit(
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