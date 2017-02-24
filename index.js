
var path = require('path');
var express = require('express');

var app = express();


console.log("Current Directory", __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.get('/', function (req, res) {
  //res.send('<h1>Hello world</h1>'); 
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function () {
  console.log('listening on *:3000');
});

var io = require('socket.io')(server);
var p2pserver = require('socket.io-p2p-server').Server

//If we want to enable p2p signalling to all clients
io.use(p2pserver);
io.on('connection', function (socket) {

  console.log("User connected (", socket.id, ") ");

  //if we only want to enable the p2p signalling to a particular room
  //then we have to enable it here 
  //p2pserver(socket, null, room_name);

  //to join a room
  socket.on('room', function (room) {
    console.log("Room ", room, "joined");
    socket.join(room);
  });

  //Trigger when message received  
  socket.on('message', function (messageBundle) {
    console.log("(", messageBundle.username, ")", messageBundle.message);
    socket.broadcast.emit('receive_message', messageBundle);
  });

  //Trigger when client disconnect
  socket.on('disconnect', function () {
    console.log('User disconnected');
  })
});
