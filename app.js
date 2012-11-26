var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

// serving main page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// serving user connection
io.sockets.on('connection', function (socket) {
  socket.broadcast.emit('user connected');

  socket.emit('message', { body: 'You are connected to Boogiech Chat v0.01a' });
  
  socket.on('set name', function (name) {
  	socket.set('name', name, function () {
  		socket.emit('status', {status: 'ready', name: name});
  	});
  });

  socket.on('message', function (data) {
  	socket.get('name', function (err, name) {
  		io.sockets.emit('message', {name: name, body: data});
  	});
  });

  socket.on('disconnect', function () {
  	io.sockets.emit('user disconnected');
  });
});