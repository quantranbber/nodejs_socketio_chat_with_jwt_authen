class UserSocketService {
    public users: { id: string; username: string; room: string; }[] = [];

    // Join user to chat
    public userJoin(id: string, username: string, room: string) {
      const user = { id, username, room };
      this.users.push(user);
      return user;
    }

    // Get current user
    public getCurrentUser(id: string) {
      return this.users.find(user => user.id === id);
    }

    // User leaves chat
    // eslint-disable-next-line consistent-return
    public userLeave(id: string) {
      const index = this.users.findIndex(user => user.id === id);

      if (index !== -1) {
        return this.users.splice(index, 1)[0];
      }
    }

    // Get room users
    public getRoomUsers(room: string) {
      return this.users.filter(user => user.room === room);
    }
}

export default new UserSocketService();
