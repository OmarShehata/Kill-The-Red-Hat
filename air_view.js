$(function(){
	//Initialize canvas
	var width =  $("#canvas").width();
	var height = $("#canvas").height();
	var ctx = $('#canvas')[0].getContext("2d");
	var circleArray = []
	//Remove threejs container
	$('#threejs_container').remove()

	//Get the circle positions from the server
	var socket = io();
	socket.on('circle-array', function(msg){
		circleArray = JSON.parse(msg);
		Draw()
	});
	function DrawBounds(){
		ctx.fillStyle = "#FF0000";//red is right
		ctx.fillRect(800-10,0,800-10,600);

		ctx.fillStyle = "#00FF00";//green is left
		ctx.fillRect(0,0,10,600);

		ctx.fillStyle = "#FF00FF";//pink is top
		ctx.fillRect(0,0,800,10);

		ctx.fillStyle = "#0000FF";//blue is bottom
		ctx.fillRect(0,600-10,800,600-10);
	}
	//Clear all and draw circles
	function Draw(){
		//Clear screen
		ctx.clearRect(0, 0, width, height);

		//Draw the circles
		for(var i=0;i<circleArray.length;i++){
			var c = circleArray[i];
			ctx.fillStyle = "#FF0000";
			ctx.beginPath();
			ctx.arc(c.x, c.y, 10, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		}
		DrawBounds()
	}

	//If clicked on a dot, either win or lose
	function getMousePos(evt) {
		var canvas = $('#canvas')[0];
		//Obtained from http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

	//Get mouse coordinates when click in canvas
	$('#canvas')[0].addEventListener('mouseup',function(evt){
		var mouse = getMousePos(evt)
		//Check the dot at this positions
		console.log(mouse)
		for(var i=0;i<circleArray.length;i++){
			var circle = circleArray[i];
			var distX = circle.x - mouse.x; 
			var distY = circle.y - mouse.y;
			var dist = Math.sqrt(distX * distX + distY * distY);
			if(dist < 20){
				if(circle.type == "red"){
					//Win!
					$('body').append("<h1>You won!</h1>")
				} else {
					//Lose!
					$('body').append("<h1>You lost!</h1>")
				}
				$('#canvas').remove()
				break;
			}
		}
	})
})