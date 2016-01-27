var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gameloop = require('node-gameloop');


///////////Game loop
var fps = 60;
var circleArray = []
var numCircles = 2;
var radius = 10;
//The server assumes a screen size of 800x600
function init(){
  //Initialize the circles and such
  for(var i=0;i<numCircles;i++){
    var circ = {};
    circ.x = Math.random() * 800;
    circ.y = Math.random() * 600;
    circ.angle = Math.random() * Math.PI * 2;
    circ.targetAngle = circ.angle;
    circ.timerMax = 3;
    circ.randTimer = Math.random() * circ.timerMax;
    circ.type = "white";
    circleArray.push(circ);
  }
  //Only one circle is the red one
  var redCircle = circleArray[circleArray.length-1];
  redCircle.type = "red";
  redCircle.x = 0;
  redCircle.y = 0;

}

init()

gameloop.setGameLoop(function(delta) {
  //Make the circles move 
  for(var i=0;i<circleArray.length;i++){
    var c = circleArray[i];
    c.x += Math.cos(c.angle) * delta * 100;
    c.y += Math.sin(c.angle) * delta * 100;
    c.randTimer -= delta;
    if(c.randTimer < 0){
      c.randTimer = Math.random() * c.timerMax;
      c.targetAngle = Math.random() * Math.PI * 2;
    }
    c.angle += (c.targetAngle - c.angle) * delta * 1;
    //Asteroids-style wrapping around screen
    if(c.x > 800+radius) c.x = -radius; 
    if(c.x < -radius) c.x = 800+radius;
    if(c.y < -radius) c.y = 600+radius;
    if(c.y > 600+radius) c.y = -radius;
  }
  //Broadcast the positions of the circles to everyone
  io.emit("circle-array",JSON.stringify(circleArray))
}, 1000 / fps);

/////////////Socket.io accept connections
io.on('connection', function(socket){
  //A new user has connected!
  console.log("Hello user!")
});

///////////////Start the server and such
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/air_view.js', function(req, res){
  res.sendFile(__dirname + '/air_view.js');
});
app.get('/3d_view.js', function(req, res){
  res.sendFile(__dirname + '/3d_view.js');
});
//Make the 3d resource available
app.use('/textures',express.static('textures'))
app.use('/js',express.static('js'))

http.listen(2095, function(){
  console.log('listening on *:2095');
});