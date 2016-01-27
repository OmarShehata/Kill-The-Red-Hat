var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //A new user has connected!
  
});


http.listen(2095, function(){
  console.log('listening on *:2095');
});