var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var users = [];

// start the server
server.listen(80);

// serving main page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// serving user connection
io.sockets.on('connection', function (socket) {
  var user = {
    socket: socket,
    connected: 'undefined',
    name: 'undefined'
  };

  // welcome message to the user
  socket.emit('system', {
    type: 'connected',
    user: 'Chat.js',
    body: 'You are now connected to Chat.js v0.01a'
  });
 
  // user has set his name (authencticated)
  socket.on('set name', function (name) {
  	socket.set('name', name, function () {
      user.name = name;
      users.push(user); // add into user list

      // inform user that he is authenticated
      socket.emit('system', {
        type: 'name set',
        user: 'Chat.js',
        name: name,
        body: 'You are now known as ' + name
      });

      // broadcast user join to others
  		socket.broadcast.emit('system', {
        type: 'joined',
        user: 'Chat.js',
        name: name,
        body: 'User ' + name + ' has joined the chat'
      });
  	});
  });

  // return users list
  socket.on('get users', function () {
    socket.emit('users', users);
  });

  // user sent a message
  socket.on('message', function (data) {
  	socket.get('name', function (err, name) {
  		io.sockets.emit('message', {
        user: name, body: data
      });
  	});
  });

  // user left the chat
  socket.on('disconnect', function () {
  	socket.broadcast.emit('system', {
      type: 'left',
      user: 'Chat.js',
      name: user.name,
      body: 'User ' + user.name + ' has left the chat.'
    });
  });
});