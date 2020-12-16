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

    // Get current user
    public getUserByName(name: string) {
      return this.users.find(user => user.username === name);
    }

    // User leaves chat
    // eslint-disable-next-line consistent-return
    public async userLeave(id: string) {
      const result: any[] = [];
      const indexs: number[] = await this.users.map((user, index) => {
        if (user.id === id) {
          return index;
        }
      });
      for (const index of indexs) {
        if (index !== -1 && index !== undefined) {
          result.push(this.users.splice(index, 1)[0]);
          break;
        }
      }
      return result[0];
    }

    // Get room users
    public getRoomUsers(room: string) {
      return this.users.filter(user => user.room === room);
    }
}

export default new UserSocketService();
