import { RequestHandler, Response } from 'express';

const jwt = require('jsonwebtoken');

export const checkToken: RequestHandler = async (req: any, res: Response, next) => {
  let token = req.get('authorization');
  if (token) {
    token = token.slice(7);
    jwt.verify(token, process.env.JWT_KEY, (err: any, decoded: any) => {
      if (err) {
        return res.send({
          success: 0,
          message: 'Invalid Token...'
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.send({
      success: 0,
      message: 'Access Denied! Unauthorized User'
    });
  }
};

export default { checkToken };
