var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

require('dotenv').config({path : './process.env'});
var port = process.env.PORT;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./api/common_endpoint')(app, __dirname);
require('./api/user/router')(app);

require('./service/socket')(io);

http.listen(port, function() {
  console.log('listening on *:' + port);
});
