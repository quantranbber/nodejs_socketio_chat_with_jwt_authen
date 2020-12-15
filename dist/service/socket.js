"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const service_1 = __importDefault(require("../api/user/service"));
const user_1 = __importDefault(require("./user"));
const messages_1 = __importDefault(require("../utils/messages"));
const Room_1 = __importStar(require("../entity/Room"));
module.exports = function (io) {
    const secret = process.env.JWT_KEY;
    const botName = 'ChatCord Bot';
    io.on('connection', socket => {
        // eslint-disable-next-line consistent-return
        socket.on('login', (data) => __awaiter(this, void 0, void 0, function* () {
            const userByName = yield service_1.default.getUserByUsername(data.username);
            if (!userByName) {
                io.emit('error-login');
                return false;
            }
            try {
                const result = bcrypt_1.compareSync(data.password, userByName.password);
                if (result) {
                    userByName.password = undefined;
                    const jsontoken = jsonwebtoken_1.sign({ result: userByName }, secret, {
                        expiresIn: '1h'
                    });
                    const destination = '/home';
                    io.emit('auth', jsontoken);
                    io.emit('redirect', destination);
                    const user = user_1.default.userJoin(socket.id, data.username, 'activeUsers');
                    socket.join(user.room);
                    socket.broadcast.to(user.room).emit('message', messages_1.default(botName, `${user.username} has joined the chat`));
                    io.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: user_1.default.getRoomUsers(user.room)
                    });
                    // eslint-disable-next-line no-console
                    console.log(`${data.username} has joined the chat`);
                }
                else {
                    io.emit('error-login');
                    return false;
                }
            }
            catch (err) {
                return false;
            }
        }));
        // eslint-disable-next-line consistent-return
        socket.on('register', (data) => __awaiter(this, void 0, void 0, function* () {
            if (data.username === '' || data.password === '' || data.gender === '') {
                // eslint-disable-next-line no-console
                console.log('all fields required');
                return false;
            }
            try {
                const userByName = yield service_1.default.getUserByUsername(data.username);
                if (userByName) {
                    // eslint-disable-next-line no-console
                    console.log('user existed');
                    io.emit('user-existed');
                    return false;
                }
                const userCreated = yield service_1.default.create(data);
                if (userCreated) {
                    const destination = '/login';
                    io.emit('success-register');
                    io.emit('redirect', destination);
                }
            }
            catch (err) {
                return false;
            }
        }));
        socket.on('chatMessage', msg => {
            const user = user_1.default.getCurrentUser(socket.id);
            io.to(user.room).emit('chatMessage', messages_1.default(user.username, msg));
        });
        socket.on('joinRoom', (userId) => __awaiter(this, void 0, void 0, function* () {
            const user1 = user_1.default.getCurrentUser(socket.id);
            const user1ByName = yield service_1.default.getUserByUsername(user1.username);
            const user2 = user_1.default.getCurrentUser(userId);
            const user2ByName = yield service_1.default.getUserByUsername(user2.username);
            const room = yield Room_1.findRoomByUserIds(user1ByName._id.toString(), user2ByName._id.toString());
            if (room) {
                io.to(room._id.toString()).emit('chatMessage', messages_1.default(botName, 'connected!!!'));
            }
            else {
                const newRoom = {
                    requester: user1ByName._id.toString(),
                    accepter: user2ByName._id.toString()
                };
                let roomSaved = new Room_1.default(newRoom);
                roomSaved = yield roomSaved.save();
                io.to(roomSaved._id.toString()).emit('chatMessage', messages_1.default(botName, 'connected!!!'));
            }
        }));
        socket.on('join', token => {
            // eslint-disable-next-line consistent-return
            jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
                if (err) {
                    if (err.expiredAt < new Date()) {
                        io.emit('expired-token');
                    }
                    return false;
                }
                const data = {};
                data.username = decoded.result.username;
                data.token = token;
                io.emit('get-username', data);
                const user = user_1.default.userJoin(socket.id, decoded.result.username, 'activeUsers');
                socket.join(user.room);
                socket.broadcast.to(user.room).emit('message', messages_1.default(botName, `${decoded.result.username} has rejoined the chat`));
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: user_1.default.getRoomUsers(user.room)
                });
                // eslint-disable-next-line no-console
                console.log(`${decoded.result.username} rejoined the chat.`);
            });
        });
        socket.on('disconnect', () => {
            const user = user_1.default.userLeave(socket.id);
            if (user) {
                io.to(user.room).emit('message', messages_1.default(botName, `${user.username} has left the chat`));
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: user_1.default.getRoomUsers(user.room)
                });
                // eslint-disable-next-line no-console
                console.log(`${user.username} has left the chat`);
            }
        });
    });
};
//# sourceMappingURL=socket.js.map