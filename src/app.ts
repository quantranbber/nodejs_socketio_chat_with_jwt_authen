import express from 'express';
import HTTP from 'http';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import commonRoutes from './router';
import * as socket from './service/socket';

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

const http = new HTTP.Server(app);
const io = socketIo(http);
const parser = bodyParser;
const cookieParser = CookieParser;

require('dotenv').config({ path: './process.env' });

app.use(cookieParser());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use('/', commonRoutes);
socket.socketConnect(io);

export default app;
