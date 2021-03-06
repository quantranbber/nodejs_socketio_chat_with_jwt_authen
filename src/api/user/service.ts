import { genSaltSync, hashSync } from 'bcrypt';
import User, { UserDocument } from '../../entity/User';

class UserService {
  public async create(data: any): Promise<string> {
    const user = {
      username: data.username,
      avatar: data.avatar || '',
      gender: data.gender
    } as UserDocument;
    const salt = genSaltSync(10);
    user.password = hashSync(data.password, salt);
    const newUser = await new User(user);
    await newUser.save();
    return newUser._id.toString();
  }

  public async getUserByUsername(username: string): Promise<UserDocument> {
    return User.findOne({ username });
  }

  public async getUserByUserId(id: string) {
    return User.findOne({
      _id: id
    });
  }

  public async searchUsersByName(username: string): Promise<UserDocument[]> {
    return User.find({
      username: new RegExp(`.*${username.trim()}.*`, 'i')
    });
  }
}

export default new UserService();
