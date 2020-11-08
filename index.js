var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const formatMessage = require('./utils/messages');

//  modify user in database
const {
      create,
      getUserByUserId,
      getUserByUsername,
      getUsers,
      updateUser,
      deleteUser
} = require('./api/user/service');

//  modify user in active logged in
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./service/user');

//  hash password
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const botName = 'ChatCord Bot';

require('dotenv').config({path : './process.env'});
var port = process.env.PORT;
var secret = process.env.JWT_KEY;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  if (req.cookies['jwt-token'] !== undefined) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.get('/home', function(req, res){
  if (req.cookies['jwt-token'] !== undefined) {
    res.sendFile(__dirname + '/template/html/index.html');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/template/html/login.html');
});

// let routes = require('./api/user/router');
// routes(app);

io.on('connection', function(socket) {
  socket.on('login', function(data) {
    getUserByUsername(data.username, (err, results) => {
      if (err) {
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
          const jsontoken = sign({ result: results }, secret, {
            expiresIn: "1h"
          });
          var destination = '/home';
          io.emit('auth', jsontoken);
          io.emit('redirect', destination);
          const user = userJoin(socket.id, data.username);
          socket.broadcast
              .to('activeUsers')
              .emit(
                  'message',
                  formatMessage(botName, `${user.username} has joined the chat`)
              );

          io.to('activeUsers').emit('roomUsers', {
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

  socket.on('chatMessage', function(msg) {
    io.emit('chatMessage', msg);
  });

  socket.on('join', function (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return false;
      } else {
        const user = userJoin(socket.id, decoded.result.username);
        socket.broadcast
            .to('activeUsers')
            .emit(
                'message',
                formatMessage(botName, `${decoded.result.username} has rejoined the chat`)
            );
        io.to('activeUsers').emit('roomUsers', {
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
      io.to('activeUsers').emit(
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

http.listen(port, function() {
  console.log('listening on *:' + port);
});
