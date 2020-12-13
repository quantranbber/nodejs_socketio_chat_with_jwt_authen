import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { RequestHandler, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import UserService from './service';
import { UserDocument } from '../../entity/User';

const secret = process.env.JWT_KEY;

export const create: RequestHandler = async (req: Request, res: Response, next) => {
  const { body } = req;
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  try {
    res.send(await UserService.create(body));
  } catch (err) {
    next(err);
  }
};
export const login: RequestHandler = async (req: Request, res: Response, next) => {
  const { body } = req;
  const user: UserDocument = await UserService.getUserByUsername(body.username);
  const result = compareSync(body.password, user.password);
  if (result) {
    user.password = undefined;
    const jsontoken = sign({ result: user }, secret, {
      expiresIn: '1h'
    });
    res.send({
      success: 1,
      message: 'login successfully',
      token: jsontoken
    });
  } else {
    res.send({
      success: 0,
      data: 'Invalid email or password'
    });
  }
};

export default { create, login };
