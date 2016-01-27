$(function(){
	//Initialize canvas
	var width =  $("#canvas").width();
	var height = $("#canvas").height();
	var ctx = $('#canvas')[0].getContext("2d");
	var circleArray = []

	//Get the circle positions from the server
	var socket = io();
	socket.on('circle-array', function(msg){
		circleArray = JSON.parse(msg);
		Draw()
	});
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
	}
})