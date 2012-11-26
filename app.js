var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var users = [];

server.listen(80);

// serving main page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// serving user connection
io.sockets.on('connection', function (socket) {
  var username;

  socket.broadcast.emit('user connected');

  socket.emit('message', { body: 'You are now connected to Chat.js v0.01a' });
 
  // user has set his name 
  socket.on('set name', function (name) {
  	socket.set('name', name, function () {
      username = name;
      users.push(username);
  		socket.emit('status', {status: 'ready', name: name});
  	});
  });

  // user sent a message
  socket.on('message', function (data) {
  	socket.get('name', function (err, name) {
  		io.sockets.emit('message', {name: name, body: data});
  	});
  });

  socket.on('disconnect', function () {
    users.indexOf(username);
  	io.sockets.emit('user disconnected');
  });
});