import dotenv from 'dotenv';
import HTTP from 'http';
import socketIo from 'socket.io';
import MongoConnection from './db';
import app from './app';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: './process.env' });
}

const mongoConnection = new MongoConnection(process.env.MONGO_DB_URL);
const port = process.env.PORT;
const http = new HTTP.Server(app);
const io = socketIo(http);

require('./service/socket')(io);

mongoConnection.connect(() => {
  http.listen(port, (): void => {
        console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
      `🌏 Express server started at http://localhost:${port}`);
  });
});
