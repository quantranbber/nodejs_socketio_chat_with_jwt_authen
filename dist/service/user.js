"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserSocketService {
    constructor() {
        this.users = [];
    }
    // Join user to chat
    userJoin(id, username, room) {
        const user = this.users.find(obj => obj.id === id);
        if (user) {
            user.room.push(room);
        }
        else {
            const newUser = { id, username, [room]:  };
            this.users.push(newUser);
        }
        return user;
    }
    // Get current user
    getCurrentUser(id) {
        return this.users.find(user => user.id === id);
    }
    // User leaves chat
    // eslint-disable-next-line consistent-return
    userLeave(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }
    // Get room users
    getRoomUsers(room) {
        return this.users.filter(user => user.room === room);
    }
}
exports.default = new UserSocketService();
//# sourceMappingURL=user.js.map