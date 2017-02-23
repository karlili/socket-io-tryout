
var path = require('path');
var express = require('express');

var app = express();


console.log("Current Directory", __dirname);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  //res.send('<h1>Hello world</h1>'); 
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function () {
  console.log('listening on *:3000');
});

var io = require('socket.io')(server);
io.on('connection', function (socket) {

  //Trigger when message received  
  socket.on('message', function (messageBundle) {
    console.log(messageBundle.username, messageBundle.message);
    socket.broadcast.emit('receive_message', messageBundle);
  });

  //Trigger when client disconnect
  socket.on('disconnect', function () {
    console.log('User disconnected');
  })


});